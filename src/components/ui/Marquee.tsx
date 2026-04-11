const phrases = [
  "Currently building",
  "Curious by default",
  "Shipped 11 side quests",
  "Built in Bangalore",
  "Made with caffeine",
  "AI-curious, taste-driven",
  "Side projects → real products",
];

export default function Marquee() {
  // Repeat the phrases enough times for a smooth seamless loop
  const items = [...phrases, ...phrases, ...phrases, ...phrases];

  return (
    <div className="relative overflow-hidden border-y border-border bg-bg-primary py-6 md:py-8">
      <div className="flex animate-marquee whitespace-nowrap">
        {items.map((phrase, i) => (
          <span
            key={i}
            className="flex items-center mx-6 md:mx-10 font-[family-name:var(--font-playfair)] italic text-3xl md:text-5xl text-text-primary"
          >
            {phrase}
            <span className="ml-6 md:ml-10 text-accent text-2xl md:text-3xl not-italic">
              ✦
            </span>
          </span>
        ))}
      </div>
      {/* Edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 bg-gradient-to-r from-bg-primary to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 bg-gradient-to-l from-bg-primary to-transparent" />
    </div>
  );
}
