"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";

/**
 * ─── Google Sheet webhook (Apps Script) ─────────────────────
 *
 * Where to paste the webhook URL:
 *   1. Open the Google Sheet:
 *      https://docs.google.com/spreadsheets/d/1HV4HEiXLVFiRgHof6ABhTr5lDa1ogaqe_RufFTrO09w/edit
 *   2. Extensions → Apps Script.
 *   3. Paste the snippet below into Code.gs and save.
 *   4. Deploy → New deployment → Web app
 *      ▸ Execute as: Me
 *      ▸ Who has access: Anyone
 *   5. Copy the resulting `/exec` URL and paste it into `.env.local` as:
 *      NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfyc.../exec
 *   6. Restart `npm run dev`.
 *
 * Suggested Apps Script handler (header row in row 1 recommended):
 *
 *   function doPost(e) {
 *     const d = JSON.parse(e.postData.contents);
 *     SpreadsheetApp.getActiveSheet().appendRow([
 *       d.timestamp, d.name, d.phone, d.email, d.city,
 *       d.guests, d.intent, d.message,
 *       d.source, d.offer, d.price, d.cta_location
 *     ]);
 *     return ContentService.createTextOutput("ok");
 *   }
 *
 * The fetch is sent with mode: "no-cors" + Content-Type: text/plain to avoid
 * the CORS preflight. The response is opaque, so we treat any non-throw as
 * success. Credentials never live in the frontend.
 */
const WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL ?? "";
const RETREAT_DATES = "Du 12 au 15 juin";
const RETREAT_PRICE = "Seulement 7 960 DH";

type Intent = "reserver" | "rappel";

type FormState = {
  name: string;
  phone: string;
  email: string;
  city: string;
  guests: string;
  message: string;
  intent: Intent;
};

const initialForm: FormState = {
  name: "",
  phone: "",
  email: "",
  city: "",
  guests: "1",
  message: "",
  intent: "reserver",
};

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Push a generic event to GTM dataLayer.
 * Never include personal/identifying data — only metadata about the action.
 */
function pushDataLayer(event: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push(event);
}

/* ─── context ──────────────────────────────────────────────── */
type BookingContextValue = {
  open: (ctaLocation?: string) => void;
  close: () => void;
  /** True once the user has clicked any "Réserver" CTA at least once. */
  hasBeenOpened: boolean;
};

const BookingModalContext = createContext<BookingContextValue | null>(null);

export function useBookingModal() {
  const ctx = useContext(BookingModalContext);
  if (!ctx) {
    throw new Error("useBookingModal must be used inside <BookingModalProvider>");
  }
  return ctx;
}

