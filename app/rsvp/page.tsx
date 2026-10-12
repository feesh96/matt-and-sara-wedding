import type { Metadata } from "next";
import Image from "next/image";
import { PageShell } from "@/components/page-shell";
import { PageIntro } from "@/components/page-intro";
import { SectionDivider } from "@/components/section-divider";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "RSVP" };

export default function RsvpPage() {
  return (
    <PageShell className="rsvpPage">
      <PageIntro className="rsvpNotice" title="Coming Soon" titleId="rsvp-title">
        <p>
          Formal invitations with RSVP details will be sent closer to the wedding. Please check
          back here when your invitation arrives to RSVP online. We look forward to celebrating
          with you!
        </p>
      </PageIntro>
      <SectionDivider />
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
