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
  Check,
  ChevronDown,
  Clock,
  Gem,
  HeartHandshake,
  Home,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Mountain,
  Quote,
  ShieldCheck,
  Sparkles,
  Star,
  Timer,
  Users,
  Utensils,
  Waves,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { BookingModalProvider, useBookingModal } from "@/components/BookingModal";
import { LegalModalProvider, useLegalModals } from "@/components/LegalModals";

type IconType = React.ComponentType<React.SVGProps<SVGSVGElement>>;

/* ─── constants ───────────────────────────────────────────── */
const WHATSAPP = `https://wa.me/212600000000?text=${encodeURIComponent(
  "Bonjour, je souhaite réserver ma place pour le Voyage Holistique (7 960 DH). Merci."
)}`;

/* ─── navigation ──────────────────────────────────────────── */
const navItems = [
  { label: "Expérience", href: "#experience" },
  { label: "Programme", href: "#programme-complet" },
  { label: "Lieu", href: "#location" },
  { label: "Offre", href: "#offer" },
  { label: "Équipe", href: "#supervision" },
  { label: "FAQ", href: "#faq" },
];

/* ─── benefits (Experience section) ───────────────────────── */
const benefits: Array<{ title: string; copy: string; icon: IconType }> = [
  {
    title: "Respiration & recentrage",
    copy: "Sortir du bruit mental et retrouver un espace intérieur calme.",
    icon: Leaf,
  },
  {
    title: "Nature & silence",
    copy: "Des moments loin du rythme urbain pour ralentir profondément.",
    icon: Mountain,
  },
  {
    title: "Thermal healing",
    copy: "L'expérience Vichy pensée pour apaiser le corps et le système nerveux.",
    icon: Waves,
  },
  {
    title: "Cercle humain intime",
    copy: "Un groupe limité pour préserver la qualité des échanges.",
    icon: Users,
  },
  {
    title: "Spiritualité marocaine",
    copy: "Une immersion douce entre traditions, présence et reconnexion.",
    icon: Sparkles,
  },
  {
    title: "Accompagnement expert",
    copy: "Chaque journée est guidée avec attention, écoute et présence.",
    icon: HeartHandshake,
  },
];

const benefitImageAccents = [
  { src: "/images/wellness-space.jpeg", label: "Terrasse panoramique" },
  { src: "/images/riadpoolday.jpeg", label: "Riad lumineux" },
  { src: "/images/thermal-pool.jpeg", label: "Thermal healing" },
  { src: "/images/riad-luxury4.jpeg", label: "Courtyard privé" },
  { src: "/images/WhatsApp Image 2026-05-12 at 16.27.58 (16).jpeg", label: "Architecture marocaine" },
  { src: "/images/luxury-bath5.jpeg", label: "Rituel spa" },
];

const editorialVisuals = [
  {
    src: "/images/riad-luxury4.jpeg",
    eyebrow: "Courtyard",
    title: "Lumière, zellige et silence",
  },
  {
    src: "/images/riad-luxury-room.jpeg",
    eyebrow: "Suite",
    title: "Repos profond",
  },
  {
    src: "/images/luxury-bath5.jpeg",
    eyebrow: "Spa",
    title: "Rituel d'eau",
  },
  {
    src: "/images/WhatsApp Image 2026-05-12 at 16.28.00 (5).jpeg",
    eyebrow: "Salon",
    title: "Hospitalité marocaine",
  },
];

const supervisionImages = [
  "/images/photo laila 2.jpeg",
  "/images/yoga.jpeg",
  "/images/WhatsApp Image 2026-05-12 at 16.28.00 (6).jpeg",
];

/* ─── who is it for ───────────────────────────────────────── */
const whoIsItFor: Array<{ title: string; icon: IconType }> = [
  { title: "Vous vous sentez mentalement saturé(e)", icon: Timer },
  { title: "Vous avez besoin de ralentir sans culpabilité", icon: Clock },
  { title: "Vous cherchez une reconnexion au corps", icon: Sparkles },
  { title: "Vous traversez une période de transition", icon: Mountain },
  { title: "Vous voulez retrouver votre énergie", icon: Zap },
  { title: "Vous avez besoin d'un cadre beau, calme et guidé", icon: Leaf },
];

/* ─── activities ──────────────────────────────────────────── */
const activities = [
  {
    title: "Issawa & Amdah",
    subtitle: "Soirée spirituelle",
    description: "Une soirée spirituelle marocaine pour ouvrir le cœur et apaiser l'esprit.",
    atmosphere: "Sensoriel · Mystique · Authentique",
    image: "/images/sufi-night.jpeg",
  },
  {
    title: "Yoga & Respiration",
    subtitle: "Pratique guidée",
    description: "Des pratiques guidées pour relâcher les tensions et calmer le mental.",
    atmosphere: "Matinal · Doux · Revitalisant",
    image: "/images/yoga.jpeg",
  },
  {
    title: "Nature & Excursions",
    subtitle: "Reconnexion",
    description: "Des moments en pleine nature pour marcher, respirer et retrouver l'essentiel.",
    atmosphere: "Naturel · Apaisant · Ressourçant",
    image: "/images/garden.jpeg",
  },
  {
    title: "Moments d'Exception",
    subtitle: "Partage intime",
    description: "Des instants de partage, de silence et de beauté dans un cadre intime.",
    atmosphere: "Raffiné · Humain · Mémorable",
    image: "/images/WhatsApp Image 2026-05-12 at 16.28.00 (5).jpeg",
  },
];

/* ─── location features ───────────────────────────────────── */
const features: Array<{ title: string; copy: string; icon: IconType }> = [
  {
    title: "Vichy Thermal",
    copy: "Soins et rituels thermaux revitalisants dans un cadre d'exception à Moulay Yacoub.",
    icon: Waves,
  },
  {
    title: "Riad privé",
    copy: "Un riad privatisé pour le groupe : intimité absolue, confort et authenticité raffinée.",
    icon: Home,
  },
  {
    title: "Hébergement VIP",
    copy: "Service haut de gamme, atmosphère soignée et repos profond au cœur de Fès.",
    icon: BedDouble,
  },
  {
    title: "Transport VIP",
    copy: "Transferts privés en Mercedes Mini Bus depuis Casablanca et Rabat, aller-retour inclus.",
    icon: Car,
  },
  {
    title: "Accompagnement expert",
    copy: "Suivi personnalisé et bienveillant par Docteur Laila Qottaya tout au long de la retraite.",
    icon: HeartHandshake,
  },
];

