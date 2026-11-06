"use client";

import { useState } from "react";
import { members } from "@/lib/wedding-party";
import { WeddingPartyCard } from "@/components/wedding-party-card";

export function WeddingPartyList() {
  const [openMember, setOpenMember] = useState<string | null>(null);

  return (
    <>
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
                  <WeddingPartyCard key={member.name} member={member} open={openMember === member.name} onToggle={() => setOpenMember(current => current === member.name ? null : member.name)} />
                ))}
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
