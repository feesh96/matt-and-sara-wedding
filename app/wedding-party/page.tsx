import type { Metadata } from "next";
import { PageShell } from "@/components/page-shell";
import { PageIntro } from "@/components/page-intro";
import { SectionDivider } from "@/components/section-divider";

export const metadata: Metadata = { title: "Wedding Party" };

const members = [
  { name: "Eric Newman", role: "Best Man" },
  { name: "Elana Sacher", role: "Maid of Honor" },
  { name: "Maya Mohindroo", role: "Maid of Honor" },
  { name: "Jeremy Kaye", role: "Groomsman" },
  { name: "Max Sacher", role: "Groomsman" },
  { name: "Myles Cobb", role: "Groomsman" },
  { name: "Conor Dewey", role: "Groomsman" },
  { name: "Marcello Balboa", role: "Groomsman" },
  { name: "Dillon Massaro", role: "Groomsman" },
  { name: "Lindsay Kaye", role: "Bridesmaid" },
  { name: "Melissa Pham", role: "Bridesmaid" },
  { name: "Karlee Parker", role: "Bridesmaid" },
  { name: "Tiffany Javid", role: "Bridesmaid" },
  { name: "Mikaela Osinaga", role: "Bridesmaid" },
];

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
            {group.members.map(member => (
              <article className="weddingPartyMember" key={member.name}>
                <h3>{member.name}</h3>
                <p className="weddingPartyRole">{member.role}</p>
              </article>
            ))}
          </div>
        </section>
      ))}
    </PageShell>
  );
}
