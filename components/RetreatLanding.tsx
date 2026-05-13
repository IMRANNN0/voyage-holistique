"use client";

import Image from "next/image";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BedDouble,
  CalendarDays,
  Car,
  Camera,
  Check,
  ChevronDown,
  Clock,
  Compass,
  Droplet,
  HeartHandshake,
  Home,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Moon,
  Minus,
  Mountain,
  Plus,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Sunrise,
  Users,
  Utensils,
  Waves,
  Wind,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { BookingModalProvider, useBookingModal } from "@/components/BookingModal";
import { LegalModalProvider, useLegalModals } from "@/components/LegalModals";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

/* ─── constants ───────────────────────────────────────────── */
const WHATSAPP = `https://wa.me/31625375673?text=${encodeURIComponent(
  "Bonjour, je souhaite réserver ma place pour le Voyage Holistique."
)}`;
const DATES = "Du 12 au 15 Juin";
const PRICE = "Seulement 7 960 DH";
const PLACES = "20 places uniquement";

/* ─── navigation ──────────────────────────────────────────── */
const navItems = [
  { label: "Transformation", href: "#transformation" },
  { label: "Lieu", href: "#location" },
  { label: "Programme", href: "#programme-complet" },
  { label: "Apprentissages", href: "#learn" },
  { label: "Offre", href: "#offer" },
  { label: "FAQ", href: "#faq" },
];

/* ─── transformation outcomes (6 cards) ───────────────────── */
type Transformation = {
  title: string;
  short: string;
  details: string;
  image: string;
  /**
   * Tailwind class controlling object-position on mobile (and resetting to
   * center on lg+ so desktop is untouched). Literal strings so Tailwind JIT
   * picks them up.
   */
  imgPos: string;
};

const transformations: Transformation[] = [
  {
    title: "Rééquilibrer le corps",
    short: "Soins thermaux et mouvement conscient pour revitaliser le corps.",
    details:
      "Les eaux thermales, les pratiques corporelles douces et les moments de repos profond aident le corps à retrouver son équilibre naturel.",
    image: "/images/Rééquilibrer le corps.jpeg",
    imgPos: "object-center",
  },
  {
    title: "Apaiser le mental",
    short: "Méditation et respiration consciente pour ralentir intérieurement.",
    details:
      "Vous apprendrez à calmer le système nerveux, réduire le stress mental et retrouver plus de clarté émotionnelle.",
    image: "/images/Apaiser le mental.png",
    imgPos: "object-[center_35%] lg:object-center",
  },
  {
    title: "Détoxifier naturellement",
    short: "Hijama sèche, alimentation saine et purification naturelle.",
    details:
      "Une approche douce pour aider le corps à libérer les tensions et soutenir les processus naturels de détoxification.",
    image: "/images/7ijama.jpeg",
    imgPos: "object-center",
  },
  {
    title: "Reprendre des habitudes saines",
    short: "Nutrition consciente et hygiène de vie équilibrée.",
    details:
      "Vous découvrirez des habitudes simples et durables à intégrer dans votre quotidien après la retraite.",
    image: "/images/Reprendre des habitudes saines.png",
    imgPos: "object-center",
  },
  {
    title: "Apprendre des rituels quotidiens",
    short: "Créer une routine apaisante du matin et du soir.",
    details:
      "Des rituels concrets de respiration, silence, mouvement et recentrage pour retrouver une stabilité intérieure.",
    image: "/images/Apprendre des rituels quotidiens.png",
    imgPos: "object-[center_35%] lg:object-center",
  },
  {
    title: "Retrouver son énergie intérieure",
    short: "Reconnecter le corps, le souffle et l'esprit.",
    details:
      "Un espace pour ralentir, respirer profondément et raviver une énergie plus calme et alignée.",
    image: "/images/Retrouver son énergie intérieure.jpg",
    imgPos: "object-[center_40%] lg:object-center",
  },
];

/* ─── location experiences (3 cards) ──────────────────────── */
const locationCards = [
  {
    title: "Fès",
    subtitle: "Riyad royal privé",
    description: "Un riad d'exception privatisé pour le groupe. Intimité absolue, hospitalité raffinée.",
    image: "/images/riad-luxury4.jpeg",
  },
  {
    title: "Vichy Thermal",
    subtitle: "Expérience thermale",
    description: "Une journée entière dédiée aux eaux thermales et au lâcher-prise du corps.",
    image: "/images/thermal-pool.jpeg",
  },
  {
    title: "Sefrou",
    subtitle: "Ferme nature & silence",
    description: "Une ferme préservée pour marcher, respirer et se reconnecter à la nature.",
    image: "/images/safrou.jpeg",
  },
];

