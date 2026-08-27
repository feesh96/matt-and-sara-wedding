import Image from "next/image";
import Link from "next/link";
import { site, type NavigationItem } from "@/lib/site";

type SiteHeaderProps = {
  overlay?: boolean;
};

function NavigationItems({
  side,
}: {
  side?: NavigationItem["side"];
}) {
  const items = side ? site.navigation.filter((item) => item.side === side) : site.navigation;

  return items.map((item) => (
    <li key={item.label}>
      {item.pending ? (
        <span className="navPending" aria-disabled="true">
          {item.label}
        </span>
      ) : (
        <Link href={item.href}>
          {item.label}
        </Link>
      )}
    </li>
  ));
}

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  const headerClassName = `siteHeader${overlay ? " siteHeaderOverlay" : ""}`;

  return (
    <header className={headerClassName}>
      <div className="desktopHeader">
        <nav className="desktopNav desktopNavLeft" aria-label="Primary navigation">
          <ul>
            <NavigationItems side="left" />
          </ul>
        </nav>
        <Link className="wordmark" href="/" aria-label="Sara and Matt, home">
          <Image src="/images/monogram.png" alt="" width={322} height={249} priority={overlay} />
        </Link>
        <nav className="desktopNav desktopNavRight" aria-label="Secondary navigation">
          <ul>
            <NavigationItems side="right" />
          </ul>
        </nav>
      </div>

      <div className="mobileHeader">
        <Link className="wordmark" href="/" aria-label="Sara and Matt, home">
          <Image src="/images/monogram.png" alt="" width={322} height={249} priority={overlay} />
        </Link>
        <details className="mobileMenu">
          <summary className="menuButton">
            <span className="menuOpenLabel">Menu</span>
            <span className="menuCloseLabel">Close</span>
            <span className="menuRule" aria-hidden="true" />
          </summary>
          <nav id="mobile-navigation" className="mobileNav" aria-label="Mobile navigation">
            <ul>
              <NavigationItems />
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
