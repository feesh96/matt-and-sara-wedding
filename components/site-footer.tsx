import Link from "next/link";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="siteFooter">
      <p className="footerMonogram">S <span>&</span> M</p>
      <p>{site.wedding.date} · {site.wedding.city}</p>
      <Link href="/">mattandsara.us</Link>
    </footer>
  );
}