const locationStory: Array<{ icon: IconType; text: string }> = [
  { icon: Waves, text: "Une eau thermale réputée pour la détente profonde." },
  { icon: Leaf, text: "Un cadre pensé pour apaiser le système nerveux." },
  { icon: Home, text: "Un riad privé pour préserver l'intimité du groupe." },
  { icon: Sparkles, text: "Une atmosphère marocaine authentique et raffinée." },
  { icon: Mountain, text: "Une vraie rupture avec le rythme quotidien." },
];

/* ─── detailed programme ──────────────────────────────────── */
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
    subtitle: "Fès — Riad privé — lancement de l'expérience",
    image: "/images/riad-pool-.jpeg",
    schedule: [
      { time: "Matin", activity: "Départ de Casablanca et Rabat en transport VIP.", icon: Car },
      {
        time: "Fin de journée",
        activity: "Arrivée à Fès et installation dans un riad privé réservé exclusivement au groupe.",
        icon: Home,
      },
      { time: "Soir", activity: "Dîner sain et raffiné dans une ambiance calme et authentique.", icon: Utensils },
      {
        time: "Après dîner",
        activity: "Présentation du programme par Docteur Laila Qottaya et ouverture officielle.",
        icon: HeartHandshake,
      },
    ],
    objective: "Entrer doucement dans l'expérience et se préparer à quatre jours de transformation.",
  },
  {
    day: "Jour 2",
    title: "Nature, Yoga & Respiration",
    subtitle: "Sefrou — reconnexion au corps et à la nature",
    image: "/images/wellness-space.jpeg",
    schedule: [
      { time: "08:00 - 10:00", activity: "Réveil, méditation, respiration consciente et petit-déjeuner.", icon: Leaf },
      { time: "10:30", activity: "Départ vers un domaine naturel dans la région de Sefrou.", icon: MapPin },
      {
        time: "11:00 - 13:00",
        activity: "Séance de yoga et pratiques corporelles avec le coach spécialisé.",
        icon: Sparkles,
      },
      {
        time: "13:00 - 14:30",
        activity: "Marche consciente dans la nature et respiration en plein air.",
        icon: Mountain,
      },
      {
        time: "14:30 - 16:30",
        activity: "Pause healthy, produits bio et séances individuelles avec Docteur Laila.",
        icon: HeartHandshake,
      },
      {
        time: "20:00 - 22:00",
        activity: "Soirée spirituelle Issawa puis coaching holistique avant le sommeil.",
        icon: Sparkles,
      },
    ],
    objective: "Libérer les tensions, réactiver l'énergie vitale et retrouver une respiration profonde.",
  },
  {
    day: "Jour 3",
    title: "Vichy Thermal & Spiritualité",
    subtitle: "Moulay Yacoub — bien-être thermal — rencontre inspirante",
    image: "/images/thermal-pool.jpeg",
    schedule: [
      { time: "08:00 - 10:00", activity: "Réveil, yoga sur la terrasse du riad et petit-déjeuner.", icon: Leaf },
      {
        time: "10:30 - 14:00",
        activity: "Départ vers Vichy Thermalia / Moulay Yacoub et expérience thermale.",
        icon: Waves,
      },
      { time: "15:30 - 16:30", activity: "Retour à Fès et temps de repos au riad.", icon: Home },
      { time: "16:30 - 18:30", activity: "Rencontre avec une personnalité inspirante.", icon: Users },
      { time: "19:00 - 20:30", activity: "Dîner raffiné au riad.", icon: Utensils },
      {
        time: "20:30 - 22:00",
        activity: "Soirée Mdah & Samâa puis healing collectif holistique.",
        icon: Sparkles,
      },
    ],
    objective: "Apaiser le système nerveux, nourrir l'âme et vivre une expérience spirituelle authentique.",
  },
  {
    day: "Jour 4",
    title: "Intégration & Clôture",
    subtitle: "Bilan — attestations — retour",
    image: "/images/retreat-bedroom.jpeg",
    schedule: [
      { time: "08:00", activity: "Réveil, méditation, respiration et petit-déjeuner.", icon: Leaf },
      {
        time: "09:00",
        activity: "Séance finale avec Docteur Laila : bilan et conseils holistiques.",
        icon: HeartHandshake,
      },
      { time: "10:00 - 11:30", activity: "Échanges, témoignages et mots des participants.", icon: Users },
      { time: "11:30", activity: "Remise des attestations de participation.", icon: Award },
      { time: "12:00", activity: "Préparation au départ et retour vers Casablanca.", icon: Car },
    ],
    objective: "Repartir avec des outils pratiques et une énergie renouvelée.",
  },
];

/* ─── what you leave with ─────────────────────────────────── */
const whatYouLeaveWith: Array<{ title: string; copy: string; icon: IconType }> = [
  {
    title: "Une respiration plus profonde",
    copy: "Des techniques de respiration consciente à pratiquer au quotidien.",
    icon: Waves,
  },
  {
    title: "Une énergie renouvelée",
    copy: "Votre vitalité est réactivée, votre corps allégé. Vous vous reconnaissez à nouveau.",
    icon: Zap,
  },
  {
    title: "Une clarté mentale",
    copy: "Le bruit du quotidien s'est estompé. Vous voyez vos priorités avec lucidité.",
    icon: Sparkles,
  },
  {
    title: "Des outils pratiques",
    copy: "Yoga, méditation, respiration — des pratiques concrètes pour votre retour.",
    icon: Check,
  },
  {
    title: "Un apaisement émotionnel",
    copy: "Une paix intérieure durable, née du silence et de l'accompagnement bienveillant.",
    icon: HeartHandshake,
  },
  {
    title: "Une reconnexion intérieure",
    copy: "Vous repartez réconcilié(e) avec vous-même, avec un sens renouvelé.",
    icon: Mountain,
  },
];

/* ─── supervision ─────────────────────────────────────────── */
type SupervisionPerson = {
  title: string;
  role: string;
  subtitle: string;
  copy: string;
  icon: IconType;
  image: string;
  captionSuffix?: string;
};

