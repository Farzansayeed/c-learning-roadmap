/** XP + ranks (DESIGN.md §4, rebalanced for v3 volume). */

export const XP = {
  checkbox: 5,
  drillPlatform: 10,
  quizPass: 25,
  quizFirstTry: 15,
  buildAccept: 200,
  bossGate: 500,
} as const;

export const RANKS: { name: string; min: number }[] = [
  { name: 'Script Kiddie', min: 0 },
  { name: 'Apprentice', min: 150 },
  { name: 'Journeyman', min: 500 },
  { name: 'Artisan', min: 1200 },
  { name: 'Smith', min: 2500 },
  { name: 'Master Smith', min: 4500 },
  { name: 'Forge Legend', min: 7500 },
];

export function rankOf(xp: number): { index: number; name: string; next: string | null; progress: number } {
  let idx = 0;
  for (let i = 0; i < RANKS.length; i++) if (xp >= RANKS[i].min) idx = i;
  const cur = RANKS[idx];
  const next = RANKS[idx + 1] ?? null;
  const progress = next ? Math.min(1, (xp - cur.min) / (next.min - cur.min)) : 1;
  return { index: idx, name: cur.name, next: next?.name ?? null, progress };
}
