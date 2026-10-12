import type { ReactNode } from "react";

type PageIntroProps = {
  title: ReactNode;
  titleId: string;
  children?: ReactNode;
  className?: string;
  compact?: boolean;
};

export function PageIntro({ title, titleId, children, className = "", compact = false }: PageIntroProps) {
  return (
    <header className={`pageIntro ${className}`.trim()}>
      <h1 id={titleId} className={`pageTitle${compact ? " pageTitleCompact" : ""}`}>
        {title}
      </h1>
      {children && <div className="pageIntroCopy">{children}</div>}
    </header>
  );
}
