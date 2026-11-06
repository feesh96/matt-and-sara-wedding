"use client";

import Image from "next/image";
import { useId, type CSSProperties } from "react";
import type { WeddingPartyMember } from "@/lib/wedding-party";

export function WeddingPartyCard({ member, open, onToggle }: {
  member: WeddingPartyMember;
  open: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  const available = Boolean(member.image || member.bio);
  const initials = member.name.split(" ").map(part => part[0]).join("");
  const label = <span className="weddingPartyLabel"><span className="weddingPartyName">{member.name}</span><span className="weddingPartyRole">{member.role}</span></span>;

  return (
    <article className="weddingPartyMember" data-open={open}>
      {member.image ? (
        <div className="weddingPartyPortrait" style={{
          "--portrait-position": member.position || "center",
          "--thumbnail-position": member.thumbnailPosition || member.position || "center",
        } as CSSProperties}>
          <Image src={member.image} alt={member.name} fill sizes="(max-width: 760px) 80vw, 400px" />
        </div>
      ) : <span className="weddingPartyInitials" aria-hidden="true">{initials}</span>}
      <h3>
        {available ? (
          <button className="weddingPartyTrigger" aria-expanded={open} aria-controls={id} onClick={onToggle}>
            {label}<span className="weddingPartyToggle" aria-hidden="true">{open ? "−" : "+"}</span>
          </button>
        ) : <span className="weddingPartyTrigger">{label}</span>}
      </h3>
      {available && (
        <div className="weddingPartyPanel" id={id} inert={!open} aria-hidden={!open}>
          <div className="weddingPartyPanelInner">
            {member.image && <div className="weddingPartyPhotoSpace" aria-hidden="true" />}
            {member.bio && <p className="weddingPartyBio">{member.bio}</p>}
          </div>
        </div>
      )}
    </article>
  );
}
