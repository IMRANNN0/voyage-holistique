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
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from "react";

import { trackBookingModal, trackFormEvent, trackWhatsAppContactClick } from "@/lib/tracking";
import { DEFAULT_WHATSAPP_MESSAGE, getWhatsAppUrl } from "@/lib/tracking";

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
 * Apps Script handler — copy / paste this EXACT version into Code.gs and
 * redeploy as a new Web App version. Anything older (especially versions
 * with `landing_page`, `experience`, `source`, `offer`, `page`,
 * `section_name`, `button_text`, `device_type`, `page_path`, etc. inside
 * the appendRow array) will keep shifting `price` to column K and
 * `cta_location` to column L, even after the sheet headers are deleted.
 *
 * Sheet row 1 must read exactly (A → J):
 *   timestamp | name | phone | email | city | guests | intent | message | price | cta_location
 *
 *   function doPost(e) {
 *     const data = JSON.parse(e.postData.contents);
 *     const sheet = SpreadsheetApp.getActiveSheet();
 *     const rowValues = [
 *       data.timestamp || "",
 *       data.name || "",
 *       data.phone || "",
 *       data.email || "",
 *       data.city || "",
 *       data.guests || "",
 *       data.intent || "",
 *       data.message || "",
 *       data.price || "Seulement 7 960 DH",
 *       data.cta_location || ""
 *     ];
 *     console.log("append row values:", rowValues, rowValues.length);
 *     sheet.appendRow(rowValues);
 *     return ContentService.createTextOutput("ok");
 *   }
 *
 * After saving: Deploy → Manage deployments → edit current deployment →
 * Version: New version → Deploy. Old versions keep using their cached
 * appendRow shape, so a new version is required.
 *
 * The fetch is sent with mode: "no-cors" + Content-Type: text/plain to avoid
 * the CORS preflight. The response is opaque, so we treat any non-throw as
 * success. Credentials never live in the frontend.
 */
const WEBHOOK_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL ?? "";
const RETREAT_DATES = "Du 12 au 15 juin";
const RETREAT_PRICE = "Seulement 7 960 DH";
const FORM_NAME = "voyage_holistique_booking";
const LEAD_TYPE = "booking_request";
const LEAD_VALUE = 7960;
const CURRENCY = "MAD";

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
type BookingModalCloseReason = "overlay" | "button" | "escape" | "success_button" | "programmatic";

