"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

function PageReveal({ children }: { children: ReactNode }) {
  const mainRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let firstFrame = 0;
    let secondFrame = 0;

    async function reveal() {
      const fonts = await Promise.all([
        document.fonts.load('700 1em "Milton One"'),
        document.fonts.load('300 1em "Cormorant Garamond"'),
        document.fonts.load('400 1em "Cormorant Garamond"'),
        document.fonts.load('italic 300 1em "Cormorant Garamond"'),
        document.fonts.load('italic 400 1em "Cormorant Garamond"'),
      ]);
      const main = mainRef.current;
      if (cancelled || !main || fonts.some((faces) => faces.length === 0)) return;

      const images = [...main.querySelectorAll("img")].filter((image) => {
        const box = image.getBoundingClientRect();
        return box.top < window.innerHeight && box.bottom > 0;
      });
      await Promise.all(images.map((image) => {
        // Only wait for the first screen, never for lazy photos farther down the page.
        image.loading = "eager";
        return image.decode().catch(() => {});
      }));
      if (cancelled) return;

      // Preserve a hidden frame even when returning to a fully cached page.
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          if (!cancelled) setReady(true);
        });
      });
    }

    reveal().catch(() => {
      // Keep fallback fonts out of the page reveal if a font download fails.
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, []);

  return (
    <main ref={mainRef} className={`pageReveal${ready ? " isReady" : ""}`}>
      {children}
    </main>
  );
}

export function PageContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return <PageReveal key={pathname}>{children}</PageReveal>;
}
