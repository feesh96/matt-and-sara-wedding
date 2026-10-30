"use client";

import { Fragment, useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { SectionDivider } from "@/components/section-divider";
import { StoryScene, useReducedMotion } from "@/components/story-scene";
import { storyChapters, type StoryChapter, type StoryLayout, type StoryMotion } from "@/lib/story";

function StoryParagraph({ chapter }: { chapter: StoryChapter }) {
  const remaining = chapter.text.slice(chapter.opening.length);
  const [before, after] = chapter.emphasis ? remaining.split(chapter.emphasis) : [remaining];
  return (
    <p><span className="storyOpening">{chapter.opening}</span>{before}{chapter.emphasis && <><em>{chapter.emphasis}</em>{after}</>}</p>
  );
}

function ChapterCopy({ chapter }: { chapter: StoryChapter }) {
  return (
    <div className="storyCopy">
      <div className="storyParagraph"><StoryParagraph chapter={chapter} /></div>
    </div>
  );
}

function Arrow({ back = false }: { back?: boolean }) {
  return <svg viewBox="0 0 32 16" fill="none" aria-hidden="true" style={back ? { transform: "rotate(180deg)" } : undefined}><path d="M2 8h27m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function WeddingRings() {
  return (
    <span className="storyCoverRings" aria-hidden="true">
      <svg viewBox="0 0 128 84" fill="none">
        <path d="M54 28a25 25 0 1 0 20 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <path d="M55 33a20 20 0 1 0 18 0" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        <path d="m49 16 8-9h14l8 9-15 16Z" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M49 16h30M57 7l-2 9 9 16 9-16-2-9M55 16l9-9 9 9" stroke="currentColor" strokeWidth=".8" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function StoryBook({ motion }: { motion: StoryMotion }) {
  const [cover, setCover] = useState<"closed" | "preparing" | "opening" | "expanding" | "open" | "collapsing" | "closing">("closed");
  const bookRef = useRef<HTMLDivElement>(null);
  const coverButtonRef = useRef<HTMLButtonElement>(null);
  const [bookHeight, setBookHeight] = useState(600);
  const [active, setActive] = useState(0);
  const [turn, setTurn] = useState<{ from: number; to: number; direction: "forward" | "backward"; phase: "loading" | "turning" } | null>(null);
  const [mounted, setMounted] = useState(() => new Set([0]));
  const [ready, setReady] = useState<Set<number>>(() => new Set());
  const touch = useRef<{ x: number; y: number } | null>(null);
  const suppressClick = useRef(false);
  const markReady = useCallback((index: number) => setReady((current) => current.has(index) ? current : new Set([...current, index])), []);
  const turningRef = useRef(false);
  const [visited, setVisited] = useState(() => new Set<number>());
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!bookRef.current) return;
    const observer = new ResizeObserver(([entry]) => setBookHeight(entry.borderBoxSize[0]?.blockSize ?? entry.contentRect.height));
    observer.observe(bookRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (cover !== "preparing" || !ready.has(0)) return;
    // Start after the decoded illustration has reached the next paint.
    const frame = requestAnimationFrame(() => {
      setCover(reduced ? "open" : "opening");
      if (reduced) turningRef.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [cover, ready, reduced]);

  useEffect(() => {
    if (!["opening", "expanding", "collapsing", "closing"].includes(cover)) return;
    const timer = window.setTimeout(() => {
      if (cover === "opening" && !reduced && window.matchMedia("(max-width: 899px)").matches) {
        setCover("expanding");
      } else if (cover === "collapsing") {
        setCover("closing");
      } else {
        turningRef.current = false;
        if (cover === "opening" || cover === "expanding") setCover("open");
        else {
          setActive(0);
          setCover("closed");
        }
      }
    }, reduced ? 0 : cover === "expanding" || cover === "collapsing" ? 450 : 1050);
    return () => window.clearTimeout(timer);
  }, [cover, reduced]);

  useEffect(() => {
    if (cover === "open") bookRef.current?.focus({ preventScroll: true });
    if (cover === "closed" && visited.size > 0) coverButtonRef.current?.focus({ preventScroll: true });
  }, [cover, visited]);

  const openBook = () => {
    if (cover !== "closed" || turningRef.current) return;
    turningRef.current = true;
    setCover("preparing");
  };

  useEffect(() => {
    if (!turn || turn.phase !== "loading" || !ready.has(turn.to)) return;
    const frame = requestAnimationFrame(() => {
      if (reduced) {
        setVisited(current => new Set([...current, turn.from]));
        setActive(turn.to);
        setTurn(null);
        turningRef.current = false;
      } else setTurn({ ...turn, phase: "turning" });
    });
    return () => cancelAnimationFrame(frame);
  }, [turn, ready, reduced]);

  useEffect(() => {
    if (!turn || turn.phase !== "turning") return;
    const timer = window.setTimeout(() => {
      setVisited(current => new Set([...current, turn.from]));
      setActive(turn.to);
      turningRef.current = false;
      setTurn(null);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [turn]);

  const goTo = useCallback((next: number) => {
    if (cover !== "open" || turningRef.current || next < -1 || next > storyChapters.length || next === active) return;
    turningRef.current = true;
    if (next === -1 || next === storyChapters.length) {
      setVisited(current => new Set([...current, active]));
      setCover(!reduced && window.matchMedia("(max-width: 899px)").matches ? "collapsing" : "closing");
      return;
    }
    setMounted((current) => new Set([...current, next]));
    setTurn({ from: active, to: next, direction: next > active ? "forward" : "backward", phase: "loading" });
  }, [active, cover, reduced]);

  // Warm only the next spread; the other illustrations do not delay the first page.
  useEffect(() => {
    const next = storyChapters[active + 1];
    if (!next) return;
    const timer = window.setTimeout(() => {
      const image = new window.Image();
      image.src = `/images/story/${next.id}-storybook.webp`;
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [active]);


  return (
    <section
      className="storyBookExperience"
      aria-label="Our story, an illustrated book"
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === "ArrowRight") { event.preventDefault(); goTo(active + 1); }
        if (event.key === "ArrowLeft") { event.preventDefault(); goTo(active - 1); }
      }}
    >
      <div className="storyBookStage" data-cover={cover} style={{ "--story-open-height": `${bookHeight}px` } as CSSProperties}>
      <div ref={bookRef} className="storyBook" data-turning={turn?.phase === "turning"} data-loading={turn?.phase === "loading"} data-direction={turn?.direction} role="group" tabIndex={cover === "open" ? 0 : -1} aria-hidden={cover !== "open"} inert={cover !== "open"} aria-busy={Boolean(turn) || cover !== "open"} aria-label="Storybook. Tap either side or use the arrow keys to turn pages. On touchscreens, swipe left or right."
        onTouchStart={(event) => { const point = event.touches[0]; touch.current = { x: point.clientX, y: point.clientY }; suppressClick.current = false; }}
        onTouchEnd={(event) => {
          if (!touch.current) return;
          const point = event.changedTouches[0];
          const dx = point.clientX - touch.current.x;
          const dy = point.clientY - touch.current.y;
          touch.current = null;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            suppressClick.current = true;
            goTo(active + (dx < 0 ? 1 : -1));
          } else if (Math.abs(dy) > 15) suppressClick.current = true;
        }}
        onTouchCancel={() => { touch.current = null; suppressClick.current = true; }}
      >
        {/* All paragraphs size the same sheet without loading the later illustrations. */}
        <div className="storyBookSpread storyBookSizer" aria-hidden="true" inert>
          <div className="storyBookIllustration"><div className="storyFigure"><div className="storyScene" /></div></div>
          <div className="storyBookText">
            <div className="storyCopySizer">
              {storyChapters.map((item) => <ChapterCopy key={item.id} chapter={item} />)}
            </div>
          </div>
        </div>
        {storyChapters.map((item, index) => mounted.has(index) && (
          <div key={item.id} className={`storyBookSpread storyRenderedSpread${turn?.phase === "turning" && index === turn.from ? " storyOutgoing" : ""}`}
            data-active-chapter={active === index ? item.id : undefined}
            data-visible={active === index || (turn?.phase === "turning" && turn.to === index)}
            data-incoming={turn?.to === index}
            aria-hidden={active !== index} inert={active !== index}>
            <div className="storyBookIllustration">
              <StoryScene chapter={item} motion={motion} priority still={visited.has(index)} paused={cover !== "open" || active !== index || Boolean(turn)} onReady={() => markReady(index)} />
            </div>
            <div className="storyBookText"><ChapterCopy chapter={item} /></div>
          </div>
        ))}
        <button className="storyPageButton storyPagePrevious" type="button" aria-label={active === 0 ? "Close book" : "Previous page"} data-pressed={turn?.direction === "backward"} onClick={() => { if (!suppressClick.current) goTo(active - 1); suppressClick.current = false; }} disabled={cover !== "open" || Boolean(turn)}>
          <span className="storyArrow"><Arrow back /></span>
        </button>
        <button className="storyPageButton storyPageNext" type="button" aria-label={active === storyChapters.length - 1 ? "Close book" : "Next page"} data-pressed={turn?.direction === "forward"} onClick={() => { if (!suppressClick.current) goTo(active + 1); suppressClick.current = false; }} disabled={cover !== "open" || Boolean(turn)}>
          <span className="storyArrow"><Arrow /></span>
        </button>
        <span className="storyScreenReaderOnly" role="status" aria-live="polite">Page {active + 1} of {storyChapters.length}</span>
      </div>
      <div className="storyCover" aria-hidden={cover === "open"}>
        <button ref={coverButtonRef} className="storyCoverFront" type="button" aria-label="Open Matt & Sara’s storybook" disabled={cover !== "closed"} onClick={openBook}>
          <Image className="storyCoverTexture" src="/images/story/cover-simple-binding.png" alt="" width={1122} height={1402} loading="eager" draggable={false} />
          <span className="storyCoverTitle">Matt &amp; Sara</span>
          <WeddingRings />
          <span className="storyCoverCue">Click to open <Arrow /></span>
        </button>
        <div className="storyCoverInside" aria-hidden="true">
          <div className="storyFigure"><div className="storyScene">
            <Image className="storyBackground" src={`/images/story/${storyChapters[active].id}-storybook.webp`} alt="" width={1254} height={1254} loading="eager" draggable={false} />
          </div></div>
        </div>
      </div>
      </div>
      <span className="storyScreenReaderOnly" role="status" aria-live="polite">{cover === "closed" ? "Book closed" : cover === "open" ? "Book open" : (cover === "closing" || cover === "collapsing") ? "Closing book" : "Opening book"}</span>
    </section>
  );
}

function ScrollingStory({ motion }: { motion: StoryMotion }) {
  return (
    <div className="storyScroll">
      {storyChapters.map((chapter, index) => (
        <Fragment key={chapter.id}>
          {index > 0 && <SectionDivider />}
          <section className="storyScrollChapter" aria-label={chapter.title} id={chapter.id}>
            <StoryScene key={`${chapter.id}-${motion}`} chapter={chapter} motion={motion} priority={index === 0} />
            <ChapterCopy chapter={chapter} />
          </section>
        </Fragment>
      ))}
    </div>
  );
}

export function StoryExperience({ layout }: { layout: StoryLayout }) {
  const [motion, setMotion] = useState<StoryMotion>("gentle");

  useEffect(() => {
    const readMotion = () => setMotion(new URLSearchParams(window.location.search).get("motion") === "characters" ? "characters" : "gentle");
    readMotion();
    window.addEventListener("popstate", readMotion);
    return () => window.removeEventListener("popstate", readMotion);
  }, []);

  return (
    <div className="storyExperience" data-layout={layout} data-motion={motion}>
      {layout === "book" ? <StoryBook motion={motion} /> : <ScrollingStory motion={motion} />}
    </div>
  );
}
