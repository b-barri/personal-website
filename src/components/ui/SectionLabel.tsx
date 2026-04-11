export default function SectionLabel({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="font-[family-name:var(--font-playfair)] italic text-lg text-accent">
        {number}
      </span>
      <span className="h-px w-12 bg-border" />
      <span className="font-[family-name:var(--font-playfair)] italic text-base text-text-secondary tracking-wide">
        {label}
      </span>
    </div>
  );
}
