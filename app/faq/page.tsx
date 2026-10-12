import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PageIntro } from "@/components/page-intro";
import { FaqItem } from "@/components/faq-item";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "FAQs" };

export default function FaqPage() {
  return (
    <PageShell className="faqPage">
      <PageIntro title="Frequently Asked Questions" titleId="faq-title" />
      <section className="faqList" aria-label="Frequently asked questions">
        {site.faqs.map(({ question, answer }) => (
          <FaqItem key={question} question={question} answer={answer} />
        ))}
      </section>
    </PageShell>
  );
}
