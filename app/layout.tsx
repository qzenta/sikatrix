import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/ui/CookieBanner";
import TaxCalcBanner from "@/components/ui/TaxCalcBanner";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE } from "@/lib/site";
import { buildLocalBusinessSchema } from "@/lib/metadata";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} | Accountants in Alberton, Gauteng`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  metadataBase: new URL(SITE.url),
  keywords: [
    "accountants in Alberton",
    "SAIPA accountant Gauteng",
    "SARS tax practitioner",
    "bookkeeping South Africa",
    "payroll services Johannesburg",
    "cloud accounting South Africa",
    "SME accountant Alberton",
  ],
  other: {
    "geo.region": "ZA-GP",
    "geo.placename": "Alberton, Gauteng, South Africa",
    "geo.position": "-26.2844;28.1218",
    ICBM: "-26.2844, 28.1218",
  },
  openGraph: {
    siteName: SITE.name,
    locale: "en_ZA",
    type: "website",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = buildLocalBusinessSchema();

  return (
    <html lang="en-ZA">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {/* Microsoft Clarity */}
        <script
          id="clarity-script"
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","x5u2bwm452");`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
        <TaxCalcBanner />
        {process.env.NEXT_PUBLIC_GA_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
        )}
        <Analytics />
        <SpeedInsights />

        {/* Contact float */}
        <a
          href="/contact"
          className="fixed bottom-6 right-20 z-40 w-12 h-12 rounded-full bg-[#172846] flex items-center justify-center shadow-lg hover:bg-[#1e3461] transition-colors"
          aria-label="Contact us"
          title="Contact us"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </a>

        {/* WhatsApp float */}
        <a
          href={`https://wa.me/${SITE.whatsapp}?text=Hi%2C%20I'd%20like%20to%20book%20a%20consultation`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 32 32" className="w-6 h-6 fill-white">
            <path d="M16 3C9.373 3 4 8.373 4 15c0 2.385.832 4.584 2.205 6.348L4.667 27 10.2 25.5A12.95 12.95 0 0016 27c6.627 0 12-5.373 12-12S22.627 3 16 3zm6.09 16.41c-.26.73-1.52 1.38-2.08 1.44-.56.07-1.08.28-3.63-.76-3.04-1.24-5-4.34-5.15-4.55-.15-.21-1.23-1.63-1.23-3.11 0-1.48.78-2.21 1.05-2.51.27-.3.59-.37.79-.37.2 0 .39 0 .56.01.18.01.43-.07.67.51.26.61.87 2.11.95 2.26.08.15.13.33.03.53-.1.2-.15.32-.29.5-.14.17-.3.38-.43.51-.14.14-.29.29-.12.57.17.28.74 1.22 1.59 1.97 1.09.97 2.01 1.27 2.29 1.41.28.14.44.12.6-.07.17-.19.7-.82.89-1.1.19-.28.38-.23.64-.14.26.09 1.65.78 1.93.92.28.14.47.21.54.33.07.12.07.7-.19 1.43z" />
          </svg>
        </a>
      </body>
    </html>
  );
}
