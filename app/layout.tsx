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
    "Voyage Holistique du 12 au 15 juin : une retraite premium à Fès, Vichy Thermal et Sefrou, avec riad privé, yoga, hijama sèche, transport VIP et accompagnement expert. Seulement 7 960 DH.",
  keywords: [
    "Voyage Holistique",
    "retraite wellness",
    "Vichy Thermal",
    "Fès",
    "Sefrou",
    "hijama sèche",
    "yoga",
    "retreat"
  ],
  openGraph: {
    title: "Voyage Holistique | Retraite Bien-être Premium au Maroc",
    description:
      "Du 12 au 15 juin : retraite premium à Fès, Vichy Thermal et Sefrou avec riad privé, yoga, hijama sèche, transport VIP et accompagnement expert. Seulement 7 960 DH.",
    images: ["/images/hero.png"]
  }
};

const GA4_ID = "G-RG386XNFN1";
const META_PIXEL_ID = "936528165885461";
const CLARITY_ID = "wqpjpmjb2g";

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
          id="clarity"
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
      </head>
      <body className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
