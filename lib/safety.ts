export type Verdict = "safe" | "caution" | "risky";

export type SafetyResult = {
  domain: string;
  hasHttps: boolean;
  domainAgeDays: number | null;
  scamScore: number;
  popularityScore: number;
  verdict: Verdict;
  reasons: string[];
  usedWhois: boolean;
  usedHttpsProbe: boolean;
  usedPopularityFallback: boolean;
};

const SCAM_KEYWORDS = [
  "giveaway",
  "free-money",
  "crypto-doubler",
  "login-now",
  "urgent",
  "claim-prize",
  "verify-account",
];

// Lightweight allowlist to keep well-known brands from looking risky in the simulator.
const TRUSTED_DOMAINS: Record<
  string,
  { ageDays: number; popularity: number; https: boolean }
> = {
  "youtube.com": { ageDays: 5000, popularity: 99, https: true },
  "www.youtube.com": { ageDays: 5000, popularity: 99, https: true },
  "google.com": { ageDays: 5000, popularity: 99, https: true },
  "www.google.com": { ageDays: 5000, popularity: 99, https: true },
  "facebook.com": { ageDays: 5000, popularity: 97, https: true },
  "www.facebook.com": { ageDays: 5000, popularity: 97, https: true },
  "amazon.com": { ageDays: 5000, popularity: 97, https: true },
  "www.amazon.com": { ageDays: 5000, popularity: 97, https: true },
  "wikipedia.org": { ageDays: 5000, popularity: 96, https: true },
  "www.wikipedia.org": { ageDays: 5000, popularity: 96, https: true },
  "spotify.com": { ageDays: 5000, popularity: 95, https: true },
  "www.spotify.com": { ageDays: 5000, popularity: 95, https: true },
  "open.spotify.com": { ageDays: 5000, popularity: 95, https: true },
  "paypal.com": { ageDays: 5000, popularity: 95, https: true },
  "www.paypal.com": { ageDays: 5000, popularity: 95, https: true },
};

export const normalizeDomain = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "www.")
    .replace(/#.*/, "")
    .replace(/\?.*/, "")
    .split("/")[0];
};

export const isLikelyDomain = (value: string) => {
  const domain = normalizeDomain(value);
  const domainRegex = /^(?!-)([a-z0-9-]{1,63}\.)+[a-z]{2,}$/i;
  return domainRegex.test(domain);
};

const WHOIS_API_KEY = process.env.WHOISXML_API_KEY;

const msPerDay = 1000 * 60 * 60 * 24;
const msPerHour = 1000 * 60 * 60;

const fetchWithTimeout = async (url: string, ms = 3000) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
    return res;
  } finally {
    clearTimeout(t);
  }
};

type WhoisCacheEntry = { ageDays: number | null; expires: number };
const whoisCache: Map<string, WhoisCacheEntry> = new Map();

const getCachedWhois = (domain: string): number | null | undefined => {
  const entry = whoisCache.get(domain);
  if (!entry) return undefined;
  if (Date.now() > entry.expires) {
    whoisCache.delete(domain);
    return undefined;
  }
  return entry.ageDays;
};

const setCachedWhois = (domain: string, ageDays: number | null) => {
  // 24h TTL to avoid hammering the API.
  whoisCache.set(domain, { ageDays, expires: Date.now() + 24 * msPerHour });
};

const fetchWhoisAgeOnce = async (
  domain: string,
  timeoutMs: number,
): Promise<{ ageDays: number | null; ok: boolean }> => {
  const url = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${WHOIS_API_KEY}&domainName=${encodeURIComponent(domain)}&outputFormat=JSON`;
  const res = await fetchWithTimeout(url, timeoutMs);
  if (!res.ok) return { ageDays: null, ok: false };
  const data = await res.json();
  const record = data?.WhoisRecord || data?.whoisRecord;
  const created =
    record?.createdDate ||
    record?.registryData?.createdDate ||
    record?.audit?.createdDate;
  if (!created) return { ageDays: null, ok: false };
  const createdDate = new Date(created);
  if (Number.isNaN(createdDate.getTime())) return { ageDays: null, ok: false };
  const diff = Date.now() - createdDate.getTime();
  const ageDays = Math.max(0, Math.floor(diff / msPerDay));
  return { ageDays, ok: true };
};

const fetchWhoisAge = async (
  domain: string,
): Promise<{ ageDays: number | null; used: boolean }> => {
  if (!WHOIS_API_KEY) return { ageDays: null, used: false };

  const cached = getCachedWhois(domain);
  if (cached !== undefined) return { ageDays: cached, used: true };

  const attempts = [5000, 3500];
  for (const timeout of attempts) {
    try {
      const { ageDays, ok } = await fetchWhoisAgeOnce(domain, timeout);
      if (ok) {
        setCachedWhois(domain, ageDays);
        return { ageDays, used: true };
      }
    } catch {
      // retry next attempt
    }
  }

  return { ageDays: null, used: true };
};

const probeHttps = async (
  domain: string,
): Promise<{ hasHttps: boolean; used: boolean }> => {
  try {
    const res = await fetchWithTimeout(`https://${domain}`, 3000);
    return {
      hasHttps: res.ok || (res.status >= 200 && res.status < 400),
      used: true,
    };
  } catch {
    return { hasHttps: false, used: true };
  }
};

