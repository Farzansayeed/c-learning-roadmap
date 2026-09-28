import type { AppData, ReviewCard } from './schema';

/** schema v4 adds the spaced-review queue. v3 state upgrades in place. */

export function migrate(parsed: unknown): AppData | null {
  if (typeof parsed !== 'object' || parsed === null) return null;
  const v = parsed as { version?: unknown };
  if (v.version === 3) {
    const up = parsed as AppData;
    up.version = 4;
    up.review = (up as { review?: Record<string, ReviewCard> }).review ?? {};
    return up;
  }
  if (v.version === 4) return parsed as AppData;
  return null; // unknown/older — caller falls back to fresh default
}
