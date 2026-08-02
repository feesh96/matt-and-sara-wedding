import type { ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

type PageShellProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
  return (
    <>
      <SiteHeader />
      <main>
        <header className="pageHeading">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="pageIntro">{intro}</p>
        </header>
        <div className="pageContent">{children}</div>
      </main>
      <SiteFooter />
    </>
  );
}
