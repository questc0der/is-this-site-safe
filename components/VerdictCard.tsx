import {
  formatVerdictLabel,
  recommendedActions,
  verdictColor,
} from "@/lib/safety";
import type { SafetyResult } from "@/lib/safety";

export function VerdictCard({ result }: { result: SafetyResult }) {
  const color = verdictColor(result.verdict);
  return (
    <div className={`rounded-2xl border p-6 shadow-sm ${color}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Verdict
          </p>
          <h2 className="text-2xl font-semibold">
            {formatVerdictLabel(result.verdict)}
          </h2>
          <p className="text-sm text-slate-600">
            Trust signals for {result.domain} (live where available;
            informational only)
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold uppercase text-slate-500">
            Scam score
          </p>
          <p className="text-3xl font-bold">{result.scamScore}</p>
          <p className="text-xs text-slate-600">
            0 is best • 100 is highest risk
          </p>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <InfoPill
          label="HTTPS"
          value={result.hasHttps ? "Confirmed" : "Not confirmed"}
          muted={!result.hasHttps}
          hint={result.usedHttpsProbe ? "Live probe" : "Fallback"}
        />
        <InfoPill
          label="Domain age"
          value={
            result.domainAgeDays == null
              ? "Unknown (WHOIS unavailable)"
              : `${result.domainAgeDays} days (WHOIS)`
          }
          muted={result.domainAgeDays != null && result.domainAgeDays < 180}
          hint={result.usedWhois ? "Live WHOIS" : "Fallback"}
        />
        <InfoPill
          label="Popularity"
          value={`${result.popularityScore}/100 (fallback proxy)`}
          muted={result.popularityScore < 20}
          hint={result.usedPopularityFallback ? "Heuristic" : "Live"}
        />
      </div>
      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-800">Why this verdict</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {result.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-800">
          Suggested next steps
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {recommendedActions(result.verdict).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-white/70 p-4 text-center text-xs text-slate-600">
        Monetag native banner placeholder below verdict.
      </div>
    </div>
  );
}

function InfoPill({
  label,
  value,
  muted,
  hint,
}: {
  label: string;
  value: string;
  muted?: boolean;
  hint?: string;
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm ${
        muted
          ? "border-amber-100 bg-amber-50/80 text-amber-800"
          : "border-slate-200 bg-white/70 text-slate-800"
      }`}
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="font-medium">{value}</p>
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}