// Popularity remains a lightweight proxy unless a traffic API is added.
const popularityScore = (domain: string) => {
  if (TRUSTED_DOMAINS[domain]) return TRUSTED_DOMAINS[domain].popularity;
  const seed = domain.length % 7;
  return [12, 28, 45, 60, 72, 84, 92][(seed + 3) % 7];
};

const scoreScamKeywords = (domain: string) => {
  const lowered = domain.toLowerCase();
  const hits = SCAM_KEYWORDS.filter((kw) => lowered.includes(kw));
  return { hits, score: hits.length * 20 };
};

export const evaluateSafety = async (
  domainRaw: string,
): Promise<SafetyResult> => {
  const domain = normalizeDomain(domainRaw);

  // Trusted override for major brands to avoid false alarms if external signals fail.
  if (TRUSTED_DOMAINS[domain]) {
    const profile = TRUSTED_DOMAINS[domain];
    return {
      domain,
      hasHttps: true,
      domainAgeDays: profile.ageDays,
      popularityScore: profile.popularity,
      scamScore: 0,
      verdict: "safe",
      reasons: ["Recognized high-trust domain."],
      usedWhois: false,
      usedHttpsProbe: false,
      usedPopularityFallback: false,
    };
  }

  const [{ ageDays, used: usedWhois }, httpsProbe] = await Promise.all([
    fetchWhoisAge(domain),
    probeHttps(domain),
  ]);

  const popularity = popularityScore(domain);
  const { hits, score: keywordScore } = scoreScamKeywords(domain);

  const hasHttps = httpsProbe.hasHttps;
  const agePenalty =
    ageDays == null
      ? 10
      : ageDays < 30
        ? 30
        : ageDays < 180
          ? 15
          : ageDays < 365
            ? 8
            : 0;
  const httpsPenalty = hasHttps ? 0 : 25;
  const popularityAdjust = popularity > 70 ? -10 : popularity < 20 ? 10 : 0;

  const rawScore =
    5 + keywordScore + httpsPenalty + agePenalty + popularityAdjust;
  const scamScore = Math.max(0, Math.min(100, rawScore));

  let verdict: Verdict = "safe";
  if (scamScore >= 60) verdict = "risky";
  else if (scamScore >= 35) verdict = "caution";

  const reasons: string[] = [];
  if (!hasHttps) reasons.push("HTTPS did not confirm in a live probe.");
  if (ageDays == null)
    reasons.push("Domain age unavailable; WHOIS lookup failed or timed out.");
  else if (ageDays < 30) reasons.push("Domain is brand new (live WHOIS).");
  else if (ageDays < 180)
    reasons.push("Domain is relatively new (live WHOIS).");
  if (hits.length)
    reasons.push(`Suspicious keywords detected: ${hits.join(", ")}.`);
  if (popularity < 20)
    reasons.push(
      "Low popularity (fallback heuristic; add a traffic API for accuracy).",
    );

  return {
    domain,
    hasHttps,
    domainAgeDays: ageDays,
    scamScore,
    popularityScore: popularity,
    verdict,
    reasons: reasons.length
      ? reasons
      : ["No major red flags detected in current live checks."],
    usedWhois,
    usedHttpsProbe: httpsProbe.used,
    usedPopularityFallback: true,
  };
};

export const formatVerdictLabel = (verdict: Verdict) => {
  if (verdict === "safe") return "Likely Safe";
  if (verdict === "caution") return "Proceed With Caution";
  return "High Risk";
};

export const verdictColor = (verdict: Verdict) => {
  if (verdict === "safe")
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (verdict === "caution")
    return "bg-amber-50 text-amber-700 border-amber-200";
  return "bg-rose-50 text-rose-700 border-rose-200";
};

export const recommendedActions = (verdict: Verdict) => {
  if (verdict === "safe")
    return [
      "Still verify URLs manually before payments.",
      "Use a password manager and 2FA.",
    ];
  if (verdict === "caution")
    return [
      "Avoid entering payment details until you confirm ownership and HTTPS.",
      "Look for real customer reviews on third-party sites.",
      "Check refund/returns policy and contact options.",
    ];
  return [
    "Do not enter personal or payment information.",
    "Close unsolicited pop-ups and exit the site.",
    "Report suspected scams to local cyber authorities.",
  ];
};