export function BookingModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [ctaLocation, setCtaLocation] = useState<string>("unknown");

  const open = useCallback((location: string = "unknown") => {
    setCtaLocation(location);
    setIsOpen(true);
    setHasBeenOpened(true);
    pushDataLayer({ event: "booking_modal_open", cta_location: location });
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return (
    <BookingModalContext.Provider value={{ open, close, hasBeenOpened }}>
      {children}
      <BookingModal isOpen={isOpen} onClose={close} ctaLocation={ctaLocation} />
    </BookingModalContext.Provider>
  );
}

/* ─── modal ────────────────────────────────────────────────── */
function BookingModal({
  isOpen,
  onClose,
  ctaLocation,
}: {
  isOpen: boolean;
  onClose: () => void;
  ctaLocation: string;
}) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      });
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setErrorMessage("");
    }
  }, [isOpen]);

  const handleChange =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    const payload = {
      timestamp: new Date().toISOString(),
      name: form.name,
      phone: form.phone,
      email: form.email,
      city: form.city,
      guests: form.guests,
      message: form.message,
      intent: form.intent,
      source: "landing_page",
      offer: "Voyage Holistique",
      price: RETREAT_PRICE,
      cta_location: ctaLocation,
    };

    if (!WEBHOOK_URL) {
      setStatus("error");
      setErrorMessage(
        "La configuration du formulaire n'est pas finalisée. Merci de réessayer dans quelques instants."
      );
      pushDataLayer({
        event: "booking_form_submit",
        status: "error",
        cta_location: ctaLocation,
        reason: "missing_webhook",
      });
      return;
    }

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });
      setStatus("success");
      pushDataLayer({
        event: "booking_form_submit",
        status: "success",
        cta_location: ctaLocation,
        intent: form.intent,
      });
    } catch {
      setStatus("error");
      setErrorMessage(
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer dans quelques instants."
      );
      pushDataLayer({
        event: "booking_form_submit",
        status: "error",
        cta_location: ctaLocation,
        reason: "network",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-[#040908]/85 backdrop-blur-md sm:items-center sm:p-5"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-t-[20px] border border-[#d8bd7a]/25 text-[#F8F4ED] shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:rounded-[16px]"
            style={{ background: "#041B16" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#07120e]/60 text-[#f7f0e4] backdrop-blur transition hover:border-[#d8bd7a]/55 hover:bg-[#07120e]/85 hover:text-[#d8bd7a]"
            >
              <X className="h-5 w-5" />
            </button>

            {status === "success" ? (
              <SuccessView onClose={onClose} />
            ) : (
              <FormView
                scrollRef={scrollRef}
                form={form}
                status={status}
                errorMessage={errorMessage}
                onChange={handleChange}
                onIntentChange={(intent) => setForm((prev) => ({ ...prev, intent }))}
                onSubmit={handleSubmit}
              />
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ─── success view ─────────────────────────────────────────── */
function SuccessView({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-7 py-14 text-center md:px-12 md:py-16"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#d8bd7a]/40 bg-[#d8bd7a]/12 text-[#d8bd7a]">
        <Check className="h-8 w-8" />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-[0.32em] text-[#d8bd7a]">
        Demande reçue
      </p>
      <h3
        id="booking-modal-title"
        className="font-display mt-3 text-3xl font-semibold leading-tight md:text-4xl text-[#fbf4e8]"
      >
        Merci pour votre confiance.
      </h3>
      <p className="mx-auto mt-5 max-w-md text-base leading-7 text-[#cfc6b8]">
        Votre demande a bien été reçue. Notre équipe vous contactera rapidement.
      </p>
      <div className="mt-9 flex justify-center">
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center justify-center rounded-full border border-[#d8bd7a]/55 bg-[#d8bd7a]/15 px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#d8bd7a] transition hover:bg-[#d8bd7a]/25"
        >
          Fermer
        </button>
      </div>
    </motion.div>
  );
}

/* ─── form view ────────────────────────────────────────────── */
const inputClass =
  "w-full rounded-[10px] border border-white/15 bg-white/[0.04] px-4 py-3 text-sm text-[#f7f0e4] placeholder:text-[#7a7264] outline-none transition focus:border-[#d8bd7a]/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#d8bd7a]/30 disabled:cursor-not-allowed disabled:opacity-60";

function FormView({
  scrollRef,
  form,
  status,
  errorMessage,
  onChange,
  onIntentChange,
  onSubmit,
}: {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  form: FormState;
  status: Status;
  errorMessage: string;
  onChange: (
    key: keyof FormState
  ) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onIntentChange: (intent: Intent) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const submitting = status === "submitting";

  return (
    <div ref={scrollRef} className="max-h-[92vh] overflow-y-auto">
      <div className="border-b border-white/10 px-7 pb-6 pt-9 md:px-10 md:pb-7 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8bd7a]">
          Réservation
        </p>
        <h3
          id="booking-modal-title"
          className="font-display mt-3 text-3xl font-semibold leading-tight text-[#fbf4e8] md:text-4xl"
        >
          Réservez votre place
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#ddd2bf]">
          Voyage Holistique · {RETREAT_DATES} ·{" "}
          <span className="font-semibold text-[#d8bd7a]">{RETREAT_PRICE}</span> · Places limitées à 20.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 px-7 py-7 md:grid-cols-2 md:px-10 md:py-8">
        <LuxField label="Nom complet" required>
          <input
            required
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={onChange("name")}
            disabled={submitting}
            className={inputClass}
          />
        </LuxField>

        <LuxField label="Téléphone / WhatsApp" required>
          <input
            required
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={onChange("phone")}
            disabled={submitting}
            className={inputClass}
          />
        </LuxField>

        <LuxField label="Email" required>
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange("email")}
            disabled={submitting}
            className={inputClass}
          />
        </LuxField>

        <LuxField label="Ville">
          <input
            type="text"
            autoComplete="address-level2"
            value={form.city}
            onChange={onChange("city")}
            disabled={submitting}
            className={inputClass}
          />
        </LuxField>

        <LuxField label="Nombre de personnes" className="md:col-span-2">
          <input
            type="number"
            min={1}
            max={20}
            value={form.guests}
            onChange={onChange("guests")}
            disabled={submitting}
            className={inputClass}
          />
        </LuxField>

        <LuxField label="Message ou besoin particulier" className="md:col-span-2">
          <textarea
            rows={3}
            value={form.message}
            onChange={onChange("message")}
            disabled={submitting}
            className={`${inputClass} resize-none`}
          />
        </LuxField>



        {status === "error" ? (
          <div className="rounded-[10px] border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-200 md:col-span-2">
            {errorMessage}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={submitting}
            className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#d8bd7a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#07120e] transition duration-300 hover:bg-[#e8cd8a] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Envoi en cours…
              </>
            ) : (
              <>
                Envoyer ma demande
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>

        <p className="text-center text-[11px] uppercase tracking-[0.2em] text-[#6b6258] md:col-span-2">
          Vos informations restent strictement confidentielles.
        </p>
      </form>
    </div>
  );
}

function LuxField({
  label,
  required,
  className,
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-2 ${className ?? ""}`}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9a9080]">
        {label} {required ? <span className="text-[#d8bd7a]">*</span> : null}
      </span>
      {children}
    </label>
  );
}

function IntentChip({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
        active
          ? "border-[#d8bd7a] bg-[#d8bd7a]/15 text-[#d8bd7a]"
          : "border-white/15 bg-white/[0.03] text-[#c9c1b4] hover:border-[#d8bd7a]/45 hover:text-[#f7f0e4]"
      }`}
    >
      {active ? <Check className="h-3.5 w-3.5" /> : null}
      {children}
    </button>
  );
}
