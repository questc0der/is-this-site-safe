import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach the Is This Website Safe? team for support, feedback, or partnership.",
};

export default function ContactPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-slate-900">Contact</h2>
      <p className="text-sm text-slate-700">
        Email: support@isthissitesafe.example.com
      </p>
      <p className="text-sm text-slate-700">
        For partnerships and monetization questions, mention Monetag in the
        subject so we can prioritize your request.
      </p>
      <div className="rounded-lg border border-dashed border-slate-200 bg-white/70 p-4 text-xs text-slate-600">
        Monetag contact page banner placeholder.
      </div>
    </div>
  );
}
