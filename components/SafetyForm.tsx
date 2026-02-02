"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { isLikelyDomain, normalizeDomain } from "@/lib/safety";

const triggerMonetagPop = () => {
  // Pop-under trigger per Monetag docs; ensure DATA_ZONE_ID is configured in layout loader.
  if (typeof window !== "undefined" && (window as any).monetag) {
    try {
      (window as any).monetag("click");
    } catch (err) {
      // ignore missing Monetag handler
    }
  }
};

export function SafetyForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = normalizeDomain(url);
    if (!domain) return;
    if (!isLikelyDomain(domain)) {
      setError("Enter a valid domain like example.com");
      return;
    }
    setError("");
    triggerMonetagPop();
    startTransition(() => {
      router.push(`/is/${encodeURIComponent(domain)}-safe`);
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur"
    >
      <label className="block text-sm font-medium text-slate-700" htmlFor="url">
        Enter a domain or URL
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          id="url"
          name="url"
          required
          autoComplete="off"
          inputMode="url"
          placeholder="example.com"
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-base shadow-inner focus:border-brand-400"
          value={url}
          onChange={(e) => {
            const next = e.target.value;
            setUrl(next);
            if (error && isLikelyDomain(normalizeDomain(next))) {
              setError("");
            }
          }}
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!url || isPending}
        >
          {isPending ? "Checking..." : "Check Safety"}
        </button>
      </div>
      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
      <p className="text-xs text-slate-500">
        Tap Check Safety to trigger a quick trust scan. Monetag pop-under may
        open as part of site monetization.
      </p>
    </form>
  );
}
