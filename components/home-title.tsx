"use client";

import { useEffect, useState, type ReactNode } from "react";

export function HomeTitle({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      document.fonts.load('700 1em "Milton One"'),
      document.fonts.load('400 1em "Cormorant Garamond"'),
    ]).then((fonts) => {
      if (!cancelled && fonts.every((faces) => faces.length > 0)) setReady(true);
    }).catch(() => {
      // Keep the title hidden if its fonts fail instead of showing a fallback.
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className={`homeTitleLockup${ready ? " isReady" : ""}`}>
      {children}
    </div>
  );
}
