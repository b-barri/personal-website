// Catalog section label — the monospace "§ 01  SELECTED WORK  ----" header
// of the postal archive language. Pure presentational, theme-aware.

export default function CatalogLabel({
  number,
  children,
  rule = true,
  className = "",
}: {
  /** Catalog index, e.g. "01". Rendered as "§ 01". */
  number?: string;
  children: React.ReactNode;
  /** Show the dashed perforated rule trailing the label. */
  rule?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.2em] text-text-secondary ${className}`}
    >
      {number && (
        <span className="font-semibold text-accent">§ {number}</span>
      )}
      <span>{children}</span>
      {rule && <span className="catalog-rule flex-1" aria-hidden="true" />}
    </div>
  );
}
