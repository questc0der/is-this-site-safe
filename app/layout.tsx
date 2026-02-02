import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL("https://is-this-site-safe.example.com"),
  title: {
    default: "Is This Website Safe? | Quick Trust & Scam Signals",
    template: "%s | Is This Website Safe",
  },
  description:
    "Check if a website is safe or a scam with instant HTTPS, age, keyword, and popularity signals. Clear verdicts and safety tips.",
  openGraph: {
    title: "Is This Website Safe?",
    description:
      "Instantly review trust signals: HTTPS, domain age, scam keywords, and popularity. Get a Safe/Caution/Risky verdict with clear steps.",
    url: "https://is-this-site-safe.example.com",
    siteName: "Is This Website Safe",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is This Website Safe?",
    description: "Check trust signals, see a verdict, and stay scam-free.",
    creator: "@isthissitesafe",
  },
};

const monetagScript = `
  // Monetag base script placeholder. Replace DATA_ZONE_ID with your Monetag zone ID.
  (function(m,o,n,e,t,a,g){
    m[t]=m[t]||function(){(m[t].q=m[t].q||[]).push(arguments)};
    a=o.createElement(n);g=o.getElementsByTagName(n)[0];a.async=1;a.src=e;g.parentNode.insertBefore(a,g);
  })(window,document,'script','https://example.monetag.com/js/monetag.js','monetag');
  monetag('config',{zoneId:'DATA_ZONE_ID'});
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        {/* Monetag loader (async, non-blocking). Replace DATA_ZONE_ID with live ID. */}
        <script
          id="monetag-loader"
          defer
          dangerouslySetInnerHTML={{ __html: monetagScript }}
        />
        {/* Monetag verification tag */}
        <meta name="monetag" content="3c1699ebada5c208ac927b4b9a4d834f" />
      </head>
      <body className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <header className="flex flex-col gap-4 pb-10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
                Is This Website Safe?
              </p>
              <h1 className="text-3xl font-semibold text-slate-900">
                Instant trust signals for any domain
              </h1>
            </div>
            <nav className="flex flex-wrap gap-3 text-sm font-medium text-slate-700">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/privacy">Privacy</a>
              <a href="/contact">Contact</a>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="mt-12 border-t border-slate-200 pt-6 text-sm text-slate-600">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>Built for transparency. Use results responsibly.</p>
              <div className="flex items-center gap-4">
                <a href="/privacy">Privacy</a>
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
              </div>
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-slate-200 bg-white/60 p-4 text-center text-xs text-slate-500">
              Monetag footer banner placeholder. Insert{" "}
              <span className="font-semibold">native banner</span> code here.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
