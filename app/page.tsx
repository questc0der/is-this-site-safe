import type { Metadata } from "next";
import Link from "next/link";
// Update the import path if FAQ.tsx is in components folder relative to app
import { FAQ, faqSchema } from "../components/FAQ";
import { SafetyForm } from "../components/SafetyForm";

export const metadata: Metadata = {
  title: "Is This Website Safe? Free Trust Checker",
  description:
    "Check any website for basic trust signals: HTTPS, domain age, scam keywords, and popularity. Get a Safe/Caution/Risky verdict fast.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            Free trust helper
            <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-brand-800">
              No login
            </span>
          </div>
          <h2 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
            Is this website safe? Check in seconds.
          </h2>
          <p className="text-lg text-slate-700">
            Paste a domain to see simulated HTTPS, domain age, keyword, and
            popularity signals. Get a clear Safe / Caution / Risky verdict plus
            next steps.
          </p>
          <div className="rounded-xl border border-dashed border-slate-200 bg-white/70 p-3 text-sm text-slate-600">
            Monetag mid-content banner placeholder. Insert native banner code
            here.
          </div>
          <div className="space-y-4">
            <SafetyForm />
            <p className="text-xs text-slate-500">
              By using this tool you agree that results are informational and
              not a security guarantee.
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            What we check (simulated)
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-700">
            <li>HTTPS presence and redirection behavior.</li>
            <li>Domain age ranges (newer sites can carry more risk).</li>
            <li>Scam-prone keywords in the domain.</li>
            <li>Popularity signals that mimic traffic trust.</li>
            <li>Transparent verdict with actionable guidance.</li>
          </ul>
          <div className="mt-6 rounded-lg bg-slate-50 p-4 text-xs text-slate-600">
            Disclaimer: Signals are simulated for speed. Always verify with
            browser warnings, official sources, and your own judgment.
          </div>
          <div className="mt-4 text-xs text-slate-600">
            Explore sample checks:{" "}
            <Link href="/is/paypal.com-safe">paypal.com</Link> •{" "}
            <Link href="/is/spotify.com-safe">spotify.com</Link> •{" "}
            <Link href="/is/randomstore.shop-safe">randomstore.shop</Link>
          </div>
        </div>
      </section>
      <FAQ />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