const supervision: SupervisionPerson[] = [
  {
    title: "Docteur Laila Qottaya",
    role: "Médecine holistique",
    subtitle: "Médecine holistique • Bien-être global • Accompagnement émotionnel",
    copy: "Spécialiste de la santé holistique. Elle accompagne l'équilibre global — corps, émotions, mental et spiritualité — avec une présence médicale humaine et bienveillante.",
    icon: HeartHandshake,
    image: "/images/laila-qottaya.jpeg",
  },
  {
    title: "Coach Yoga & Méditation",
    role: "Mouvement conscient",
    subtitle: "Yoga • Méditation • Respiration consciente",
    copy: "Un guide doux et expert. Yoga, méditation et respiration consciente pour calmer le mental et réhabiliter le corps en douceur.",
    icon: Leaf,
    image: "/images/coach-yoga.jpeg",
  },
  {
    title: "Personnalité surprise",
    role: "Invité inspirant",
    subtitle: "Inspiration • Partage humain • Rencontre rare",
    copy: "Une voix singulière, choisie avec soin. Une rencontre inattendue qui marque les esprits et laisse une trace durable.",
    icon: Sparkles,
    image: "/images/anonymous-woman.png",
    captionSuffix: "À dévoiler",
  },
];

const trustCues: Array<{ icon: IconType; text: string }> = [
  { icon: ShieldCheck, text: "Médecine & santé holistique" },
  { icon: HeartHandshake, text: "Accompagnement personnalisé" },
  { icon: Users, text: "Groupe intime et sécurisé" },
];

/* ─── offer items ─────────────────────────────────────────── */
const offerItems: Array<{ title: string; icon: IconType }> = [
  { title: "Riad privatisé", icon: Home },
  { title: "Hébergement VIP", icon: BedDouble },
  { title: "Mercedes Mini Bus VIP", icon: Car },
  { title: "Transport Casablanca / Rabat / Fès", icon: MapPin },
  { title: "Gastronomie saine et raffinée", icon: Utensils },
  { title: "Expérience Vichy Thermal", icon: Waves },
  { title: "Yoga, méditation & respiration", icon: Leaf },
  { title: "Soirées spirituelles Issawa, Mdah & Samâa", icon: HeartHandshake },
  { title: "Encadrement expert", icon: ShieldCheck },
  { title: "Attestation de participation", icon: Award },
  { title: "Groupe limité à 20 personnes", icon: Users },
];

/* ─── FAQs ────────────────────────────────────────────────── */
const faqs = [
  {
    question: "Faut-il avoir un niveau en yoga ?",
    answer: "Non, aucune expérience préalable n’est requise. Toutes les pratiques sont guidées et adaptées à chaque participante, quel que soit son niveau.",
  },
  {
    question: "Le transport est-il inclus ?",
    answer: "Oui, le transport VIP en Mercedes Mini Bus depuis Casablanca et Rabat vers Fès (aller-retour) est entièrement inclus dans le tarif.",
  },
  {
    question: "Les chambres sont-elles privées ?",
    answer: "L’hébergement est en chambre partagée dans un riad privatisé exclusivement pour le groupe, avec un confort haut de gamme. Des options de chambre individuelle peuvent être discutées selon la disponibilité.",
  },
  {
    question: "Combien de participantes ?",
    answer:
      "Le groupe est volontairement limité à 20 participantes afin de préserver une expérience intime, personnalisée et de grande qualité.",
  },
  {
    question: "Quelle est la politique d’annulation ?",
    answer:
      "Toute annulation effectuée 30 jours avant la date de départ donne droit à un remboursement intégral. Entre 30 et 15 jours, 50% du montant est retenu. En deçà de 15 jours, aucun remboursement n’est possible. Le transfert de place à une autre personne est accepté sans frais.",
  },
  {
    question: "La retraite est-elle ouverte aux débutantes ?",
    answer: "Absolument. Cette retraite est conçue pour toutes les femmes, débutantes ou initiées. Chaque pratique est guidée avec douceur et adaptée à votre rythme.",
  },
  {
    question: "Un accompagnement personnalisé est-il possible ?",
    answer:
      "Oui, Docteur Laila Qottaya propose des séances individuelles de coaching holistique pendant la retraite. Ces moments privilégiés permettent un travail plus profond et adapté à vos besoins spécifiques.",
  },
  {
    question: "Que comprend le tarif ?",
    answer:
      "Le tarif inclut l’hébergement premium, le transport VIP aller-retour, les repas sains et raffinés, toutes les expériences holistiques, le Vichy Thermal, l’encadrement expert et l’attestation de participation.",
  },
  {
    question: "Comment réserver ?",
    answer:
      "Vous pouvez réserver directement via le bouton « Réserver ma place » sur cette page ou nous contacter par WhatsApp. Un acompte sécurise votre place.",
  },
  {
    question: "Peut-on venir seule ?",
    answer:
      "Oui, la majorité des participantes viennent seules. Le cadre est pensé pour être accueillant, respectueux et bienveillant. C’est souvent le meilleur moyen de vivre pleinement l’expérience.",
  },
];

/* ─── testimonials ────────────────────────────────────────── */
const testimonials = [
  {
    quote:
      "Je suis arrivée fatiguée, avec l'impression de porter trop de choses. Je suis repartie avec une respiration plus calme et une énergie que je n'avais pas ressentie depuis longtemps.",
    name: "Nadia B.",
    role: "Entrepreneure",
    city: "Casablanca",
    stars: 5,
  },
  {
    quote:
      "Le mélange entre le riad, les thermes, la spiritualité et l'accompagnement m'a profondément touchée. Tout était pensé avec finesse.",
    name: "Samira E.",
    role: "Fondatrice creative",
    city: "Rabat",
    stars: 5,
  },
  {
    quote:
      "Je ne cherchais pas seulement du repos. J'avais besoin d'un cadre pour me retrouver. Ces quatre jours m'ont vraiment recentrée.",
    name: "Leila M.",
    role: "Consultante",
    city: "Marrakech",
    stars: 5,
  },
  {
    quote:
      "J'ai retrouvé un calme intérieur que je pensais avoir perdu. Le cadre, l'encadrement, les soins — tout portait vers l'essentiel.",
    name: "Amina K.",
    role: "Architecte d'intérieur",
    city: "Casablanca",
    stars: 5,
  },
  {
    quote:
      "C'est la première fois que je me suis autorisée à m'arrêter vraiment. L'expérience thermale et les soirées spirituelles m'ont profondément marquée.",
    name: "Fatima Z.",
    role: "Médecin",
    city: "Rabat",
    stars: 5,
  },
];

/* ─── animation variants ──────────────────────────────────── */
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
   HEADER
══════════════════════════════════════════════════════════════ */