/* ─── 4-day programme ─────────────────────────────────────── */
const detailedProgram: Array<{
  day: string;
  title: string;
  subtitle: string;
  schedule: Array<{ time: string; activity: string; icon: IconType }>;
  objective: string;
  image: string;
}> = [
  {
    day: "Jour 1",
    title: "Accueil & Installation",
    subtitle: "Fès — Riyad royal privé",
    image: "/images/riad.jpeg",
    schedule: [
      { time: "Matin", activity: "Départ de Casablanca et Rabat en transport VIP.", icon: Car },
      {
        time: "Fin de journée",
        activity: "Arrivée à Fès et installation dans le riyad privatisé.",
        icon: Home,
      },
      {
        time: "Soir",
        activity: "Dîner sain et raffiné dans une ambiance calme et authentique.",
        icon: Utensils,
      },
      {
        time: "Après dîner",
        activity: "Ouverture officielle avec Docteur Laila Qottaya.",
        icon: HeartHandshake,
      },
    ],
    objective: "Entrer doucement dans l'expérience et se préparer à quatre jours de transformation.",
  },
  {
    day: "Jour 2",
    title: "Nature, Yoga & Détox",
    subtitle: "Sefrou — ferme nature et reconnexion",
    image: "/images/yoga.jpeg",
    schedule: [
      { time: "08:00", activity: "Méditation, respiration consciente et petit-déjeuner.", icon: Sunrise },
      { time: "10:30", activity: "Départ vers une ferme préservée à Sefrou.", icon: MapPin },
      { time: "11:00", activity: "Séance de yoga postural avec le coach spécialisé.", icon: Sparkles },
      { time: "13:00", activity: "Marche consciente dans la nature.", icon: Mountain },
      {
        time: "14:30",
        activity: "Pause healthy bio + séances individuelles avec Docteur Laila.",
        icon: HeartHandshake,
      },
      {
        time: "20:00",
        activity: "Soirée spirituelle Issawa puis coaching holistique.",
        icon: Moon,
      },
    ],
    objective: "Libérer les tensions, réactiver l'énergie vitale et retrouver une respiration profonde.",
  },
  {
    day: "Jour 3",
    title: "Vichy Thermal & Spiritualité",
    subtitle: "Vichy Thermal à Fès — bien-être thermal",
    image: "/images/thermal-pool.jpeg",
    schedule: [
      { time: "08:00", activity: "Yoga sur la terrasse du riyad et petit-déjeuner.", icon: Sunrise },
      { time: "10:30", activity: "Journée à Vichy Thermal et expérience thermale.", icon: Waves },
      { time: "15:30", activity: "Retour au riyad et temps de repos.", icon: Home },
      { time: "16:30", activity: "Rencontre avec une personnalité inspirante.", icon: Users },
      { time: "19:00", activity: "Dîner raffiné au riyad.", icon: Utensils },
      { time: "20:30", activity: "Soirée Mdah & Samâa puis healing collectif.", icon: Moon },
    ],
    objective: "Apaiser le système nerveux, nourrir l'âme et vivre une expérience spirituelle authentique.",
  },
  {
    day: "Jour 4",
    title: "Intégration & Clôture",
    subtitle: "Bilan — rituels — retour",
    image: "/images/riad-terrace.jpeg",
    schedule: [
      { time: "08:00", activity: "Méditation, respiration et petit-déjeuner.", icon: Sunrise },
      {
        time: "09:00",
        activity: "Séance finale avec Docteur Laila : bilan et conseils holistiques.",
        icon: HeartHandshake,
      },
      { time: "10:00", activity: "Échanges, témoignages et mots des participants.", icon: Users },
      { time: "11:30", activity: "Remise des attestations de participation.", icon: Award },
      { time: "12:00", activity: "Préparation au départ et retour vers Casablanca.", icon: Car },
    ],
    objective: "Repartir avec des outils pratiques et une énergie renouvelée.",
  },
];

/* ─── what you will learn (12 items) ──────────────────────── */
const learnings: Array<{ title: string; icon: IconType }> = [
  { title: "Rituels du matin", icon: Sunrise },
  { title: "Rituels du soir", icon: Moon },
  { title: "Régulation émotionnelle", icon: HeartHandshake },
  { title: "Nutrition holistique", icon: Utensils },
  { title: "Détox naturelle du corps", icon: Droplet },
  { title: "Techniques de respiration", icon: Wind },
  { title: "Gestion du stress", icon: ShieldCheck },
  { title: "Yoga postural", icon: Sparkles },
  { title: "Méditation guidée", icon: Star },
  { title: "Respiration consciente", icon: Leaf },
  { title: "Apaisement du système nerveux", icon: Waves },
  { title: "Habitudes de bien-être durables", icon: Compass },
];

/* ─── doctor credentials ──────────────────────────────────── */
const doctorCredentials: string[] = [
  "Médecine holistique",
  "Bien-être global",
  "Accompagnement émotionnel",
  "Équilibre corps, âme et esprit",
  "Accompagnement holistique personnalisé",
  "Séances de hijama sèche pour aider à la détoxification naturelle du corps",
];

/* ─── offer items ─────────────────────────────────────────── */
const offerItems: Array<{ title: string; icon: IconType }> = [
  { title: "Riyad royal privatisé à Fès", icon: Home },
  { title: "Hébergement VIP · 3 nuits", icon: BedDouble },
  { title: "Mercedes Mini Bus VIP", icon: Car },
  { title: "Transport Casablanca / Rabat / Fès", icon: MapPin },
  { title: "Gastronomie saine et raffinée", icon: Utensils },
  { title: "Journée Vichy Thermal", icon: Waves },
  { title: "Yoga, méditation & respiration", icon: Leaf },
  { title: "Séances de hijama sèche", icon: Droplet },
  { title: "Encadrement Docteur Laila Qottaya", icon: ShieldCheck },
  { title: "Attestation de participation", icon: Award },
  { title: "20 places uniquement", icon: Users },
];

