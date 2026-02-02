import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How we handle data, ads, and cookies for the Is This Website Safe? checker.",
};

export default function PrivacyPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold text-slate-900">Privacy Policy</h2>
      <p className="text-sm text-slate-700">
        We do not store the URLs you check. Inputs are processed on the fly to
        generate simulated trust signals. Basic analytics and Monetag
        advertising scripts may set cookies or device identifiers to serve
        relevant ads and measure performance.
      </p>
      <p className="text-sm text-slate-700">
        Monetag pop-under may open when you click “Check Safety”. We keep
        scripts async and defer-loaded to maintain performance.
      </p>
      <p className="text-sm text-slate-700">
        If you enable optional push notifications, they will only be triggered
        after an explicit user action (such as clicking a “Enable alerts”
        button). You can disable notifications anytime via your browser
        settings.
      </p>
      <div className="rounded-lg border border-dashed border-slate-200 bg-white/70 p-4 text-xs text-slate-600">
        Monetag privacy page banner placeholder.
      </div>
      <p className="text-sm text-slate-700">
        For questions about privacy, contact us at
        privacy@isthissitesafe.example.com.
      </p>
    </div>
  );
}
