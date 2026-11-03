import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PageIntro } from "@/components/page-intro";
import { SectionDivider } from "@/components/section-divider";

import { members } from "@/lib/wedding-party";
import { WeddingPartyCard } from "@/components/wedding-party-card";

export const metadata: Metadata = { title: "Wedding Party" };

export default function WeddingPartyPage() {
  return (
    <PageShell className="weddingPartyPage">
      <PageIntro title="Wedding Party" titleId="wedding-party-title">
        <p>The friends and family who have been there through it all.<br />We can&apos;t wait to have them by our side.</p>
      </PageIntro>
      <SectionDivider />
      {[
        { title: "Bridesmaids", members: members.filter(member => member.role === "Maid of Honor" || member.role === "Bridesmaid") },
        { title: "Groomsmen", members: members.filter(member => member.role === "Best Man" || member.role === "Groomsman") },
      ].map(group => (
        <section className="weddingPartyGroup" key={group.title} aria-labelledby={`party-${group.title.toLowerCase()}`}>
          <h2 className="sectionTitle" id={`party-${group.title.toLowerCase()}`}>{group.title}</h2>
          <div className="weddingPartyGrid">
            {[
              group.members.slice(0, Math.ceil(group.members.length / 2)),
              group.members.slice(Math.ceil(group.members.length / 2)),
            ].map((column, index) => (
              <div className="weddingPartyColumn" key={index}>
                {column.map(member => (
                  <WeddingPartyCard key={member.name} member={member} />
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
