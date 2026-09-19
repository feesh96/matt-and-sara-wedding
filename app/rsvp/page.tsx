import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { site } from "@/lib/site";

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
      <div className="rsvpPhotoDivider" aria-hidden="true">
        <span />
      </div>
      <figure className="rsvpPhoto">
        <Image
          src={site.media.rsvpKyoto}
          alt="Sara and Matt beside a temple pond in Kyoto"
          fill
          sizes="100vw"
        />
      </figure>
    </PageShell>
  );
}
