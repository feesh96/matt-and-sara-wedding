"use client";

import { useId, useState, type CSSProperties, type ReactNode } from "react";

type TravelDirection = {
  mode: "plane" | "train" | "car";
  title: string;
  paragraphs: readonly string[];
};

function TravelIcon({ mode }: { mode: TravelDirection["mode"] }) {
  const icons: Record<typeof mode, ReactNode> = {
    plane: <path d="M24 4c1.2 0 2 2.5 2 5v10l16 10v3l-16-5v11l5 4v2l-7-2-7 2v-2l5-4V27L6 32v-3l16-10V9c0-2.5.8-5 2-5Z" />,
    train: (
      <>
        <rect x="14" y="8" width="20" height="28" rx="4" />
        <path d="M14 20h20m-16 16-4 7m16-7 4 7" />
        <circle cx="19" cy="29" r="1.2" />
        <circle cx="29" cy="29" r="1.2" />
      </>
    ),
    car: <path d="M8 31V23l5-11h22l5 11v8H8Zm0-8h32M11 31v5m26-5v5M12 27h4m16 0h4" />,
  };

  return (
    <svg className="travelCardIcon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[mode]}
    </svg>
  );
}

export function TravelCards({ directions }: { directions: readonly TravelDirection[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const id = useId();

  return (
    <div
      className={`travelCardViewport${activeIndex !== null ? " isExpanded" : ""}`}
      style={{ "--active-index": activeIndex ?? 0 } as CSSProperties}
    >
      <div className="travelCardTrack">
        {directions.map(({ mode, title, paragraphs }, index) => {
          const isActive = activeIndex === index;
          const isOffscreen = activeIndex !== null && !isActive;
          const titleId = `${id}-${mode}-title`;
          const bodyId = `${id}-${mode}-body`;

          return (
            <button
              type="button"
              className={`travelCard${isActive ? " isActive" : ""}`}
              key={mode}
              aria-labelledby={titleId}
              aria-describedby={isActive ? bodyId : undefined}
              aria-expanded={isActive}
              aria-controls={bodyId}
              aria-hidden={isOffscreen}
              inert={isOffscreen}
              onClick={() => setActiveIndex(isActive ? null : index)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault();
                  setActiveIndex(null);
                }
              }}
            >
              <span className="travelCardHeader">
                <TravelIcon mode={mode} />
                <span className="travelCardTitle" id={titleId}>{title}</span>
                <span className="travelCardToggle" aria-hidden="true">{isActive ? "−" : "+"}</span>
              </span>
              <span className="travelCardReveal" aria-hidden={!isActive}>
                <span className="travelCardBodyClip">
                  <span className="travelCardBody" id={bodyId}>
                    {paragraphs.map((paragraph) => (
                      <span className="travelCardParagraph" key={paragraph}>{paragraph}</span>
                    ))}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
