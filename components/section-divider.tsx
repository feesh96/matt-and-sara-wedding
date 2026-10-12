export function SectionDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`sectionDivider ${className}`.trim()} aria-hidden="true">
      <span />
    </div>
  );
}
