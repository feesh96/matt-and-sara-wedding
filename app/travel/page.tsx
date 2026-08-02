import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Travel" };

export default function TravelPage() {
  return (
    <PageShell
      eyebrow="Princeton, New Jersey"
      title="Travel"
      intro="We are keeping the save-the-date simple. More practical travel information will arrive with the invitation."
    >
      <section className="proseSection">
        <h2>The destination</h2>
        <p>
          Our ceremony and celebration will take place at {site.wedding.venue} in
          Princeton. Please check back closer to the wedding for the details you will
          need to plan your weekend.
        </p>
      </section>
    </PageShell>
  );
}
