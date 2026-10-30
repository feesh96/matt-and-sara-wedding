"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SectionDivider } from "@/components/section-divider";
import { galleryPhotos } from "@/lib/gallery";

export function StoryGallery() {
  const [selected, setSelected] = useState<string | null>(null);
  const [transition, setTransition] = useState<{ previous: string; direction: number } | null>(null);
  const busy = useRef(false);
  const request = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const selectedIndex = galleryPhotos.findIndex(item => item.src === selected);
  const photo = galleryPhotos[selectedIndex];
  const isOpen = Boolean(photo);

  useEffect(() => {
    const element = dialog.current;
    if (!element || !isOpen) return;
    const overflow = document.body.style.overflow;
    element.showModal();
    element.focus();
    document.body.style.overflow = "hidden";
    return () => {
      request.current += 1;
      busy.current = false;
      if (timer.current) clearTimeout(timer.current);
      element.close();
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  function close() {
    request.current += 1;
    busy.current = false;
    if (timer.current) clearTimeout(timer.current);
    setTransition(null);
    setSelected(null);
  }

  async function move(direction: number) {
    const next = galleryPhotos[selectedIndex + direction];
    if (!next || !selected || busy.current) return;
    busy.current = true;
    const id = ++request.current;
    // Decode first so the incoming slide never flashes an unloaded image.
    const incoming = new window.Image();
    incoming.src = next.src;
    try { await incoming.decode(); } catch { /* Keep navigation available if an image fails. */ }
    if (id !== request.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setSelected(next.src);
      busy.current = false;
      return;
    }
    setTransition({ previous: selected, direction });
    setSelected(next.src);
    timer.current = setTimeout(() => {
      setTransition(null);
      busy.current = false;
    }, 380);
  }

  return (
    <section className="storyGallery" aria-labelledby="gallery-title">
      <SectionDivider />
      <h2 className="sectionTitle" id="gallery-title">Gallery</h2>
      <div className="storyGalleryPhotos">
        {galleryPhotos.map((item, index) => {
          const number = index + 1;
          return <figure className="storyGalleryItem" key={item.src}>
            <button className="storyGalleryPhoto" type="button" aria-label={`View photo ${number}: ${item.alt}`} aria-describedby={item.caption ? `gallery-caption-${number}` : undefined}
              onClick={() => setSelected(item.src)}>
              <Image src={item.src} alt={item.alt} width={item.width} height={item.height} loading="lazy" draggable={false} />
            </button>
            {item.caption && <figcaption id={`gallery-caption-${number}`} className="storyGalleryCaption">{item.caption}</figcaption>}
          </figure>;
        })}
      </div>
      <dialog ref={dialog} className="storyGalleryViewer" aria-label="Gallery photo viewer" tabIndex={-1}
        style={photo ? { "--photo-ratio": photo.width / photo.height, "--photo-natural-width": `${photo.width}px` } as CSSProperties : undefined}
        onCancel={event => { event.preventDefault(); close(); }}
        onClick={event => { if (!(event.target as HTMLElement).closest("button, img, .storyGalleryViewerCaption")) close(); }}
        onKeyDown={event => {
          if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
          if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
        }}>
        {photo && <>
          <div className="storyGalleryViewerContent" data-direction={transition?.direction === -1 ? "back" : "forward"}>
            {[...(transition ? [galleryPhotos.find(item => item.src === transition.previous)!] : []), photo].map(item => {
              const outgoing = item.src !== photo.src;
              return <div key={item.src} className={`storyGallerySlide${transition ? outgoing ? " isLeaving" : " isEntering" : ""}`} aria-hidden={outgoing || undefined}>
                <Image src={item.src} alt={outgoing ? "" : item.alt} width={item.width} height={item.height} loading="eager" draggable={false} />
                {item.caption && <p className="storyGalleryViewerCaption">{item.caption}</p>}
              </div>;
            })}
          </div>
          <button className="storyGalleryArrow storyGalleryPrevious" type="button" aria-label="Previous photo" disabled={selectedIndex === 0} onClick={() => move(-1)}>
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20 6 10 16l10 10" /></svg>
          </button>
          <button className="storyGalleryArrow storyGalleryNext" type="button" aria-label="Next photo" disabled={selectedIndex === galleryPhotos.length - 1} onClick={() => move(1)}>
            <svg viewBox="0 0 32 32" aria-hidden="true"><path d="m12 6 10 10-10 10" /></svg>
          </button>
        </>}
      </dialog>
    </section>
  );
}
