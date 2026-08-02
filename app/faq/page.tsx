import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "FAQ" };

const questions = [
  {
    question: "When is the wedding?",
    answer: `${site.wedding.day}, ${site.wedding.date}.`,
  },
  {
    question: "Where will it take place?",
    answer: `${site.wedding.venue} in ${site.wedding.city}.`,
  },
  {
    question: "When can we RSVP?",
    answer: "RSVP information will be included with the formal invitation.",
  },
  {
    question: "Will more details be added here?",
    answer: "Yes. We will update this website as the celebration gets closer.",
  },
];

export default function FaqPage() {
  return (
    <PageShell
      eyebrow="Good to know"
      title="Questions"
      intro="The essentials for now. More answers will be added when formal invitations are sent."
    >
      <section className="faqList">
        {questions.map(({ question, answer }) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
    </PageShell>
  );
}