function Header() {
  const [open, setOpen] = useState(false);
  const { open: openBooking } = useBookingModal();

  return (
    <>
      {/* Sits at the very top of the page — scrolls away with content (not fixed) */}
      <header className="absolute left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-full border border-white/10 bg-[#07120e]/45 px-4 py-3 text-[#f7f0e4] shadow-2xl backdrop-blur-xl md:px-6">
          <a href="#top" className="flex shrink-0 items-center">
            <Image
              src="/images/logo.png"
              alt="Holistic Health Academy"
              width={160}
              height={40}
              className="h-6 w-auto object-contain sm:h-7"
              priority
            />
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
                Réserver votre expérience
              </button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO  (approved — do not redesign)
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
          className="scale-110 object-cover"
          style={{ filter: "brightness(1.16) saturate(1.14) sepia(0.08)" }}
        />
      </motion.div>
      {/* Warmer, lighter cinematic gradient — keeps text readable while letting the golden light breathe */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,15,0.54),rgba(91,55,24,0.24)_48%,rgba(216,167,85,0.08)),linear-gradient(180deg,rgba(5,20,15,0.30),rgba(91,55,24,0.20)_46%,rgba(5,20,15,0.50))]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(0deg,rgba(7,18,14,0.68),rgba(7,18,14,0))]" />

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col justify-end px-5 pb-8 pt-36 md:px-8 md:pb-14"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#d8bd7a] md:text-sm">
              Retraite d&apos;Exception · Fès & Moulay Yacoub
            </p>
          </motion.div>

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
              <p className="font-display text-2xl text-[#ecd8aa] md:text-3xl">Corps · Âme · Esprit</p>
              <p className="mt-4 max-w-lg text-base leading-8 text-[#e8dfcf]/90 md:text-lg">
                Quatre jours pour ralentir, respirer et revenir à vous.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <CtaButton onClick={() => openBooking("hero")}>Réserver ma place</CtaButton>
              <a
                href="#programme-complet"
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#e8dfcf] transition duration-300 hover:border-white/40 hover:text-white sm:w-auto sm:px-6"
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
        Fès · Moulay Yacoub
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXPERIENCE — luxury benefits (6 cards)
══════════════════════════════════════════════════════════════ */

function Experience() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-[#efe2cf] px-5 py-24 text-[#07120e] md:px-8 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(143,111,56,0.34) 1px, transparent 1px), linear-gradient(45deg, rgba(15,42,32,0.18) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#07120e]/18 to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[640px] lg:min-h-[680px]"
        >
          <div className="luxury-shadow relative h-[470px] overflow-hidden rounded-[10px] border border-[#c19a55]/25 bg-[#07120e] md:h-[620px]">
            <Image
              src="/images/riad-luxury4.jpeg"
              alt="Courtyard marocain privé avec bassin"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              style={{ filter: "brightness(1.04) saturate(1.08) sepia(0.04)" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,14,0.08),rgba(7,18,14,0.16)),linear-gradient(90deg,rgba(193,154,85,0.08),transparent_48%)]" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4 border-t border-white/30 pt-5 text-[#fbf4e8]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f4d796]">Riad privé</p>
                <p className="font-display mt-2 text-3xl font-semibold md:text-4xl">Un lieu qui respire</p>
              </div>
              <Gem className="hidden h-10 w-10 text-[#f4d796] sm:block" />
            </div>
          </div>

          <div className="absolute bottom-8 right-0 w-[58%] overflow-hidden rounded-[10px] border-4 border-[#efe2cf] bg-[#07120e] shadow-[0_24px_60px_rgba(7,18,14,0.22)] md:-right-5 md:bottom-9 md:w-[44%]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/thermal-pool.jpeg"
                alt="Espace thermal lumineux"
                fill
                sizes="(min-width: 1024px) 24vw, 56vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute -left-2 top-8 hidden w-[34%] overflow-hidden rounded-[10px] border-4 border-[#efe2cf] bg-[#07120e] shadow-[0_18px_50px_rgba(7,18,14,0.18)] sm:block">
            <div className="relative aspect-[5/4]">
              <Image
                src="/images/WhatsApp Image 2026-05-12 at 16.28.00 (6).jpeg"
                alt="Atrium marocain avec lanternes"
                fill
                sizes="22vw"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>

        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8f6f38]">L'expérience</p>
            <h2 className="font-display mt-5 max-w-2xl text-4xl font-semibold leading-[1.04] text-[#07120e] md:text-6xl">
              Bien plus qu'un séjour bien-être.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#5d574c] md:text-lg">
              Une respiration rare dans un quotidien saturé, portée par le riad, l'eau, la nature et un cercle
              volontairement intime.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const accent = benefitImageAccents[index];
              return (
                <motion.article
                  key={benefit.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: index * 0.05 }}
                  className="group relative min-h-[210px] overflow-hidden rounded-[10px] border border-[#c19a55]/20 bg-[#fbf6ec]/78 p-5 shadow-[0_18px_45px_rgba(7,18,14,0.08)] backdrop-blur-sm transition duration-500 hover:-translate-y-1 hover:border-[#c19a55]/45 hover:bg-white"
                >
                  <div className="absolute right-4 top-4 h-16 w-16 overflow-hidden rounded-full border border-[#c19a55]/25 opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100">
                    <Image
                      src={accent.src}
                      alt={accent.label}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full border border-[#c19a55]/35 bg-[#c19a55]/10 text-[#8f6f38] transition duration-500 group-hover:bg-[#c19a55] group-hover:text-[#07120e]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display relative mt-7 max-w-[12rem] text-2xl font-semibold leading-tight text-[#07120e]">
                    {benefit.title}
                  </h3>
                  <p className="relative mt-3 max-w-[17rem] text-sm leading-6 text-[#5d574c]">{benefit.copy}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHO IS IT FOR
══════════════════════════════════════════════════════════════ */

function WhoIsItFor() {
  const { open: openBooking } = useBookingModal();
  return (
    <section id="pour-vous" className="relative overflow-hidden bg-[#fbf3e7] px-5 py-28 text-[#07120e] md:px-8 md:py-36">
      <Image
        src="/images/riad-terrace.jpeg"
        alt="Terrasse de riad baignée de lumière"
        fill
        sizes="100vw"
        className="object-cover opacity-[0.14]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(251,243,231,0.96),rgba(251,243,231,0.86)_55%,rgba(251,243,231,0.70)),linear-gradient(180deg,rgba(216,189,122,0.18),rgba(251,243,231,0.94))]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12px 12px, rgba(143,111,56,0.32) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="relative mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-[500px] lg:min-h-[680px]"
        >
          <div className="luxury-shadow relative h-[460px] overflow-hidden rounded-[10px] border border-[#c19a55]/25 bg-[#07120e] md:h-[620px]">
            <Image
              src="/images/riad-terrace.jpeg"
              alt="Terrasse calme ouverte sur le jardin"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover"
              style={{ filter: "brightness(1.08) saturate(1.1) sepia(0.05)" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,14,0.04),rgba(7,18,14,0.28)),linear-gradient(90deg,rgba(193,154,85,0.14),transparent_62%)]" />
          </div>

          <div className="absolute -bottom-1 right-0 w-[54%] overflow-hidden rounded-[10px] border-4 border-[#fbf3e7] bg-[#07120e] shadow-[0_24px_60px_rgba(7,18,14,0.2)] md:-right-8 md:bottom-12 md:w-[46%]">
            <div className="relative aspect-[4/3]">
              <Image
                src="/images/yoga.jpeg"
                alt="Pratique corporelle en plein air"
                fill
                sizes="(min-width: 1024px) 22vw, 54vw"
                className="object-cover"
              />
            </div>
          </div>

          <div className="absolute left-5 top-5 max-w-[15rem] border-l border-[#d8bd7a]/70 bg-[#07120e]/46 px-5 py-4 text-[#fbf4e8] backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#f4d796]">Invitation</p>
            <p className="font-display mt-2 text-2xl font-semibold leading-tight">Ralentir sans disparaître.</p>
          </div>
        </motion.div>

        <div>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8f6f38]">Pour qui ?</p>
            <h2 className="font-display mt-5 max-w-3xl text-4xl font-semibold leading-[1.04] text-[#07120e] md:text-6xl">
              Cette retraite est pour vous si…
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-9 text-[#5d574c] md:text-xl">
              Vous n’avez pas besoin d’être prêt(e). Vous avez juste besoin de vous autoriser à venir.
            </p>
          </motion.div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {whoIsItFor.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.article
                  key={item.title}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: index * 0.06 }}
                  className="group relative flex min-h-[148px] items-start gap-5 overflow-hidden rounded-[12px] border border-[#c19a55]/20 bg-white/62 p-6 shadow-[0_16px_40px_rgba(7,18,14,0.07)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#c19a55]/40 hover:bg-white/85"
                >
                  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-[#d8bd7a] via-[#c19a55]/70 to-transparent opacity-75" />
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#c19a55]/35 bg-[#c19a55]/10 text-[#8f6f38] transition group-hover:bg-[#c19a55] group-hover:text-[#07120e]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display pt-2 text-[22px] font-medium leading-tight text-[#07120e] md:text-2xl">
                    {item.title}
                  </h3>
                </motion.article>
              );
            })}
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.75, delay: 0.24 }}
            className="mt-12 border-t border-[#c19a55]/25 pt-9"
          >
            <p className="font-display max-w-2xl text-2xl leading-snug text-[#8f6f38] md:text-3xl">
              &ldquo;Vous n&rsquo;avez pas besoin de tout changer. Parfois, il suffit de quatre jours pour recommencer
              à respirer.&rdquo;
            </p>
            <div className="mt-8">
              <CtaButton onClick={() => openBooking("who_is_it_for")}>Réserver ma place</CtaButton>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   ACTIVITIES
