import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600", "700"]
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"]
});

const SITE_URL = "https://voyage.holistichealth.academy";
const HERO_IMAGE = "/images/hero.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Voyage Holistique | Retraite bien-être premium au Maroc",
  description:
    "Voyage Holistique est une retraite holistique premium de 4 jours au Maroc, entre Fès, Sefrou et Vichy Thermal, dédiée au bien-être, à la santé holistique, à la reconnexion corps-esprit et à la transformation intérieure.",
  keywords: [
    "Voyage Holistique",
    "retraite holistique Maroc",
    "wellness retreat Morocco",
    "luxury wellness retreat",
    "retraite bien-être premium",
    "santé holistique",
    "Holistic Health Academy",
    "Vichy Thermal",
    "Fès",
    "Sefrou",
    "hijama sèche",
    "yoga",
    "méditation",
    "transformation personnelle",
    "reconnexion corps esprit",
    "équilibre émotionnel",
    "calme intérieur",
    "clarté mentale"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/`,
    siteName: "Voyage Holistique",
    title: "Voyage Holistique | Retraite holistique premium au Maroc",
    description:
      "Une expérience privée de 4 jours entre Fès, Sefrou et Vichy Thermal pour ralentir, respirer et retrouver calme intérieur, clarté mentale et équilibre émotionnel.",
    locale: "fr_FR",
    images: [
      {
        url: HERO_IMAGE,
        width: 1200,
        height: 630,
        alt: "Voyage Holistique — retraite holistique premium au Maroc"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Voyage Holistique | Retraite bien-être premium au Maroc",
    description:
      "Une retraite holistique privée au Maroc dédiée au bien-être, à la santé holistique, à la reconnexion corps-esprit et à la transformation intérieure.",
    images: [HERO_IMAGE]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  }
};

const GA4_ID = "G-RG386XNFN1";
const META_PIXEL_ID = "936528165885461";
const CLARITY_ID = "wqpjpmjb2g";

/* ─── JSON-LD structured data ─────────────────────────────── */
/** Semantic keyword bag — kept centralised so it stays consistent across the
 *  Event, Service and WebSite schemas and the <meta name="keywords"> tag.
 *  These terms are surfaced to crawlers via JSON-LD only — never rendered
 *  in the visible UI (no on-page keyword chips, no hidden divs). */
const SEMANTIC_KEYWORDS = [
  "Voyage Holistique",
  "retraite holistique Maroc",
  "wellness retreat Morocco",
  "luxury wellness retreat",
  "retraite bien-être premium",
  "santé holistique",
  "Holistic Health Academy",
  "Docteur Laila Qottaya",
  "Vichy Thermal",
  "Fès",
  "Sefrou",
  "hijama sèche",
  "yoga",
  "méditation",
  "respiration consciente",
  "détox naturelle",
  "thermalisme",
  "transformation personnelle",
  "reconnexion corps esprit",
  "équilibre émotionnel",
  "calme intérieur",
  "clarté mentale",
  "rituels de bien-être",
  "apaisement du système nerveux",
  "retraite premium au Maroc"
];

const jsonLdOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Holistic Health Academy",
  url: "https://www.holistichealth.academy/",
  logo: `${SITE_URL}/images/logo.png`,
  sameAs: [
    "https://www.holistichealth.academy/",
    "https://www.instagram.com/laila_qottaya/"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+31-6-25-37-56-73",
    contactType: "customer service",
    areaServed: "MA",
    availableLanguage: ["French"]
  }
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Voyage Holistique",
  alternateName: "Voyage Holistique — Retraite holistique premium au Maroc",
  url: `${SITE_URL}/`,
  inLanguage: "fr-FR",
  description:
    "Retraite holistique premium au Maroc — 4 jours privés entre Fès, Sefrou et Vichy Thermal pour la santé holistique, la reconnexion corps-esprit et la transformation intérieure.",
  keywords: SEMANTIC_KEYWORDS.join(", "),
  publisher: {
    "@type": "Organization",
    name: "Holistic Health Academy",
    url: "https://www.holistichealth.academy/"
  }
};


const jsonLdEvent = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: "Voyage Holistique — Retraite holistique premium au Maroc",
  description:
    "Retraite holistique privée de 4 jours au Maroc, entre Fès, Sefrou et Vichy Thermal. Bien-être, yoga, hijama sèche, thermalisme, nutrition, méditation et accompagnement médical par Docteur Laila Qottaya.",
  keywords: SEMANTIC_KEYWORDS.join(", "),
  startDate: "2026-06-12T10:00:00+01:00",
  endDate: "2026-06-15T14:00:00+01:00",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: "Fès — Sefrou — Vichy Thermal",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Fès",
      addressRegion: "Fès-Meknès",
      addressCountry: "MA"
    }
  },
  organizer: {
    "@type": "Organization",
    name: "Holistic Health Academy",
    url: "https://www.holistichealth.academy/"
  },
  image: [`${SITE_URL}${HERO_IMAGE}`],
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}/`,
    price: "7960",
    priceCurrency: "MAD",
    availability: "https://schema.org/LimitedAvailability",
    validFrom: "2025-11-01T00:00:00+01:00"
  },
  inLanguage: "fr-FR",
  isAccessibleForFree: false,
  maximumAttendeeCapacity: 20
};

const jsonLdService = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Retraite holistique premium",
  name: "Voyage Holistique — Retraite holistique premium au Maroc",
  description:
    "Service de retraite holistique privée de 4 jours entre Fès, Sefrou et Vichy Thermal. Yoga, méditation, respiration consciente, hijama sèche, thermalisme et accompagnement médical personnalisé.",
  keywords: SEMANTIC_KEYWORDS.join(", "),
  provider: {
    "@type": "Organization",
    name: "Holistic Health Academy",
    url: "https://www.holistichealth.academy/"
  },
  areaServed: {
    "@type": "Country",
    name: "Morocco"
  },
  audience: {
    "@type": "PeopleAudience",
    audienceType: "Adultes recherchant un bien-être holistique premium"
  },
  offers: {
    "@type": "Offer",
    price: "7960",
    priceCurrency: "MAD",
    url: `${SITE_URL}/`,
    availability: "https://schema.org/LimitedAvailability"
  }
};

function JsonLdScript({ id, data }: { id: string; data: object }) {
  return (
    <script
      type="application/ld+json"
      id={id}
      // JSON.stringify is XSS-safe inside <script type="application/ld+json">
      // because the content is treated as data, not executable JS.
      // Escape `<` to be defensive against early parser termination.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c")
      }}
    />
  );
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* GA4 Base Script */}
        <Script
          id="ga4"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA4_ID}');
            `
          }}
        />
        <Script
          id="ga4-script"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
          strategy="afterInteractive"
        />
        
        {/* Meta Pixel Base Script */}
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${META_PIXEL_ID}');
              fbq('track', 'PageView');
            `
          }}
        />
        
        {/* Microsoft Clarity Script */}
        <Script
          id="ms-clarity-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${CLARITY_ID}");
            `
          }}
        />

        {/* ─── JSON-LD structured data (SEO) ─── */}
        <JsonLdScript id="jsonld-organization" data={jsonLdOrganization} />
        <JsonLdScript id="jsonld-website" data={jsonLdWebSite} />
        <JsonLdScript id="jsonld-event" data={jsonLdEvent} />
        <JsonLdScript id="jsonld-service" data={jsonLdService} />
      </head>
      <body className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
