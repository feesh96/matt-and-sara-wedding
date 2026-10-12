"use client";

import Image from "next/image";
import { useState } from "react";

export function HomeHeroImage({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Image
      className={`homeGates${loaded ? " isReady" : ""}`}
      src={src}
      alt="The open iron gates at TPC Jasna Polana"
      fill
      priority
      sizes="100vw"
      onLoad={() => setLoaded(true)}
    />
  );
}
