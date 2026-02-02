type QA = { question: string; answer: string };

const items: QA[] = [
  {
    question: "How do you decide if a website is safe?",
    answer:
      "We simulate checks for HTTPS, domain age ranges, suspicious keywords, and popularity signals, then assign a Safe, Caution, or Risky verdict.",
  },
  {
    question: "Is this a real-time security scanner?",
    answer:
      "No. This is an informational trust helper. Always double-check with your browser, antivirus, and official sources before entering sensitive data.",
  },
  {
    question: "Why do I see ads or pop-unders?",
    answer:
      "Ads and Monetag pop-unders fund the free checker. We keep them lightweight and avoid blocking the main experience.",
  },
  {
    question: "Should I trust new online stores?",
    answer:
      "New domains can be risky. Look for HTTPS, transparent contact details, third-party reviews, and clear refund policies before purchasing.",
  },
];

export function FAQ() {
  return (
    <section className="mt-10 space-y-4">
      <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.question}
            className="rounded-lg border border-slate-200 bg-white/70 p-4 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              {item.question}
            </h3>
            <p className="mt-2 text-sm text-slate-700">{item.answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};
