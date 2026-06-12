// Quest Log prototype — visited-project tracking via localStorage.
// PROTOTYPE: evaluating the "Side Quests as a mechanic" idea (docs/ideation/2026-06-12).

export const QUEST_STORAGE_KEY = "quest-log-v1";
export const QUEST_EVENT = "questlog:update";

export function getStampedSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEST_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

/** Records a visit. Returns true if this was a NEW stamp. */
export function stampQuest(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const stamped = getStampedSlugs();
  if (stamped.includes(slug)) return false;
  try {
    localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify([...stamped, slug]));
  } catch {
    return false;
  }
  window.dispatchEvent(new CustomEvent(QUEST_EVENT));
  return true;
}

/** 1..20 → Roman numerals, for the hidden quest's seal ("XV" when there are 14 quests). */
export function romanize(n: number): string {
  const table: [number, string][] = [
    [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
  ];
  let out = "";
  let rest = n;
  for (const [value, glyph] of table) {
    while (rest >= value) {
      out += glyph;
      rest -= value;
    }
  }
  return out;
}

export function resetQuests(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(QUEST_STORAGE_KEY);
  } catch {
    /* noop */
  }
  window.dispatchEvent(new CustomEvent(QUEST_EVENT));
}
