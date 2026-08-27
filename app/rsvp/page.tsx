import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = { title: "RSVP" };

export default function RsvpPage() {
  return (
    <PageShell className="rsvpPage">
      <section className="rsvpNotice" aria-labelledby="rsvp-title">
        <h1 id="rsvp-title" className="visuallyHidden">
          RSVP
        </h1>
        <p>
          Formal invitations with RSVP details will be sent closer to the wedding. Please check
          back here when your invitation arrives to RSVP online. We look forward to celebrating
          with you!
        </p>
      </section>
    </PageShell>
  );
}