══════════════════════════════════════════════════════════════ */

function EditorialVisualStory() {
  return (
    <section className="relative overflow-hidden bg-[#07120e] px-5 py-24 text-[#f7f0e4] md:px-8 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(216,189,122,0.12),transparent_34%),linear-gradient(180deg,rgba(7,18,14,1),rgba(15,42,32,0.96))]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#d8bd7a]">Atmosphère</p>
          <h2 className="font-display mt-5 max-w-xl text-5xl font-semibold leading-[1.02] text-[#fbf4e8] md:text-7xl">
            Le décor fait partie du soin.
          </h2>
          <p className="mt-7 max-w-lg text-base leading-8 text-[#cfc6b8] md:text-lg">
            Riad privé, suites calmes, bains marocains et salons baignés de lumière : chaque espace soutient le
            ralentissement.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
            {["Riad privé", "Suite premium", "Spa marocain", "Salon intime"].map((item) => (
              <div key={item} className="border-l border-[#d8bd7a]/50 bg-white/[0.04] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8bd7a]">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-4 sm:grid-cols-[1.08fr_0.92fr]"
        >
          <div className="luxury-shadow group relative min-h-[500px] overflow-hidden rounded-[10px] border border-[#d8bd7a]/18 bg-[#07120e]">
            <Image
              src={editorialVisuals[0].src}
              alt={editorialVisuals[0].title}
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover transition duration-[1200ms] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07120e]/62 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8bd7a]">
                {editorialVisuals[0].eyebrow}
              </p>
              <p className="font-display mt-2 text-3xl font-semibold text-[#fbf4e8]">
                {editorialVisuals[0].title}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {editorialVisuals.slice(1).map((visual, index) => (
              <div
                key={visual.src}
                className={`group relative overflow-hidden rounded-[10px] border border-[#d8bd7a]/18 bg-[#07120e] ${
                  index === 1 ? "min-h-[260px]" : "min-h-[220px]"
                }`}
              >
                <Image
                  src={visual.src}
                  alt={visual.title}
                  fill
                  sizes="(min-width: 1024px) 28vw, 100vw"
                  className="object-cover transition duration-[1200ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07120e]/66 via-[#07120e]/8 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8bd7a]">
                    {visual.eyebrow}
                  </p>
                  <p className="font-display mt-1 text-2xl font-semibold text-[#fbf4e8]">{visual.title}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Activities() {
  return (
    <section id="activities" className="bg-[#efe6d6] px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <SectionHeading
            eyebrow="Activités"
            title="Des instants rares, gravés dans le corps."
            copy="Chaque pratique est pensée pour vous faire ralentir, ressentir et revenir à vous."
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="hidden justify-end lg:flex"
          >
            <p className="vertical-title text-xs font-semibold uppercase tracking-[0.38em] text-[#8f6f38]">
              Spiritualite · Nature · Presence
            </p>
          </motion.div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {activities.map((activity, index) => (
            <motion.article
              key={activity.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
              className="group luxury-shadow relative min-h-[520px] overflow-hidden rounded-[10px] bg-[#07120e]"
            >
              <Image
                src={activity.image}
                alt={activity.title}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                className="object-cover transition duration-[1200ms] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07120e] via-[#07120e]/45 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <div className="gold-divider mb-5" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#d8bd7a]">
                  {activity.subtitle}
                </p>
                <h3 className="font-display mt-2 text-4xl font-semibold text-[#fbf4e8]">{activity.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#c9bfaf] md:opacity-90 md:transition md:duration-500 md:group-hover:opacity-100">
                  {activity.description}
                </p>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9a8970]">
                  {activity.atmosphere}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOCATION
══════════════════════════════════════════════════════════════ */

function Location() {
  return (
    <section id="location" className="relative overflow-hidden bg-[#f7f0e4] px-5 py-28 md:px-8 md:py-36">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-[0.05]">
        <Image src="/images/thermal-pool.jpeg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#8f6f38]">Lieu signature</p>
            <h2 className="font-display mt-5 text-5xl font-semibold leading-[1.02] text-[#07120e] md:text-7xl">
              Vichy Céleste à Fès — Thermes de Moulay Yacoub
            </h2>
            <p className="mt-6 max-w-lg text-xl leading-9 text-[#5d574c]">
              Entre eau thermale, silence et hospitalité marocaine raffinée.
            </p>

            <div className="mt-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#8f6f38]">
                Pourquoi ce lieu est unique
              </p>
              <div className="mt-6 grid gap-4">
                {locationStory.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-start gap-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#9a7638]/12 text-[#9a7638]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <p className="text-base leading-7 text-[#5d574c]">{item.text}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Editorial image stack */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[620px]"
          >
            <div className="luxury-shadow absolute right-0 top-0 h-[78%] w-[88%] overflow-hidden rounded-[10px]">
              <Image
                src="/images/riad.jpeg"
                alt="Riad privé"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07120e]/60 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <div className="gold-divider mb-3" />
                <p className="font-display text-2xl text-[#f7f0e4]">Riad privé · Fès</p>
              </div>
            </div>
            <div className="luxury-shadow absolute bottom-0 left-0 h-[52%] w-[62%] overflow-hidden rounded-[10px] border-4 border-[#f7f0e4]">
              <Image
                src="/images/thermal-pool.jpeg"
                alt="Thermes de Moulay Yacoub"
                fill
                sizes="(min-width: 1024px) 30vw, 60vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07120e]/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d8bd7a]">
                  Thermal
                </p>
                <p className="font-display text-lg text-[#f7f0e4]">Moulay Yacoub</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: index * 0.06 }}
                className="rounded-[10px] border border-[#c19a55]/25 bg-white/45 p-6 shadow-[0_18px_50px_rgba(62,48,28,0.1)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-[#c19a55]/45 hover:shadow-[0_22px_60px_rgba(62,48,28,0.16)]"
              >
                <Icon className="h-8 w-8 text-[#9a7638]" />
                <h3 className="mt-6 font-display text-2xl font-semibold text-[#07120e]">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#62594b]">{feature.copy}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROGRAMME — cinematic tab layout
══════════════════════════════════════════════════════════════ */

function Programme() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section id="programme-complet" className="bg-[#0f2a20] px-5 py-28 text-[#f7f0e4] md:px-8 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          light
          eyebrow="Programme complet"
          title="Quatre jours, un itinéraire clair et transformateur."
          copy="Chaque journée vous guide doucement du ralentissement vers la reconnexion."
        />

        <div className="mt-16 flex flex-wrap justify-center gap-2">
          {detailedProgram.map((day, index) => (
            <button
              key={day.day}
              type="button"
              onClick={() => setActiveDay(index)}
              className={`rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition duration-300 ${
                activeDay === index
                  ? "border-[#d8bd7a] bg-[#d8bd7a] text-[#07120e]"
                  : "border-white/20 text-[#c9c1b4] hover:border-[#d8bd7a]/55 hover:text-[#d8bd7a]"
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
                <div className="relative min-h-72 overflow-hidden rounded-[10px] lg:min-h-full">
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

                <div className="rounded-[10px] border border-white/10 bg-white/[0.04] p-6 md:p-8">
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
                          className="grid gap-3 rounded-[10px] bg-white/[0.05] p-4 transition duration-200 hover:bg-white/[0.085] md:grid-cols-[160px_1fr] md:gap-4"
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

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          className="mt-16 flex flex-col items-center gap-6 border-t border-white/10 pt-14 sm:flex-row sm:justify-between"
        >
          <p className="max-w-lg text-center text-base leading-7 text-[#a8a098] sm:text-left">
            Un programme conçu pour vous transformer en douceur — jour après jour, couche après couche.
          </p>
          <CtaButton href="#offer">Voir l&apos;offre de lancement</CtaButton>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHAT YOU LEAVE WITH
══════════════════════════════════════════════════════════════ */

function WhatYouLeaveWith() {
  return (
    <section className="relative overflow-hidden bg-[#07120e] px-5 py-28 text-[#f7f0e4] md:px-8 md:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]">
        <Image src="/images/riad-terrace.jpeg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          light
          eyebrow="Transformation"
          title="Ce que vous emporterez avec vous"
          copy="Au-delà du séjour, des repères concrets pour continuer à prendre soin de vous."
        />
        <div className="mt-20 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {whatYouLeaveWith.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: index * 0.06 }}
                className="group relative overflow-hidden rounded-[10px] border border-[#d8bd7a]/15 bg-white/[0.04] p-7 backdrop-blur-sm transition duration-500 hover:border-[#d8bd7a]/40 hover:bg-white/[0.07]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d8bd7a]/10 text-[#d8bd7a]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display mt-6 text-2xl font-semibold text-[#fbf4e8]">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[#b0a898]">{item.copy}</p>
                <div className="mt-6 h-px w-10 bg-[#d8bd7a]/45 transition-all duration-700 group-hover:w-full" />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   SUPERVISION
══════════════════════════════════════════════════════════════ */

function Supervision() {
  return (
    <section id="supervision" className="relative overflow-hidden bg-[#efe6d6] px-5 py-28 md:px-8 md:py-36">
      {/* Subtle Moroccan-tone background gradient for warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(216,189,122,0.08) 0%, transparent 55%), radial-gradient(ellipse at bottom, rgba(154,118,56,0.06) 0%, transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl">
        <SectionHeading
          eyebrow="Encadrement"
          title="Un encadrement expert et bienveillant"
          copy="Chaque moment est accompagné avec écoute, présence et exigence, pour préserver un cadre sûr, intime et profondément humain."
        />

        <div className="mt-20 grid gap-7 md:grid-cols-3">
          {supervision.map((person, index) => (
            <SupervisionCard key={person.title} person={person} index={index} />
          ))}
        </div>

        {/* Trust cues */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.75, delay: 0.3 }}
          className="mt-14 grid gap-3 sm:grid-cols-3"
        >
          {trustCues.map((cue) => {
            const Icon = cue.icon;
            return (
              <div
                key={cue.text}
                className="flex items-center gap-3 rounded-full border border-[#c19a55]/30 bg-white/65 px-5 py-3 backdrop-blur transition hover:border-[#c19a55]/55"
              >
                <Icon className="h-4 w-4 shrink-0 text-[#9a7638]" />
                <span className="text-sm font-medium text-[#5d574c]">{cue.text}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function SupervisionCard({ person, index }: { person: SupervisionPerson; index: number }) {
  const Icon = person.icon;
  return (
    <motion.article
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col overflow-hidden rounded-[12px] border border-[#c19a55]/30 bg-[#fbf6ec]/85 shadow-[0_28px_70px_rgba(57,45,27,0.12)] transition duration-500 hover:-translate-y-1.5 hover:border-[#c19a55]/55 hover:shadow-[0_38px_90px_rgba(57,45,27,0.22)]"
    >
      {/* Editorial portrait area — tall, breathing space, matched grading across all three cards */}
      <div className="relative h-[460px] overflow-hidden md:h-[500px]">
        <PortraitVisual
          image={person.image}
          alt={person.title}
          role={person.role}
          suffix={person.captionSuffix}
        />
      </div>

      {/* Text content */}
      <div className="flex flex-1 flex-col p-8 md:p-9">
        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#c19a55]/35 bg-white/70 text-[#9a7638] transition duration-300 group-hover:border-[#c19a55]/65 group-hover:bg-[#d8bd7a]/18">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-display mt-6 text-3xl font-semibold leading-tight text-[#07120e]">
          {person.title}
        </h3>
        <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9a7638]">
          {person.subtitle}
        </p>
        <p className="mt-5 text-sm leading-7 text-[#5d574c]">{person.copy}</p>
      </div>
    </motion.article>
  );
}

/**
 * Shared visual frame — used across all 3 supervision cards to enforce
 * one unified editorial look: same height, hairlines, vignette, warm grade,
 * and caption layout.
 */
function CardFrame({ role, suffix }: { role: string; suffix?: string }) {
  return (
    <>
      {/* Bottom gradient for caption readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07120e]/72 via-[#07120e]/12 to-transparent" />
      {/* Warm Moroccan sun grade — matches all three cards */}
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-65"
        style={{
          background:
            "linear-gradient(135deg, rgba(216,189,122,0.22) 0%, transparent 48%, rgba(154,118,56,0.18) 100%)",
        }}
      />
      {/* Subtle editorial vignette */}
      <div
        className="absolute inset-0 mix-blend-overlay opacity-35"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(7,18,14,0.55) 100%)",
        }}
      />
      {/* Top gold hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#d8bd7a]/55 to-transparent" />
      {/* Caption */}
      <div className="absolute inset-x-6 bottom-6">
        <div className="gold-divider mb-3" />
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d8bd7a]">
          {role}
          {suffix ? <span className="text-[#d8bd7a]/65"> · {suffix}</span> : null}
        </p>
      </div>
    </>
  );
}

function PortraitVisual({
  image,
  alt,
  role,
  suffix,
}: {
  image: string;
  alt: string;
  role: string;
  suffix?: string;
}) {
  return (
    <>
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover transition duration-[1500ms] ease-out group-hover:scale-[1.025]"
        // Reveal more upper body — face sits in the top third, not centred on the lens
        style={{ objectPosition: "center 18%" }}
      />
      <CardFrame role={role} suffix={suffix} />
    </>
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
    <section id="testimonials" className="bg-[#07120e] px-5 py-28 text-[#f7f0e4] md:px-8 md:py-36">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          light
          eyebrow="Témoignages"
          title="Ce qui reste après le silence."
          copy="Des mots sobres pour une expérience qui s'inscrit souvent au-delà des mots."
        />
        <div className="luxury-shadow relative mt-16 overflow-hidden rounded-[10px] border border-[#d8bd7a]/20 bg-white/[0.04] p-8 backdrop-blur md:p-16">
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
                    <Star key={i} className="h-3.5 w-3.5 fill-[#d8bd7a]/80 text-[#d8bd7a]/80" />
                  ))}
                </div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#f7f0e4]">
                  {current.name}
                </p>
                <div className="mt-1.5 flex items-center gap-3">
                  <p className="text-sm text-[#9a8970]">{current.role}</p>
                  <span className="text-[#4a443e]">·</span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-[#9a8970]">
                    <MapPin className="h-3 w-3 text-[#d8bd7a]/60" />
                    {current.city}
                  </span>
                </div>
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
   LAUNCH OFFER
══════════════════════════════════════════════════════════════ */

function LaunchOffer() {
  const { open: openBooking } = useBookingModal();
  return (
    <section id="offer" className="relative overflow-hidden bg-[#f7f0e4] px-5 py-28 md:px-8 md:py-36">
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <Image src="/images/table.jpeg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
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
          <p className="mt-6 max-w-xl text-lg leading-9 text-[#5d574c]">
            Une retraite immersive premium de 4 jours, proposée en tarif de lancement pour un groupe volontairement
            restreint.
          </p>
          <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-[#c19a55]/35 bg-white/65 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#07120e] backdrop-blur">
            <Users className="h-5 w-5 text-[#9a7638]" />
            Places limitées — groupe intime de 20 participants.
          </div>
          <div className="mt-12 hidden lg:block">
            <p className="font-display mb-6 text-xl leading-snug text-[#8f6f38] md:text-2xl">
              &ldquo;Un investissement rare pour une transformation profonde.&rdquo;
            </p>
            <div className="flex flex-col gap-3">
              <CtaButton onClick={() => openBooking("pricing")}>Réserver ma place</CtaButton>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="luxury-shadow overflow-hidden rounded-[10px] border border-[#d8bd7a]/40 bg-[#07120e] text-[#f7f0e4]"
        >
          <div className="border-b border-[#d8bd7a]/20 p-8 md:p-10">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#d8bd7a]">
                  Tarif exceptionnel
                </p>
                <p className="font-display mt-3 text-6xl font-semibold leading-none text-[#fbf4e8] md:text-8xl">
                  7 960 DH
                </p>
                <p className="mt-3 text-sm text-[#9a8868]">
                  Une retraite immersive premium de 4 jours.
                </p>
              </div>
              <BadgeCheck className="h-16 w-16 text-[#d8bd7a]" />
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#cfc6b8]">
              Le tarif réunit l&rsquo;essentiel : hébergement, transport, gastronomie, pratiques holistiques,
              thermes et encadrement.
            </p>
          </div>
          <div className="grid gap-3 p-8 sm:grid-cols-2 md:p-10">
            {offerItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3 rounded-[10px] bg-white/[0.055] p-4">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d8bd7a]/12 text-[#d8bd7a]">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm leading-6 text-[#e6dccb]">{item.title}</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-[#d8bd7a]/20 p-8 md:p-10">
            <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#9a8868]">
                <Users className="h-3.5 w-3.5 text-[#d8bd7a]/70" />
                Places limitées à 20 participantes
              </span>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#9a8868]">
                <Gem className="h-3.5 w-3.5 text-[#d8bd7a]/70" />
                Expérience intimiste
              </span>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#9a8868]">
                <Car className="h-3.5 w-3.5 text-[#d8bd7a]/70" />
                Transport VIP inclus
              </span>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#9a8868]">
                <BedDouble className="h-3.5 w-3.5 text-[#d8bd7a]/70" />
                Hébergement premium
              </span>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#9a8868]">
                <HeartHandshake className="h-3.5 w-3.5 text-[#d8bd7a]/70" />
                Accompagnement personnalisé
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <CtaButton onClick={() => openBooking("pricing_card")}>Réserver ma place</CtaButton>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3 lg:hidden">
          <CtaButton onClick={() => openBooking("pricing_mobile")}>Réserver ma place</CtaButton>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FAQ
══════════════════════════════════════════════════════════════ */

function FAQ() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-[#efe6d6] px-5 py-28 md:px-8 md:py-36">
      <div className="mx-auto max-w-4xl">
        <SectionHeading
          eyebrow="Questions fréquentes"
          title="Tout ce qu'il faut savoir avant de réserver"
          copy="Les informations essentielles pour comprendre précisément ce que comprend votre retraite."
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
                className="overflow-hidden rounded-[10px] border border-[#c19a55]/25 bg-[#fbf6ec]/85 transition hover:border-[#c19a55]/45"
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
   CLOSING CTA
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
        alt="Private riad pool"
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
          Une expérience rare pour ralentir, respirer et repartir avec une énergie renouvelée.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-[#d8bd7a]/30 bg-[#d8bd7a]/10 px-5 py-2">
          <Users className="h-4 w-4 text-[#d8bd7a]" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#d8bd7a]">
            Places limitées à 20 participants
          </span>
        </div>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <CtaButton onClick={() => openBooking("closing_cta")}>Réserver ma place</CtaButton>
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
    // If the user has already opened the booking modal once, never show the
    // sticky bar again — they've already engaged.
    if (hasBeenOpened) {
      setVisible(false);
      return;
    }

    const onScroll = () => {
      // Visibility rule: show only when the pricing section (#offer) has
      // started entering the viewport, and hide again before the closing
      // CTA (#reserve) so the bar never overlaps the final form area.
      const offerEl = document.getElementById("offer");
      if (!offerEl) {
        setVisible(false);
        return;
      }
      const offerTop = offerEl.getBoundingClientRect().top;
      const offerHasEntered = offerTop < window.innerHeight - 80;

      // Fallback safety net: also unlock at 65% scroll depth in case the
      // offer section is missing or restructured later.
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollDepth = docHeight > 0 ? window.scrollY / docHeight : 0;
      const deepEnough = scrollDepth > 0.65;

      const reserveEl = document.getElementById("reserve");
      const reserveTop = reserveEl
        ? reserveEl.getBoundingClientRect().top + window.scrollY
        : Number.POSITIVE_INFINITY;
      const aboveReserve = window.scrollY < reserveTop - 240;

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
          className="fixed inset-x-0 bottom-3 z-40 px-3 md:bottom-5 md:px-6"
        >
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 rounded-full border border-[#d8bd7a]/35 bg-[#07120e]/90 px-3 py-2 shadow-[0_24px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl md:px-4 md:py-2.5">
            <div className="hidden items-center gap-3 pl-3 sm:flex">
              <Image
                src="/images/logo.png"
                alt="Holistic Health Academy"
                width={80}
                height={24}
                className="h-5 w-auto object-contain"
              />
              <span className="text-xs uppercase tracking-[0.18em] text-[#9a8970]">·</span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#d8bd7a]">
                Voyage Holistique
              </span>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2 sm:flex-initial">
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
    <footer className="bg-[#050b09] px-5 pb-24 pt-14 text-[#d6cbbb] md:px-8 md:pb-14">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center text-center">
        <Image
          src="/images/logo.png"
          alt="Holistic Health Academy"
          width={160}
          height={48}
          className="mb-4 h-9 w-auto object-contain opacity-80"
        />
        
        <p className="mb-6 text-sm italic text-[#9d9487]">
          « Une retraite intime entre corps, âme et esprit. »
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs tracking-wide text-[#9d9487] sm:gap-6">
          <a href="mailto:contact@holistichealth.academy" className="transition hover:text-[#d8bd7a]">
            contact@holistichealth.academy
          </a>
          <span className="hidden text-[#4a443e] sm:block">·</span>
          <a href="tel:+31625375673" className="transition hover:text-[#d8bd7a]">
            +31 6 25 37 56 73
          </a>
          <span className="hidden text-[#4a443e] sm:block">·</span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3 w-3 text-[#9d9487]/70" />
            Casablanca, Morocco
          </span>
        </div>

        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#4a443e]">
          Expérience privée organisée par Holistic Health Academy
        </p>

        <div className="mt-8 flex w-full flex-wrap items-center justify-center gap-6 border-t border-white/5 pt-6 text-xs text-[#4a443e]">
          <p>© {year} Holistic Health Academy.</p>
          <button type="button" onClick={openPrivacy} className="transition hover:text-[#9d9487]">
            Politique de confidentialité
          </button>
          <button type="button" onClick={openLegal} className="transition hover:text-[#9d9487]">
            Mentions légales
          </button>
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
        <Experience />
        <WhoIsItFor />
        <Activities />
        <Location />
        <Programme />
        <WhatYouLeaveWith />
        <Supervision />
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
