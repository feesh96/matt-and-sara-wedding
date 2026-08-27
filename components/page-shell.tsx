import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <div className={`pageShell ${className}`.trim()}>
      <SiteHeader />
      <main>{children}</main>
    </div>
  );
}
