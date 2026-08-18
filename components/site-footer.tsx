import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <Image
        className="footerMonogram"
        src="/images/monogram.png"
        alt="Sara and Matt monogram"
        width={322}
        height={249}
      />
      <p>{site.wedding.date} · {site.wedding.city}</p>
      <Link href="/">mattandsara.us</Link>
    </footer>
  );
}