/* ─── FAQs (max 6) ────────────────────────────────────────── */
const faqs = [
  {
    question: "Le transport est-il inclus ?",
    answer:
      "Oui, le transport VIP Casablanca / Rabat vers Fès et retour est entièrement inclus.",
  },
  {
    question: "L'hébergement est-il inclus ?",
    answer:
      "Oui, l'hébergement VIP dans un riyad royal privatisé à Fès est inclus pour toute la durée.",
  },
  {
    question: "Est-ce adapté aux débutants ?",
    answer:
      "Oui, toutes les pratiques sont accessibles et accompagnées par des professionnels bienveillants.",
  },
  {
    question: "Que comprend le tarif ?",
    answer:
      "Hébergement, transport VIP, repas raffinés, expériences holistiques, Vichy Thermal, hijama sèche, encadrement et attestation.",
  },
  {
    question: "Comment réserver ?",
    answer:
      "Cliquez sur « Réserver ma place » pour remplir le formulaire, ou contactez-nous via WhatsApp.",
  },
  {
    question: "Peut-on venir seul(e) ?",
    answer:
      "Bien sûr. La plupart des participants viennent seul(e)s. Le cadre est pensé pour être accueillant et bienveillant.",
  },
];

/* ─── testimonials ────────────────────────────────────────── */
const testimonials = [
  {
    quote:
      "Je suis arrivée fatiguée, avec l'impression de porter trop de choses. Je suis repartie avec une respiration plus calme et une énergie que je n'avais pas ressentie depuis longtemps.",
    name: "Nadia B.",
    role: "Entrepreneure · Casablanca",
    stars: 5,
  },
  {
    quote:
      "Le mélange entre le riad, les thermes, la spiritualité et l'accompagnement m'a profondément touchée. Tout était pensé avec finesse.",
    name: "Samira E.",
    role: "Fondatrice créative · Rabat",
    stars: 5,
  },
  {
    quote:
      "Je ne cherchais pas seulement du repos. J'avais besoin d'un cadre pour me retrouver. Ces quatre jours m'ont vraiment recentrée.",
    name: "Leila M.",
    role: "Consultante · Marrakech",
    stars: 5,
  },
];

/* ─── animation variant ───────────────────────────────────── */
const fadeUp = { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } };

/* ═══════════════════════════════════════════════════════════
   UTILITY COMPONENTS
══════════════════════════════════════════════════════════════ */

