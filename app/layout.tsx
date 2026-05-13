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

export const metadata: Metadata = {
  metadataBase: new URL("https://voyageholistique.com"),
  title: "Voyage Holistique | Retraite Bien-être Premium au Maroc",
  description:
    "Une retraite holistique premium de 4 jours entre Fès, Moulay Yacoub, yoga, respiration, spiritualité marocaine, thermes Vichy, transport VIP et accompagnement expert.",
  keywords: [
    "Voyage Holistique",
    "retraite wellness",
    "Vichy Céleste",
    "Moulay Yacoub",
    "Fès",
    "yoga",
    "retreat"
  ],
  openGraph: {
    title: "Voyage Holistique | Retraite Bien-être Premium au Maroc",
    description: "Une retraite holistique premium de 4 jours entre Fès, Moulay Yacoub, yoga, respiration, spiritualité marocaine, thermes Vichy, transport VIP et accompagnement expert.",
    images: ["/images/hero.png"]
  }
};

const GTM_ID = "GTM-NFL7783S";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {/* Google Tag Manager — initialises dataLayer + loads gtm.js. */}
        <Script
          id="gtm-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `
          }}
        />
      </head>
      <body className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
        {/* GTM noscript fallback */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