/* ─── context ──────────────────────────────────────────────── */
type BookingContextValue = {
  open: (ctaLocation?: string) => void;
  close: (reason?: BookingModalCloseReason) => void;
  /** True once the user has clicked any "Réserver" CTA at least once. */
  hasBeenOpened: boolean;
  isOpen: boolean;
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
    setHasBeenOpened(true);
    setIsOpen((wasOpen) => {
      if (!wasOpen) {
        trackBookingModal("open", {
          cta_location: location,
        });
      }
      return true;
    });
  }, []);

  const close = useCallback(
    (reason: BookingModalCloseReason = "programmatic") => {
      setIsOpen((wasOpen) => {
        if (wasOpen) {
          trackBookingModal("close", {
            cta_location: ctaLocation,
            close_reason: reason,
          });
        }
        return false;
      });
    },
    [ctaLocation]
  );

  return (
    <BookingModalContext.Provider value={{ open, close, hasBeenOpened, isOpen }}>
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
  onClose: (reason?: BookingModalCloseReason) => void;
  ctaLocation: string;
}) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const formStartedRef = useRef(false);
  const interactedFieldsRef = useRef<Set<keyof FormState>>(new Set());

  useEffect(() => {
    // Helper: fully reset any scroll-locking inline styles we (or anything else)
    // might have added on <body>. Defensive — keeps mobile from getting stuck
    // in a horizontally-shifted state after success/close.
    const resetBody = () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
      });
    } else {
      resetBody();
    }
    return resetBody;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose("escape");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setStatus("idle");
      setErrorMessage("");
      formStartedRef.current = false;
      interactedFieldsRef.current.clear();
    }
  }, [isOpen]);

  const handleChange =
    (key: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const handleFieldFocus =
    (key: keyof FormState) =>
    (_e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (!formStartedRef.current) {
        formStartedRef.current = true;
        trackFormEvent("start", {
          cta_location: ctaLocation,
        });
      }

      if (!interactedFieldsRef.current.has(key)) {
        interactedFieldsRef.current.add(key);
        trackFormEvent("field_interaction", {
          field_name: key,
          cta_location: ctaLocation,
        });
      }
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (status === "submitting") return;

    trackFormEvent("submit_attempt", {
      cta_location: ctaLocation,
      intent: form.intent,
      guests: form.guests,
      value: LEAD_VALUE,
      currency: CURRENCY,
    });

    setStatus("submitting");
    setErrorMessage("");

    const formatReadableDate = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const payload = {
      timestamp: formatReadableDate(new Date()),
      name: form.name || "",
      phone: form.phone || "",
      email: form.email || "",
      city: form.city || "",
      guests: form.guests || "1",
      intent: form.intent || "reserver",
      message: form.message || "",
      price: RETREAT_PRICE,
      cta_location: ctaLocation || "unknown"
    };
    
    if (process.env.NODE_ENV === "development") {
      console.log("[Google Sheets Payload]", payload);
    }

    if (!WEBHOOK_URL) {
      setStatus("error");
      setErrorMessage(
        "La configuration du formulaire n'est pas finalisée. Merci de réessayer dans quelques instants."
      );
      trackFormEvent("submit_error", {
        cta_location: ctaLocation,
        error_reason: "missing_webhook",
      });
      return;
    }

    // Race the webhook against a 5s ceiling so the user never waits forever.
    // With mode:"no-cors" the response is opaque — we can't read success/failure
    // anyway, so once we've dispatched the request we treat it as sent and
    // unblock the UI. The fetch keeps running in the background to actually
    // deliver the row to Apps Script.
    const SUBMIT_TIMEOUT_MS = 5000;

    const fetchPromise = fetch(WEBHOOK_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
    // Always swallow late background failures so they don't surface as
    // unhandled rejections after the UI has already moved on.
    fetchPromise.catch(() => {});

    const timeoutPromise = new Promise<"timeout">((resolve) =>
      setTimeout(() => resolve("timeout"), SUBMIT_TIMEOUT_MS)
    );

    try {
      await Promise.race([fetchPromise, timeoutPromise]);
      setStatus("success");
      // Fire-and-forget tracking — never await, never let it delay the UI.
      trackFormEvent("submit_success", {
        cta_location: ctaLocation,
        intent: form.intent,
        guests: form.guests,
        value: LEAD_VALUE,
        currency: CURRENCY,
      });
    } catch {
      // Only reached on a synchronous network error inside the 5s window
      // (CSP block, invalid URL, offline). Genuine slow-Apps-Script
      // submissions hit the timeout branch above and resolve as success.
      setStatus("error");
      setErrorMessage(
        "Une erreur est survenue lors de l'envoi. Veuillez réessayer dans quelques instants."
      );
      trackFormEvent("submit_error", {
        cta_location: ctaLocation,
        error_reason: "network",
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#040908]/85 backdrop-blur-md p-4 sm:p-5"
          onClick={() => onClose("overlay")}
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex w-full max-w-2xl max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-2.5rem)] flex-col overflow-hidden rounded-[16px] border border-[#d8bd7a]/25 text-[#F8F4ED] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
            style={{ background: "#041B16" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Fermer"
              onClick={() => onClose("button")}
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-[#07120e]/60 text-[#f7f0e4] backdrop-blur transition hover:border-[#d8bd7a]/55 hover:bg-[#07120e]/85 hover:text-[#d8bd7a] sm:right-4 sm:top-4 sm:h-10 sm:w-10"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
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
                onFieldFocus={handleFieldFocus}
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
const THANK_YOU_WHATSAPP_MESSAGE =
  "Bonjour, je viens de soumettre ma demande pour le Voyage Holistique. Je souhaite continuer l'échange avec votre équipe.";

function SuccessView({ onClose }: { onClose: (reason?: BookingModalCloseReason) => void }) {
  const whatsappUrl = getWhatsAppUrl(THANK_YOU_WHATSAPP_MESSAGE);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="px-7 py-10 text-center md:px-12 md:py-12"
    >
      {/* Checkmark */}
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
        Votre demande de participation a bien été reçue. Notre équipe reviendra vers vous
        prochainement afin de confirmer votre inscription et de vous transmettre les informations
        complémentaires.
      </p>

      {/* WhatsApp continuation block */}
      <div
        aria-hidden
        className="mx-auto mt-8 max-w-sm rounded-[14px] border border-[#d8bd7a]/20 bg-[#0b1f18]/60 p-5"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#d8bd7a]/80">
          Pour un échange plus rapide
        </p>
        <p className="mt-2 text-sm leading-6 text-[#cfc6b8]">
          Contactez-nous directement sur WhatsApp pour finaliser votre participation.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackWhatsAppContactClick({
              sectionName: "thank_you",
              buttonText: "Continuer sur WhatsApp",
              messagePrefill: THANK_YOU_WHATSAPP_MESSAGE,
            })
          }
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_28px_rgba(37,211,102,0.35)] transition hover:bg-[#20bd5a] hover:shadow-[0_12px_36px_rgba(37,211,102,0.45)] focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 focus:ring-offset-[#041B16]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.138.564 4.14 1.547 5.87L0 24l6.273-1.524A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.814 9.814 0 01-5.031-1.386l-.36-.214-3.724.975.991-3.628-.235-.373A9.818 9.818 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/>
          </svg>
          Continuer sur WhatsApp
        </a>
      </div>

      {/* Close button */}
      <div className="mt-7 flex justify-center">
        <button
          type="button"
          onClick={() => onClose("success_button")}
          className="inline-flex items-center justify-center rounded-full border border-[#d8bd7a]/30 bg-transparent px-7 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#9d9487] transition hover:border-[#d8bd7a]/55 hover:text-[#d8bd7a]"
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
  onFieldFocus,
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
  onFieldFocus: (
    key: keyof FormState
  ) => (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onIntentChange: (intent: Intent) => void;
  onSubmit: (e: FormEvent) => void;
}) {
  const submitting = status === "submitting";

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto">
      <div className="border-b border-white/10 px-5 pb-6 pt-7 sm:px-7 sm:pt-9 md:px-10 md:pb-7 md:pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8bd7a]">
          Réservation
        </p>
        <h3
          id="booking-modal-title"
          className="font-display mt-3 pr-8 text-3xl font-semibold leading-tight text-[#fbf4e8] sm:pr-0 md:text-4xl"
        >
          Réservez votre place
        </h3>
        <p className="mt-3 text-sm leading-7 text-[#ddd2bf]">
          Voyage Holistique · {RETREAT_DATES} ·{" "}
          <span className="font-semibold whitespace-normal sm:whitespace-nowrap text-[#d8bd7a]">{RETREAT_PRICE}</span> · Places limitées à 20.
        </p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-4 px-5 py-6 sm:px-7 sm:py-7 md:grid-cols-2 md:px-10 md:py-8">
        <LuxField label="Nom complet" required>
          <input
            required
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={onChange("name")}
            onFocus={onFieldFocus("name")}
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
            onFocus={onFieldFocus("phone")}
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
            onFocus={onFieldFocus("email")}
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
            onFocus={onFieldFocus("city")}
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
            onFocus={onFieldFocus("guests")}
            disabled={submitting}
            className={inputClass}
          />
        </LuxField>

        <LuxField label="Message ou besoin particulier" className="md:col-span-2">
          <textarea
            rows={3}
            value={form.message}
            onChange={onChange("message")}
            onFocus={onFieldFocus("message")}
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
