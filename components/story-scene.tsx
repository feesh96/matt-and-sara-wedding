"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { StoryChapter, StoryMotion } from "@/lib/story";

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function Atmosphere({ kind }: { kind: StoryChapter["atmosphere"] }) {
  if (kind === "music" || kind === "leaves") return null;
  return (
    <svg className={`storyAtmosphere storyAtmosphere-${kind}`} viewBox="0 0 100 100" aria-hidden="true">
      <ellipse className="storyCandleGlow storyAnimated" cx="51" cy={kind === "wine" ? "56" : "51"} rx="6" ry="9" fill="#f1c978" opacity=".13" />
      <ellipse className="storyWindowGlow storyAnimated" cx="20" cy="30" rx="13" ry="17" fill="#f5d491" opacity=".08" />
    </svg>
  );
}

export function StoryScene({
  chapter,
  motion,
  priority = false,
  still = false,
  paused = false,
  onReady,
}: {
  chapter: StoryChapter;
  motion: StoryMotion;
  priority?: boolean;
  still?: boolean;
  paused?: boolean;
  onReady?: () => void;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [backgroundReady, setBackgroundReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [finished, setFinished] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (still || !sceneRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(sceneRef.current);
    const updateVisibility = () => setTabVisible(document.visibilityState === "visible");
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, [still]);

  const ready = backgroundReady && !failed;
  useEffect(() => { if (ready || failed) onReady?.(); }, [ready, failed, onReady]);
  const playing = !paused && ready && inView && tabVisible && !reduced && !still && !finished;
  const state = still || reduced ? "still" : finished ? "finished" : playing ? "playing" : "paused";
  const imageRoot = `/images/story/${chapter.id}`;

  return (
    <figure className="storyFigure">
      <div
        ref={sceneRef}
        className="storyScene"
        data-motion={motion}
        data-state={state}
        data-chapter={chapter.id}
        role="img"
        aria-label={failed ? `${chapter.description} Illustration unavailable.` : chapter.description}
      >
        {failed ? <p className="storyImageFallback">Illustration to accompany<br />{chapter.title}</p> : (
          <div className="storyArtwork" key={motion}>
            <Image
              className="storyBackground"
              src={`${imageRoot}-storybook.webp`}
              alt=""
              width={1024}
              height={1024}
              loading={priority ? "eager" : "lazy"}
              onLoad={() => setBackgroundReady(true)}
              onError={() => setFailed(true)}
              draggable={false}
            />
            <Atmosphere kind={chapter.atmosphere} />
            {!still && !reduced && (
              <span
                className="storySceneClock storyAnimated"
                aria-hidden="true"
                onAnimationEnd={(event) => {
                  if (event.animationName === "storyClock") setFinished(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    </figure>
  );
}
