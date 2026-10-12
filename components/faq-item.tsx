"use client";

import { useEffect, useRef, type MouseEvent } from "react";

type FaqItemProps = {
  question: string;
  answer: string;
};

export function FaqItem({ question, answer }: FaqItemProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const targetOpen = useRef(false);

  useEffect(() => () => animationRef.current?.cancel(), []);

  function toggle(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    const details = detailsRef.current;
    const panel = answerRef.current;
    if (!details || !panel) return;

    const opening = !(animationRef.current ? targetOpen.current : details.open);
    targetOpen.current = opening;
    // Capture the current frame before cancelling, so rapid clicks reverse smoothly.
    const height = details.open ? panel.getBoundingClientRect().height : 0;
    const opacity = details.open ? getComputedStyle(panel).opacity : "0";
    animationRef.current?.cancel();
    animationRef.current = null;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      details.open = opening;
      return;
    }

    details.open = true;
    const animation = panel.animate(
      [
        { height: `${height}px`, opacity },
        { height: `${opening ? panel.scrollHeight : 0}px`, opacity: opening ? "1" : "0" },
      ],
      { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    animationRef.current = animation;
    animation.onfinish = () => {
      if (animationRef.current !== animation) return;
      details.open = opening;
      animationRef.current = null;
    };
  }

  return (
    <details ref={detailsRef}>
      <summary onClick={toggle}>{question}</summary>
      <div className="faqAnswer" ref={answerRef}>
        <p>{answer}</p>
      </div>
    </details>
  );
}
