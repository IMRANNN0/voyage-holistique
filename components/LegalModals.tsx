"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type LegalKind = "privacy" | "legal";

type LegalContextValue = {
  openPrivacy: () => void;
  openLegal: () => void;
  close: () => void;
};

const LegalModalContext = createContext<LegalContextValue | null>(null);

export function useLegalModals() {
  const ctx = useContext(LegalModalContext);
  if (!ctx) {
    throw new Error("useLegalModals must be used inside <LegalModalProvider>");
  }
  return ctx;
}

export function LegalModalProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<LegalKind | null>(null);

  const openPrivacy = useCallback(() => setActive("privacy"), []);
  const openLegal = useCallback(() => setActive("legal"), []);
  const close = useCallback(() => setActive(null), []);

  return (
    <LegalModalContext.Provider value={{ openPrivacy, openLegal, close }}>
      {children}
      <LegalModal kind={active} onClose={close} />
    </LegalModalContext.Provider>
  );
}

function LegalModal({ kind, onClose }: { kind: LegalKind | null; onClose: () => void }) {
  const isOpen = kind !== null;
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

  return (
    <AnimatePresence>
      {kind ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[110] flex items-end justify-center bg-[#040908]/85 backdrop-blur-md sm:items-center sm:p-5"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legal-modal-title"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-3xl overflow-hidden rounded-t-[20px] border border-[#d8bd7a]/30 bg-[#0a1a14] text-[#f7f0e4] shadow-[0_30px_80px_rgba(0,0,0,0.6)] sm:rounded-[16px]"
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

            <div ref={scrollRef} className="max-h-[92vh] overflow-y-auto">
              <div className="border-b border-white/10 px-7 pb-6 pt-9 md:px-12 md:pb-7 md:pt-10">
                <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8bd7a]">
                  {kind === "privacy" ? "Confidentialité" : "Mentions légales"}
                </p>
                <h3
                  id="legal-modal-title"
                  className="font-display mt-3 text-3xl font-semibold leading-tight text-[#fbf4e8] md:text-4xl"
                >
                  {kind === "privacy"
                    ? "Politique de confidentialité"
                    : "Mentions légales"}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#9a9080]">
                  Holistic Health Academy · Voyage Holistique
                </p>
              </div>

              <div className="px-7 py-9 md:px-12 md:py-12">
                {kind === "privacy" ? <PrivacyContent /> : <LegalContent />}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ─── content blocks ──────────────────────────────────────── */

function H4({ children }: { children: ReactNode }) {
  return (
    <h4 className="font-display mt-10 text-xl font-semibold text-[#f7f0e4] first:mt-0 md:text-2xl">
      {children}
    </h4>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-sm leading-7 text-[#cfc6b8] md:text-base md:leading-8">{children}</p>;
}

function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 grid gap-2 text-sm leading-7 text-[#cfc6b8] md:text-base md:leading-8">
      {children}
    </ul>
  );
}

function LI({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-3">
      <span aria-hidden className="mt-3 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#d8bd7a]" />
      <span>{children}</span>
    </li>
  );
}

function PrivacyContent() {
  return (
    <>
      <P>
        Holistic Health Academy attache une grande importance à la protection de vos données
        personnelles. Cette politique décrit les données que nous collectons, les finalités du
        traitement et vos droits.
      </P>

      <H4>1. Responsable du traitement</H4>
      <P>
        Holistic Health Academy — Responsable&nbsp;: Docteur Laila Qottaya. Site web&nbsp;:{" "}
        <a
          href="https://www.holistichealth.academy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#d8bd7a] underline-offset-4 hover:underline"
        >
          holistichealth.academy
        </a>
        .
      </P>
      <P>
        Email&nbsp;: <em className="not-italic text-[#cfc6b8]">contact@holistichealth.academy</em>. Téléphone / WhatsApp&nbsp;:{" "}
        <em className="not-italic text-[#cfc6b8]">+31 6 25 37 56 73</em>.<br />Adresse&nbsp;:{" "}
        <em className="not-italic text-[#cfc6b8]">Maarif-Casablanca, Casablanca-Settat, Morocco</em>.
      </P>

      <H4>2. Données collectées</H4>
      <P>Lors de votre navigation et de vos demandes, nous pouvons collecter&nbsp;:</P>
      <UL>
        <LI>Nom complet, Email, Téléphone / WhatsApp, Ville</LI>
        <LI>Détails de réservation (nombre de personnes, besoins, choix de rappel)</LI>
        <LI>Données techniques (Adresse IP, navigateur, appareil utilisé)</LI>
        <LI>Cookies et cookies de session nécessaires au fonctionnement du site</LI>
      </UL>

      <H4>3. Paiements en ligne</H4>
      <P>
        Si un système de paiement en ligne (ex: Stripe ou PayPal) est mis en place à l'avenir,
        les transactions seront entièrement sécurisées et chiffrées. Aucune donnée bancaire
        complète ne sera stockée sur nos serveurs.
      </P>

      <H4>4. Sécurité des données</H4>
      <P>
        Nous appliquons des mesures de sécurité techniques et organisationnelles strictes
        afin de protéger vos données contre tout accès non autorisé, perte ou altération.
      </P>

      <H4>5. Finalités du traitement</H4>
      <UL>
        <LI>Traitement de votre demande de réservation ou de rappel.</LI>
        <LI>Contact commercial dans le cadre du Voyage Holistique.</LI>
        <LI>Suivi qualité et amélioration de l&rsquo;expérience proposée.</LI>
      </UL>
      <P>Ces données ne sont jamais cédées ni vendues à des tiers à des fins commerciales.</P>

      <H4>6. Base légale</H4>
      <P>
        Le traitement repose sur votre consentement explicite, formalisé par l&rsquo;envoi du
        formulaire de réservation.
      </P>

      <H4>7. Durée de conservation</H4>
      <P>
        Vos données sont conservées le temps nécessaire au traitement de votre demande, puis pour
        une durée maximale de 12 mois à des fins de relation commerciale.
      </P>

      <H4>8. Outils de mesure d&rsquo;audience</H4>
      <P>
        Pour comprendre l&rsquo;usage du site et l&rsquo;améliorer, nous utilisons les outils
        suivants&nbsp;:
      </P>
      <UL>
        <LI>Google Tag Manager (gestion des balises)</LI>
        <LI>Google Analytics 4 (statistiques d&rsquo;audience anonymisées)</LI>
        <LI>Meta Pixel (mesure de performance publicitaire)</LI>
        <LI>Microsoft Clarity (analyse du comportement de navigation)</LI>
      </UL>
      <P>
        Ces outils peuvent déposer des cookies sur votre navigateur. Aucune donnée personnelle
        identifiable du formulaire n&rsquo;est transmise à ces services&nbsp;: seules des
        informations techniques générales (pages visitées, durée, événements de navigation) sont
        traitées.
      </P>

      <H4>9. Vos droits</H4>
      <P>
        Conformément au RGPD et à la loi marocaine 09-08, vous disposez des droits suivants&nbsp;:
        accès, rectification, suppression, opposition et portabilité de vos données.
      </P>
      <P>
        Pour exercer ces droits, contactez-nous à l&rsquo;adresse email indiquée ci-dessus, ou
        directement via WhatsApp.
      </P>

      <H4>10. Mise à jour</H4>
      <P>
        Cette politique peut évoluer. Toute modification sera publiée sur cette page avec sa date de
        mise à jour.
      </P>
    </>
  );
}

function LegalContent() {
  return (
    <>
      <H4>Éditeur du site</H4>
      <P>
        <strong className="font-semibold text-[#f7f0e4]">Holistic Health Academy</strong>
        <br />
        Site web&nbsp;:{" "}
        <a
          href="https://www.holistichealth.academy/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#d8bd7a] underline-offset-4 hover:underline"
        >
          https://www.holistichealth.academy/
        </a>
      </P>

      <H4>Responsable de la publication</H4>
      <P>Docteur Laila Qottaya</P>

      <H4>Coordonnées</H4>
      <UL>
        <LI>
          Email&nbsp;: <span className="text-[#cfc6b8]">contact@holistichealth.academy</span>
        </LI>
        <LI>
          Téléphone / WhatsApp&nbsp;: <span className="text-[#cfc6b8]">+31 6 25 37 56 73</span>
        </LI>
        <LI>
          Adresse&nbsp;: <span className="text-[#cfc6b8]">Maarif-Casablanca, Casablanca-Settat, Morocco</span>
        </LI>
      </UL>

      <H4>Hébergement</H4>
      <P>
        Site hébergé sur une infrastructure cloud sécurisée.
      </P>

      <H4>Propriété intellectuelle</H4>
      <P>
        L&rsquo;ensemble des contenus présents sur ce site (textes, images, identité visuelle,
        logos) sont la propriété exclusive de Holistic Health Academy ou de ses partenaires.
        Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.
      </P>

      <H4>Données personnelles</H4>
      <P>
        Le traitement des données personnelles collectées via les formulaires du site est détaillé
        dans la <strong className="font-semibold text-[#d8bd7a]">Politique de confidentialité</strong>.
      </P>

      <H4>Outils de mesure</H4>
      <P>
        Le site utilise Google Tag Manager, Google Analytics 4, Meta Pixel et Microsoft Clarity à
        des fins de mesure d&rsquo;audience et d&rsquo;optimisation de l&rsquo;expérience.
      </P>

      <H4>Crédits</H4>
      <P>
        Photographies&nbsp;: Holistic Health Academy. Conception &amp; design&nbsp;: studio
        partenaire. Toute demande relative aux crédits peut être adressée par email.
      </P>
    </>
  );
}
