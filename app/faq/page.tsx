import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "FAQs" };

export default function FaqPage() {
  return (
    <PageShell className="faqPage">
      <section className="faqList" aria-label="Frequently asked questions">
        {site.faqs.map(({ question, answer }) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
    </PageShell>
  );
}
