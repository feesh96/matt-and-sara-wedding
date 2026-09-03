"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { site, type NavigationItem } from "@/lib/site";

type SiteHeaderProps = {
  overlay?: boolean;
};

function NavigationItems({
  side,
  mobile = false,
  pathname,
}: {
  side?: NavigationItem["side"];
  mobile?: boolean;
  pathname: string;
}) {
  const items = side ? site.navigation.filter((item) => item.side === side) : site.navigation;

  return items.map((item) => (
    <li key={item.label}>
      {item.pending ? (
        <span className="navPending" aria-disabled="true">
          {mobile && <MobileNavIcon label={item.label} />}
          {item.label}
        </span>
      ) : item.external ? (
        <a href={item.href} target="_blank" rel="noreferrer">
          {mobile && <MobileNavIcon label={item.label} />}
          {item.label}
        </a>
      ) : (
        <Link
          href={item.href}
          aria-current={pathname === item.href ? "page" : undefined}
        >
          {mobile && <MobileNavIcon label={item.label} />}
          {item.label}
        </Link>
      )}
    </li>
  ));
}

function MobileNavIcon({ label }: { label: string }) {
  const paths: Record<string, ReactNode> = {
    Home: <path d="m3 10 9-7 9 7v10H3V10Zm6 10v-6h6v6" />,
    Schedule: <path d="M5 4h14v16H5V4Zm0 5h14M8 2v4m8-4v4" />,
    Travel: <path d="M5 8h14v12H5V8Zm4 0V5h6v3m-3 4v4" />,
    Registry: <path d="M4 10h16v10H4V10Zm8 0v10M3 6h18v4H3V6Zm9 0c-3 0-4-4-1-4 2 0 1 3 1 4Zm0 0c3 0 4-4 1-4-2 0-1 3-1 4Z" />,
    FAQs: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-2-11a2 2 0 1 1 3.6 1.2c-.8 1.1-1.6 1.2-1.6 2.8m0 3h.01" />,
    RSVP: <path d="M3 6h18v12H3V6Zm0 1 9 6 9-6" />,
  };

  return (
    <svg className="mobileNavIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      {paths[label]}
    </svg>
  );
}

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const headerClassName = `siteHeader${overlay ? " siteHeaderOverlay" : ""}`;
  const pathname = usePathname().replace(/\/$/, "") || "/";

  return (
    <header className={headerClassName}>
      <div className="desktopHeader">
        <nav className="desktopNav desktopNavLeft" aria-label="Primary navigation">
          <ul>
            <NavigationItems side="left" pathname={pathname} />
          </ul>
        </nav>
        <Link className="wordmark" href="/" aria-label="Sara and Matt, home">
          <Image src="/images/monogram.png" alt="" width={322} height={249} priority={overlay} />
        </Link>
        <nav className="desktopNav desktopNavRight" aria-label="Secondary navigation">
          <ul>
            <NavigationItems side="right" pathname={pathname} />
          </ul>
        </nav>
      </div>

      <div className="mobileHeader">
        <Link className="wordmark" href="/" aria-label="Sara and Matt, home">
          <Image src="/images/monogram.png" alt="" width={322} height={249} priority={overlay} />
        </Link>
        <details className="mobileMenu">
          <summary className="menuButton">
            <span className="visuallyHidden">Toggle navigation</span>
            <span className="menuButtonLabel" aria-hidden="true">Menu</span>
            <span className="menuIcon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </summary>
          <nav id="mobile-navigation" className="mobileNav" aria-label="Mobile navigation">
            <ul>
              <NavigationItems mobile pathname={pathname} />
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
