import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { PageContent } from "@/components/page-content";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`pageShell ${className}`.trim()}>
      <SiteHeader />
      <PageContent>{children}</PageContent>
    </div>
  );
}