function SectionHeading({
  eyebrow,
  title,
  copy,
  light = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  light?: boolean;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-3xl text-center"
    >
      <p
        className={`text-xs font-semibold uppercase tracking-[0.32em] ${
          light ? "text-[#d8bd7a]" : "text-[#8f6f38]"
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`font-display mt-5 text-4xl font-semibold leading-[1.05] md:text-6xl ${
          light ? "text-[#f7f0e4]" : "text-[#08140f]"
        }`}
      >
        {title}
      </h2>
      {copy ? (
        <p
          className={`mx-auto mt-6 max-w-2xl text-base leading-8 md:text-lg ${
            light ? "text-[#d7d1c4]" : "text-[#5d574c]"
          }`}
        >
          {copy}
        </p>
      ) : null}
    </motion.div>
  );
}

function CtaButton({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const className =
    "group inline-flex min-h-12 w-full items-center justify-between gap-3 rounded-full border border-[#d6b46f]/70 bg-[#f5efe2]/95 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#07120e] shadow-[0_18px_45px_rgba(0,0,0,0.28)] transition duration-300 hover:border-[#f4d796] hover:bg-white focus:outline-none focus:ring-2 focus:ring-[#d8bd7a] focus:ring-offset-2 focus:ring-offset-[#07120e] sm:w-auto sm:justify-center sm:px-6 sm:tracking-[0.18em]";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {children}
        <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
      </button>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
      <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
    </a>
  );
}

/* ═══════════════════════════════════════════════════════════
   HEADER  (absolute — scrolls away with content)
══════════════════════════════════════════════════════════════ */

function Header() {
  const [open, setOpen] = useState(false);
  const { open: openBooking } = useBookingModal();

  return (
    <>
      <header className="absolute left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#07120e]/45 px-4 py-3 text-[#f7f0e4] shadow-2xl backdrop-blur-xl md:px-6">
          <a href="#top" className="flex items-center">
            <div className="relative h-10 w-36 md:h-12 md:w-44">
              <Image
                src="/images/logo.png"
                alt="Voyage Holistique Logo"
                fill
                sizes="(min-width: 768px) 176px, 144px"
                className="object-contain"
              />
            </div>
          </a>
          <nav className="hidden items-center gap-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ddd3c1] lg:flex lg:gap-7 lg:text-xs lg:tracking-[0.18em]">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-[#d8bd7a]">
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => openBooking("header")}
            className="hidden rounded-full border border-[#d8bd7a]/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f4e3bd] transition hover:bg-[#d8bd7a] hover:text-[#07120e] lg:inline-flex"
          >
            Réserver
          </button>
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[#f7f0e4] lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#07120e]/97 p-5 text-[#f7f0e4] lg:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl tracking-[0.16em]">Voyage Holistique</span>
              <button
                type="button"
                aria-label="Close navigation"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-12 grid gap-5">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="font-display border-b border-white/10 pb-5 text-4xl text-[#f7f0e4]"
                >
                  {item.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openBooking("header_mobile");
                }}
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-[#d8bd7a] px-5 text-sm font-semibold uppercase tracking-[0.18em] text-[#07120e]"
              >
                Réserver votre place
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO  (dates + price + places upfront)
══════════════════════════════════════════════════════════════ */

function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const { open: openBooking } = useBookingModal();

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-[calc(100svh-28px)] overflow-hidden bg-[#07120e] text-[#f7f0e4]"
    >
      <motion.div style={{ y: imageY }} className="absolute inset-0 -top-16 bottom-0">
        <Image
          src="/images/hero.png"
          alt="Voyage Holistique — retraite d'exception"
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover brightness-[1.45] saturate-120"
        />
      </motion.div>
      {/* Lighter cinematic overlay — keeps text readable while letting the image breathe */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,15,0.38),rgba(5,20,15,0.12)_46%,rgba(5,20,15,0.02)),linear-gradient(180deg,rgba(5,20,15,0.12),rgba(5,20,15,0.16)_50%,rgba(5,20,15,0.58))]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#07120e] to-transparent" />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-5 pb-10 pt-36 md:px-8 md:pb-16"
      >
        <div className="max-w-4xl">


          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="font-display mt-5 max-w-[10ch] text-5xl font-semibold uppercase leading-[0.86] tracking-[0.04em] text-[#fbf4e8] sm:text-6xl md:max-w-[11ch] md:text-8xl md:leading-[0.82] md:tracking-[0.08em] lg:text-9xl"
          >
            Voyage Holistique
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.42 }}
            className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <p className="font-display text-4xl font-bold tracking-[0.02em] text-[#fbeec1] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] md:text-5xl">
                Corps • Âme • Esprit
              </p>
              <p className="mt-5 max-w-xl text-base leading-8 text-[#ece2cf] md:text-lg">
                Quatre jours pour revenir à vous, élever votre énergie et transformer votre rythme intérieur.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaButton onClick={() => openBooking("hero")}>Réserver ma place</CtaButton>
              <a
                href="#programme-complet"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#e8dfcf] transition duration-300 hover:border-white/55 hover:text-white sm:w-auto sm:px-6"
              >
                Découvrir le programme
                <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-6 right-5 z-10 hidden items-center gap-3 text-xs uppercase tracking-[0.24em] text-[#d8bd7a] md:flex">
        <span className="h-px w-16 bg-[#d8bd7a]/70" />
        Fès · Sefrou · Vichy Thermal
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRANSFORMATION  (6 outcome cards)
══════════════════════════════════════════════════════════════ */

function Transformation() {
  return (
    <section
      id="transformation"
      className="noise relative bg-[#07120e] px-5 py-28 text-[#f7f0e4] md:px-8 md:py-36"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          light
          eyebrow="Transformation"
          title="Une transformation holistique en 4 jours"
          copy="Pas un séjour parmi d'autres. Une immersion rare pour rééquilibrer le corps, apaiser le mental et raviver l'énergie intérieure."
        />
        <div className="mt-20 grid gap-6 md:grid-cols-2">
          {transformations.map((item, index) => (
            <TransformationCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TransformationCard({ item, index }: { item: Transformation; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      // Fixed height so both flip faces share the exact same footprint
      className="group relative h-[420px] [perspective:1400px] lg:h-[280px]"
    >
      <motion.div
        animate={{ rotateY: open ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* ─── FRONT ─── */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[14px] border border-[#d8bd7a]/22 bg-[#0a1a14]/85 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition duration-500 group-hover:border-[#d8bd7a]/55 group-hover:shadow-[0_30px_70px_rgba(216,189,122,0.14)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Hover glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(216,189,122,0.14) 0%, transparent 65%)",
            }}
          />
          <div className="relative flex h-full flex-col lg:flex-row">
            {/* Image — top on mobile, left on desktop */}
            <div className="relative h-52 w-full overflow-hidden lg:h-full lg:w-[42%]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className={`object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.06] ${item.imgPos}`}
              />
              {/* Soft fade into the card body — vertical on mobile, horizontal on desktop */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1a14] lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-[#0a1a14]" />
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8bd7a]/45 to-transparent" />
            </div>
            {/* Content */}
            <div className="relative flex flex-1 flex-col p-6 pr-16 lg:p-7 lg:pr-20">
              <h3 className="font-display mt-3 text-2xl font-semibold leading-tight text-[#fbf4e8] md:text-[26px] pr-6">
                {item.title}
              </h3>
              <p className="mt-5 text-sm leading-7 text-[#c9c1b4]">{item.short}</p>

              {/* + button */}
              <button
                type="button"
                aria-label={`En savoir plus sur ${item.title}`}
                onClick={() => setOpen(true)}
                className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8bd7a]/40 bg-[#d8bd7a]/10 text-[#d8bd7a] transition duration-300 hover:rotate-90 hover:border-[#d8bd7a] hover:bg-[#d8bd7a] hover:text-[#07120e]"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ─── BACK ─── */}
        <div
          className="absolute inset-0 overflow-hidden rounded-[14px] border border-[#d8bd7a]/55 bg-[#0a1a14]/95 shadow-[0_30px_70px_rgba(0,0,0,0.45)]"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Subtle warm gradient on back */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-70"
            style={{
              background:
                "radial-gradient(ellipse at top right, rgba(216,189,122,0.14) 0%, transparent 55%), radial-gradient(ellipse at bottom left, rgba(154,118,56,0.12) 0%, transparent 60%)",
            }}
          />
          {/* Gold hairlines */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8bd7a]/55 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#d8bd7a]/30 to-transparent" />

          <div className="relative flex h-full flex-col justify-between p-7 pr-16 md:p-8 md:pr-20">
            <div>
              <h3 className="font-display mt-3 text-2xl font-semibold leading-tight text-[#d8bd7a] md:text-[26px] pr-6">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#e6dccb] md:text-[15px]">{item.details}</p>
            </div>
            <div className="gold-divider mt-6" />

            {/* − button */}
            <button
              type="button"
              aria-label="Fermer le détail"
              onClick={() => setOpen(false)}
              className="absolute right-5 top-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#d8bd7a]/55 bg-[#d8bd7a]/15 text-[#d8bd7a] transition duration-300 hover:rotate-180 hover:border-[#d8bd7a] hover:bg-[#d8bd7a] hover:text-[#07120e]"
            >
              <Minus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOCATION  (3 distinct cards: Fès / Vichy / Sefrou)
══════════════════════════════════════════════════════════════ */

function Location() {
  return (
    <section id="location" className="bg-[#efe6d6] px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Lieu d'exception"
          title="Trois lieux d'exception, une seule expérience."
          copy="Fès, Vichy Thermal et Sefrou — trois ambiances complémentaires, choisies avec soin pour leur authenticité et leur pouvoir d'apaisement."
        />
        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {locationCards.map((card, index) => (
            <motion.article
              key={card.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.85, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group luxury-shadow relative h-[520px] overflow-hidden rounded-[12px] bg-[#07120e] md:h-[560px]"
            >
              <Image
                src={card.image}
                alt={card.title}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07120e] via-[#07120e]/35 to-transparent" />
              <div className="absolute inset-x-7 bottom-7">
                <div className="gold-divider mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8bd7a]">
                  {card.subtitle}
                </p>
                <h3 className="font-display mt-2 text-4xl font-semibold text-[#fbf4e8] md:text-5xl">
                  {card.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#cfc6b8]">{card.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROGRAMME — 4-day clean tab layout
══════════════════════════════════════════════════════════════ */

function Programme() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section id="programme-complet" className="bg-[#0f2a20] px-5 py-28 text-[#f7f0e4] md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          light
          eyebrow="Programme · 4 jours"
          title="Un itinéraire clair et transformateur."
          copy="Mouvement, nutrition, rituels, travail émotionnel, détox, méditation. Chaque jour, une étape vers la reconnexion à soi."
        />

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          {detailedProgram.map((day, index) => (
            <button
              key={day.day}
              type="button"
              onClick={() => setActiveDay(index)}
              className={`rounded-full border px-10 py-4 text-lg font-bold uppercase tracking-[0.18em] transition duration-400 ease-out ${
                activeDay === index
                  ? "border-[#d8bd7a] bg-[#d8bd7a] text-[#07120e] shadow-[0_12px_32px_rgba(216,189,122,0.45)]"
                  : "border-white/30 text-[#c9c1b4] hover:border-[#d8bd7a]/70 hover:text-[#d8bd7a] hover:bg-white/[0.06]"
              }`}
            >
              {day.day}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {detailedProgram.map((day, index) =>
            activeDay === index ? (
              <motion.div
                key={day.day}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]"
              >
                <div className="relative min-h-72 overflow-hidden rounded-[12px] lg:min-h-full">
                  <Image
                    src={day.image}
                    alt={day.title}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07120e]/88 via-[#07120e]/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="gold-divider mb-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8bd7a]">
                      Objectif du jour
                    </p>
                    <p className="mt-2 text-base leading-7 text-[#f7f0e4]">{day.objective}</p>
                  </div>
                </div>

                <div className="rounded-[12px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#d8bd7a]/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-[#d8bd7a]">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {day.day}
                    </span>
                    <h3 className="font-display mt-4 text-4xl font-semibold leading-[1.05] text-[#fbf4e8] md:text-5xl">
                      {day.title}
                    </h3>
                    <p className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-[#9a8868]">
                      {day.subtitle}
                    </p>
                  </div>
                  <div className="grid gap-2.5">
                    {day.schedule.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={`${day.day}-${item.time}`}
                          className="grid gap-3 rounded-[12px] bg-white/[0.05] p-4 transition duration-200 hover:bg-white/[0.085] md:grid-cols-[120px_1fr] md:gap-4"
                        >
                          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#d8bd7a]">
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span>{item.time}</span>
                          </div>
                          <p className="text-sm leading-7 text-[#cfc6b8]">{item.activity}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   LEARN  ("Ce que vous apprendrez" — 12 items)
══════════════════════════════════════════════════════════════ */

function Learn() {
  return (
    <section id="learn" className="relative overflow-hidden bg-[#efe6d6] px-5 py-28 md:px-8 md:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]">
        <Image src="/images/riad-terrace.jpeg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Apprentissages"
          title="Ce que vous apprendrez durant cette expérience"
          copy="Une immersion complète en santé holistique. Des outils concrets, applicables au quotidien, pour transformer votre rapport au corps et au mental."
        />
        <div className="mt-20 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {learnings.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.04 }}
                className="group flex items-center gap-5 rounded-[12px] border border-[#c19a55]/25 bg-[#fbf6ec]/75 p-6 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-[#c19a55]/55 hover:bg-white/85"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#c19a55]/35 bg-white/65 text-[#9a7638] transition group-hover:bg-[#d8bd7a]/20">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-xl font-semibold leading-snug text-[#07120e] md:text-2xl">
                  {item.title}
                </h3>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ENCADREMENT — 3 cartes premium
══════════════════════════════════════════════════════════════ */

function DoctorAuthority() {
  return (
    <section
      id="supervision"
      className="relative overflow-hidden bg-[#07120e] px-5 py-28 text-[#f7f0e4] md:px-8 md:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(216,189,122,0.10) 0%, transparent 55%), radial-gradient(ellipse at bottom, rgba(154,118,56,0.08) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          light
          eyebrow="Encadrement"
          title="Un accompagnement expert et bienveillant"
          copy="Une approche holistique complète du corps, du mental et de l'équilibre émotionnel."
        />

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {/* Docteur Laila Qottaya */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="luxury-shadow group relative h-[580px] overflow-hidden rounded-[14px] border border-[#d8bd7a]/25 bg-[#07120e]"
          >
            <Image
              src="/images/lailaquttaya.jpeg"
              alt="Docteur Laila Qottaya"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.06]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07120e] via-[#07120e]/40 to-transparent" />
            <div className="absolute inset-x-6 bottom-6">
              <div className="gold-divider mb-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8bd7a]">
                Médecine holistique
              </p>
              <h3 className="font-display mt-2 text-3xl font-semibold text-[#fbf4e8]">
                Docteur Laila Qottaya
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#cfc6b8]">
                Médecine holistique, bien-être global, accompagnement émotionnel et équilibre corps/âme/esprit.
              </p>
            </div>
          </motion.div>

          {/* Coach Yoga */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="luxury-shadow group relative h-[580px] overflow-hidden rounded-[14px] border border-[#d8bd7a]/25 bg-[#07120e]"
          >
            <Image
              src="/images/coachyoga2.jpeg"
              alt="Coach Yoga"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="scale-125 object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.32]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07120e] via-[#07120e]/40 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 z-10">
              <div className="gold-divider mb-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8bd7a]">
                Mouvement conscient
              </p>
              <h3 className="font-display mt-2 text-3xl font-semibold text-[#fbf4e8]">
                Coach Yoga & sport‑médical
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#cfc6b8]">
                Coach certifiée sport-médical, spécialisée en yoga postural, méditation et respiration consciente.
              </p>
            </div>
          </motion.div>

          {/* Personnalité surprise */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="luxury-shadow group relative h-[580px] overflow-hidden rounded-[14px] border border-[#d8bd7a]/25 bg-[#07120e]"
          >
            <Image
              src="/images/person-annonym.jpeg"
              alt="Personnalité surprise"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.06] blur-[1px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07120e] via-[#07120e]/40 to-transparent" />
            <div className="absolute inset-x-6 bottom-6">
              <div className="gold-divider mb-4" />
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8bd7a]">
                Invitée inspirante · à dévoiler
              </p>
              <h3 className="font-display mt-2 text-3xl font-semibold text-[#fbf4e8]">
                Personnalité surprise
              </h3>
              <p className="mt-4 text-sm leading-7 text-[#cfc6b8]">
                Une personnalité inspirante pour partager, inspirer et élever votre expérience.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════════════ */

function Testimonials() {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((v) => (v + 1) % testimonials.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className="bg-[#0f2a20] px-5 py-28 text-[#f7f0e4] md:px-8 md:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          light
          eyebrow="Témoignages"
          title="Ce qui reste après le silence."
          copy="Des mots sobres pour une expérience qui s'inscrit souvent au-delà des mots."
        />
        <div className="luxury-shadow relative mt-16 overflow-hidden rounded-[14px] border border-[#d8bd7a]/25 bg-white/[0.04] p-8 backdrop-blur md:p-16">
          <Quote className="h-12 w-12 text-[#a37d3d]" />
          <AnimatePresence mode="wait">
            <motion.div
              key={current.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <p className="font-display mt-8 text-3xl leading-[1.25] text-[#fbf4e8] md:text-5xl">
                &ldquo;{current.quote}&rdquo;
              </p>
              <div className="mt-10">
                <div className="mb-3 flex gap-1">
                  {Array.from({ length: current.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#d8bd7a] text-[#d8bd7a]" />
                  ))}
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f7f0e4]">
                  {current.name}
                </p>
                <p className="mt-1 text-sm text-[#9a8970]">{current.role}</p>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-12 flex gap-3">
            {testimonials.map((item, index) => (
              <button
                type="button"
                key={item.name}
                aria-label={`Témoignage ${index + 1}`}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  active === index ? "w-12 bg-[#d8bd7a]" : "w-2.5 bg-[#3a3429] hover:bg-[#5a4e3a]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   LAUNCH OFFER  (dates + places very visible)
══════════════════════════════════════════════════════════════ */

function LaunchOffer() {
  const { open: openBooking } = useBookingModal();

  return (
    <section
      id="offer"
      className="relative overflow-hidden px-5 py-28 md:px-8 md:py-36"
      style={{
        background:
          "linear-gradient(180deg, #F7F1E7 0%, #F3E8D8 100%)",
      }}
    >
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8f6f38]">Offre de lancement</p>
          <h2 className="font-display mt-5 text-5xl font-semibold leading-[1.02] text-[#07120e] md:text-7xl">
            Offre exceptionnelle de lancement
          </h2>

          {/* Three big visibility chips */}
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-[12px] border border-[#c19a55]/40 bg-white/65 p-5 text-center backdrop-blur">
              <CalendarDays className="mx-auto h-6 w-6 text-[#9a7638]" />
              <p className="font-display mt-3 text-xl font-semibold text-[#07120e]">{DATES}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f6f38]">
                4 jours
              </p>
            </div>
            <div className="rounded-[12px] border border-[#c19a55]/40 bg-white/65 p-5 text-center backdrop-blur">
              <BadgeCheck className="mx-auto h-6 w-6 text-[#9a7638]" />
              <p className="font-display mt-3 text-xl font-semibold text-[#07120e]">7 960 DH</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f6f38]">
                Tarif tout inclus
              </p>
            </div>
            <div className="rounded-[12px] border border-[#c19a55]/40 bg-white/65 p-5 text-center backdrop-blur">
              <Users className="mx-auto h-6 w-6 text-[#9a7638]" />
              <p className="font-display mt-3 text-xl font-semibold text-[#07120e]">20 places</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8f6f38]">
                Uniquement
              </p>
            </div>
          </div>

          <p className="mt-8 max-w-xl text-base leading-8 text-[#5d574c]">
            Une retraite premium, privatisée et profondément accompagnée, proposée en tarif de lancement pour un
            groupe volontairement restreint.
          </p>

          <div className="mt-10 hidden lg:block">
            <CtaButton onClick={() => openBooking("pricing")}>Réserver ma place</CtaButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[14px]"
          style={{
            background: "#041B16",
            border: "1px solid rgba(212,175,55,0.18)",
            boxShadow:
              "0 0 20px rgba(212,175,55,0.12), 0 28px 70px rgba(0,0,0,0.35)",
          }}
        >
          <div className="relative">
            <div
              className="border-b p-8 md:p-10"
              style={{ borderColor: "rgba(212,175,55,0.18)" }}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                Tarif exceptionnel
              </p>
              <div className="mt-3">
                <div className="hidden md:block">
                  <p className="font-display text-6xl font-semibold leading-none text-[#F8F4ED] md:text-7xl">
                    Seulement 7 960 DH
                  </p>
                </div>
                <div className="md:hidden">
                  <p className="font-display text-2xl font-semibold leading-tight text-[#CFC6B8]">
                    Seulement
                  </p>
                  <p className="font-display text-5xl font-semibold leading-none text-[#F8F4ED]" style={{ whiteSpace: "nowrap" }}>
                    7 960 DH
                  </p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] sm:text-sm">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-4 py-2 sm:px-3 sm:py-1.5">
                  <CalendarDays className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  {DATES}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/10 px-4 py-2 sm:px-3 sm:py-1.5">
                  <Users className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                  {PLACES}
                </span>
              </div>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#CFC6B8]">
                Hébergement, transport, gastronomie, pratiques holistiques, thermes, hijama sèche et encadrement.
              </p>
            </div>
            <div className="grid gap-3 p-8 sm:grid-cols-2 md:p-10">
              {offerItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-center gap-3 rounded-[10px] p-4"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/12 text-[#D4AF37]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-sm leading-6 text-[#E6DCCB]">{item.title}</span>
                  </div>
                );
              })}
            </div>
            <div
              className="border-t p-8 md:p-10"
              style={{ borderColor: "rgba(212,175,55,0.18)" }}
            >
              <CtaButton onClick={() => openBooking("pricing_card")}>Réserver ma place</CtaButton>
            </div>
          </div>
        </motion.div>

        <div className="lg:hidden">
          <CtaButton onClick={() => openBooking("pricing_mobile")}>Réserver ma place</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FAQ  (6 items max)
══════════════════════════════════════════════════════════════ */

function FAQ() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#efe6d6] px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Questions fréquentes"
          title="Tout ce qu'il faut savoir avant de réserver"
        />
        <div className="mt-16 grid gap-3">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <motion.article
                key={faq.question}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: index * 0.04 }}
                className="overflow-hidden rounded-[12px] border border-[#c19a55]/25 bg-[#fbf6ec]/85 transition hover:border-[#c19a55]/45"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-5 p-6 text-left md:p-7"
                >
                  <span className="font-display text-xl font-semibold text-[#07120e] md:text-2xl">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#9a7638] transition duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="border-t border-[#c19a55]/15 px-6 pb-7 pt-5 text-base leading-8 text-[#5d574c] md:px-7">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FINAL CTA
══════════════════════════════════════════════════════════════ */

function ClosingCta() {
  const { open: openBooking } = useBookingModal();

  return (
    <section
      id="reserve"
      className="relative overflow-hidden bg-[#07120e] px-5 py-28 text-[#f7f0e4] md:px-8 md:py-40"
    >
      <Image
        src="/images/riad.jpeg"
        alt="Voyage Holistique"
        fill
        sizes="100vw"
        className="object-cover opacity-45"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,18,14,0.96),rgba(7,18,14,0.72),rgba(7,18,14,0.38)),linear-gradient(180deg,rgba(7,18,14,0.25),rgba(7,18,14,0.92))]" />
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative mx-auto max-w-7xl"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#d8bd7a]">Invitation</p>
        <h2 className="font-display mt-5 max-w-4xl text-6xl font-semibold leading-[0.98] text-[#fbf4e8] md:text-8xl">
          Revenez à vous. Élevez-vous.
        </h2>
        <p className="mt-7 max-w-2xl text-lg leading-9 text-[#ddd2bf]">
          Les places sont volontairement limitées afin de préserver l&rsquo;intimité et la qualité de
          l&rsquo;expérience.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#d8bd7a]">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d8bd7a]/35 bg-[#d8bd7a]/12 px-4 py-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            {DATES}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d8bd7a]/35 bg-[#d8bd7a]/12 px-4 py-1.5">
            <Users className="h-3.5 w-3.5" />
            {PLACES}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-[#d8bd7a]/35 bg-[#d8bd7a]/12 px-4 py-1.5">
            <BadgeCheck className="h-3.5 w-3.5" />
            {PRICE}
          </span>
        </div>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <CtaButton onClick={() => openBooking("closing_cta")}>Je réserve ma place</CtaButton>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   STICKY BOOKING BAR
══════════════════════════════════════════════════════════════ */

function StickyBookingBar() {
  const [visible, setVisible] = useState(false);
  const { open: openBooking, hasBeenOpened } = useBookingModal();

  useEffect(() => {
    if (hasBeenOpened) {
      setVisible(false);
      return;
    }

    const onScroll = () => {
      const offerEl = document.getElementById("offer");
      if (!offerEl) {
        setVisible(false);
        return;
      }
      const offerTop = offerEl.getBoundingClientRect().top;
      const offerHasEntered = offerTop < window.innerHeight - 80;

      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = docHeight > 0 ? window.scrollY / docHeight : 0;
      const deepEnough = scrollDepth > 0.65;

      const reserveEl = document.getElementById("reserve");
      const reserveTop = reserveEl
        ? reserveEl.getBoundingClientRect().top + window.scrollY
        : Number.POSITIVE_INFINITY;
      const aboveReserve = window.scrollY < reserveTop - 400;

      setVisible((offerHasEntered || deepEnough) && aboveReserve);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasBeenOpened]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-5 z-40 px-3 md:bottom-8 md:px-6"
        >
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-[#d8bd7a]/35 bg-[#07120e]/92 px-3 py-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-4 md:py-2.5">
            <div className="hidden items-center gap-3 pl-3 sm:flex">
              <div className="relative h-8 w-28">
                <Image
                  src="/images/logo.png"
                  alt="Voyage Holistique Logo"
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="flex flex-1 items-center justify-end sm:flex-initial">
              <button
                type="button"
                onClick={() => openBooking("sticky_cta")}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-full bg-[#d8bd7a] px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#07120e] transition hover:bg-[#e8cd8a] sm:flex-initial sm:px-6"
              >
                Réserver — 7 960 DH
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
══════════════════════════════════════════════════════════════ */

function Footer() {
  const year = useMemo(() => new Date().getFullYear(), []);
  const { openPrivacy, openLegal } = useLegalModals();

  return (
    <footer className="bg-[#050b09] px-5 pb-32 pt-20 text-[#d6cbbb] md:px-8 md:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-5">
              <div className="relative h-12 w-40 shrink-0 md:h-14 md:w-48">
                <Image
                  src="/images/logo.png"
                  alt="Voyage Holistique Logo"
                  fill
                  sizes="(min-width: 768px) 192px, 160px"
                  className="object-contain"
                />
              </div>
              <p className="font-display text-3xl font-semibold leading-tight tracking-[0.1em] text-[#f7f0e4] md:text-4xl">
                Voyage Holistique
              </p>
            </div>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#9d9487]">
              Une retraite intime entre corps, âme et esprit par Holistic Health Academy.
            </p>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[#d8bd7a]">
              Fès · Sefrou · Vichy Thermal · Maroc
            </p>
          </div>
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#d8bd7a]">Navigation</p>
            <div className="grid gap-3">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm text-[#9d9487] transition hover:text-[#d8bd7a]"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-[#d8bd7a]">Contact</p>
            <div className="grid gap-4">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[#9d9487] transition hover:text-[#d8bd7a]"
              >
                <MessageCircle className="h-4 w-4 text-[#d8bd7a]" />
                +31 6 25 37 56 73
              </a>
              <a
                href="mailto:contact@holistichealth.academy"
                className="flex items-center gap-3 text-sm text-[#9d9487] transition hover:text-[#d8bd7a]"
              >
                <Mail className="h-4 w-4 text-[#d8bd7a]" />
                contact@holistichealth.academy
              </a>
              <a
                href="https://www.instagram.com/laila_qottaya/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-[#9d9487] transition hover:text-[#d8bd7a]"
              >
                <Camera className="h-4 w-4 text-[#d8bd7a]" />
                @laila_qottaya
              </a>
              <div className="flex items-center gap-3 text-sm text-[#9d9487]">
                <MapPin className="h-4 w-4 text-[#d8bd7a]" />
                Maarif, Casablanca · Maroc
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/5 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#4a443e]">© {year} Voyage Holistique · Holistic Health Academy.</p>
          <div className="flex flex-wrap gap-6">
            <button
              type="button"
              onClick={openPrivacy}
              className="text-xs text-[#4a443e] transition hover:text-[#9d9487]"
            >
              Politique de confidentialité
            </button>
            <button
              type="button"
              onClick={openLegal}
              className="text-xs text-[#4a443e] transition hover:text-[#9d9487]"
            >
              Mentions légales
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════════ */

export default function RetreatLanding() {
  return (
    <LegalModalProvider>
      <BookingModalProvider>
        <main>
          <Header />
          <Hero />
          <Transformation />
          <Location />
          <Programme />
          <Learn />
          <DoctorAuthority />
          <Testimonials />
          <LaunchOffer />
          <FAQ />
          <ClosingCta />
          <StickyBookingBar />
          <Footer />
        </main>
      </BookingModalProvider>
    </LegalModalProvider>
  );
}
