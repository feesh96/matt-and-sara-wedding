import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

type SiteHeaderProps = {
  overlay?: boolean;
};

export function SiteHeader({ overlay = false }: SiteHeaderProps) {
  return (
    <header className={`siteHeader${overlay ? " siteHeaderOverlay" : ""}`}>
      <Link className="wordmark" href="/" aria-label="Sara and Matt, home">
        <Image
          src="/images/monogram.png"
          alt=""
          width={322}
          height={249}
          priority={overlay}
        />
      </Link>
      <nav aria-label="Main navigation">
        <ul className="navList">
          {site.navigation.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
