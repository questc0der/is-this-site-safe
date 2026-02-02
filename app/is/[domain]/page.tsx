import type { Metadata } from "next";
import Link from "next/link";
import { FAQ, faqSchema } from "@/components/FAQ";
import { VerdictCard } from "@/components/VerdictCard";
import { PushOptIn } from "@/components/PushOptIn";
import { evaluateSafety, isLikelyDomain, normalizeDomain } from "@/lib/safety";

const parseDomain = (slug: string) => slug.replace(/-safe$/i, "");

export async function generateMetadata({
  params,
}: {
  params: { domain: string };
}): Promise<Metadata> {
  const raw = parseDomain(params.domain);
  const domain = normalizeDomain(raw);
  const safeDomain = isLikelyDomain(domain) ? domain : "invalid-domain";
  const display = domain || "this domain";
  const title = `${display} safety check: is it safe?`;
  const description = `See if ${display} looks safe based on HTTPS, domain age, scam keywords, and popularity signals. Instant Safe/Caution/Risky verdict.`;
  return {
    title,
    description,
    alternates: { canonical: `/is/${safeDomain}-safe` },
    openGraph: {
      title,
      description,
      url: `/is/${safeDomain}-safe`,
    },
  };
}

export default async function DomainPage({
  params,
}: {
  params: { domain: string };
}) {
  const raw = parseDomain(params.domain);
  const domain = normalizeDomain(raw);
  const isValid = isLikelyDomain(domain);
  const result = isValid ? await evaluateSafety(domain) : null;

  const faqForDomain = {
    ...faqSchema,
    mainEntity: (faqSchema as any).mainEntity.map((q: any) => ({
      ...q,
      name: q.name.replace("a website", domain || "this site"),
      acceptedAnswer: { ...q.acceptedAnswer },
    })),
  };

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-600">
          Safety report
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">
          Is {domain || "this site"} safe?
        </h2>
        {!isValid ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            Please enter a valid domain like example.com. We could not evaluate
            this input.
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-700">
              Live WHOIS + HTTPS probe with fallback heuristics. Informational
              only—always double-check browser warnings and official sources.
            </p>
            {result && <VerdictCard result={result} />}
            <div className="rounded-lg border border-dashed border-slate-200 bg-white/70 p-4 text-center text-xs text-slate-600">
              Monetag banner placeholder beneath verdict. Insert native banner
              script or iframe here.
            </div>
          </>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Key insights</h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            {isValid && result ? (
              <>
                <li>
                  HTTPS check: {result.hasHttps ? "confirmed" : "not confirmed"}{" "}
                  (live probe).
                </li>
                <li>
                  Domain age:{" "}
                  {result.domainAgeDays == null
                    ? "unknown (WHOIS unavailable)"
                    : `${result.domainAgeDays} days (WHOIS)`}
                  .
                </li>
                <li>
                  Popularity: {result.popularityScore}/100 (heuristic fallback).
                </li>
                <li>
                  Overall verdict: {result.verdict.toUpperCase()} —{" "}
                  {result.reasons[0]}
                </li>
              </>
            ) : (
              <li>Enter a valid domain to see insights.</li>
            )}
          </ul>
          <div className="mt-4 text-sm text-slate-700">
            Related lookups:
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              {["google.com", "facebook.com", "random-new-shop.com"].map(
                (d) => (
                  <Link
                    key={d}
                    className="rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700"
                    href={`/is/${d}-safe`}
                  >
                    {d}
                  </Link>
                ),
              )}
            </div>
          </div>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Stay safer online
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-700">
            <li>Use browsers that block deceptive sites and enforce HTTPS.</li>
            <li>
              Verify company details, refund policy, and third-party reviews.
            </li>
            <li>Avoid payments on sites without HTTPS or clear ownership.</li>
            <li>Use virtual cards and strong, unique passwords.</li>
          </ul>
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-xs text-slate-600">
            Optional user-initiated push notifications: add a button to prompt
            notifications after explicit consent. Keep it off-page load to stay
            compliant.
          </div>
          <PushOptIn />
        </article>
      </section>

      <FAQ />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqForDomain) }}
      />
    </div>
  );
}
