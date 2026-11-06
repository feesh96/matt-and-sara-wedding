import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PageIntro } from "@/components/page-intro";
import { SectionDivider } from "@/components/section-divider";

import { WeddingPartyList } from "@/components/wedding-party-list";

export const metadata: Metadata = { title: "Wedding Party" };

export default function WeddingPartyPage() {
  return (
    <PageShell className="weddingPartyPage">
      <PageIntro title="Wedding Party" titleId="wedding-party-title">
        <p>The friends and family who have been there through it all.<br />We can&apos;t wait to have them by our side.</p>
      </PageIntro>
      <SectionDivider />
      <WeddingPartyList />
    </PageShell>
  );
}
