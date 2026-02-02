import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Is This Website Safe?",
  description:
    "Learn how we simulate safety checks and how to use the trust helper responsibly.",
};

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-slate-900">About</h2>
      <p className="text-sm text-slate-700">
        Is This Website Safe? is a lightweight trust helper. We simulate checks
        such as HTTPS presence, domain age ranges, scam keywords, and popularity
        signals to surface a quick Safe / Caution / Risky verdict. Results are
        informational and not a guarantee.
      </p>
      <p className="text-sm text-slate-700">
        We prioritize speed, clarity, and monetization that keeps the tool free.
        Monetag ads and pop-unders may appear when you click “Check Safety”.
      </p>
      <div className="rounded-lg border border-dashed border-slate-200 bg-white/70 p-4 text-xs text-slate-600">
        Monetag mid-article banner placeholder. Insert native banner snippet
        here.
      </div>
      <p className="text-sm text-slate-700">
        Always pair these signals with browser warnings, antivirus tools, and
        your own judgment. If you see something suspicious, avoid entering
        personal data and report it to local cyber authorities.
      </p>
    </div>
  );
}
