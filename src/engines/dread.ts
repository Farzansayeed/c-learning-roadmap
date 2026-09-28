import type { AppData } from '../lib/schema';

/**
 * dread.ts — consecutive-bad-days computation (v2 semantics).
 * A "bad day" = a CLOSED past day with verdict fail/ghost, or a past day
 * with scheduled items and no verdict (ghosted by omission).
 * Rest days and passes reset the streak. Today never counts.
 */

export type DreadLevel = 0 | 1 | 2 | 3 | 4 | 5;

export function consecutiveBadDays(data: AppData, today: string): number {
  let n = 0;
  // walk backwards from yesterday
  const cursor = new Date(today + 'T00:00:00');
  for (let i = 0; i < 400; i++) {
    cursor.setDate(cursor.getDate() - 1);
    const p = (x: number) => (x < 10 ? '0' : '') + x;
    const key = `${cursor.getFullYear()}-${p(cursor.getMonth() + 1)}-${p(cursor.getDate())}`;
    if (key < data.startDate) break;

    const rec = data.days[key];
    if (rec) {
      if (rec.verdict === 'pass' || rec.verdict === 'rest') break;
      if (rec.verdict === 'fail' || rec.verdict === 'ghost') {
        n += 1;
        continue;
      }
      if (rec.verdict === 'postponed') continue; // postpones neither reset nor add
    }
    // no record: only counts as ghost if items were scheduled
    break; // conservative: unrecorded days before first close don't haunt
  }
  return n;
}

export function dreadLevel(data: AppData, today: string): DreadLevel {
  return Math.min(5, consecutiveBadDays(data, today)) as DreadLevel;
}

/** Roast tier allowed by the intensity dial (decision 2). */
export function maxRoastTier(intensity: 'mild' | 'spicy' | 'nuclear'): number {
  if (intensity === 'mild') return 2;
  if (intensity === 'spicy') return 4;
  return 5; // nuclear
}

/** Ghost streak: consecutive past days (from yesterday) with zero checked items. */
export function ghostStreak(data: AppData, today: string): number {
  const cursor = new Date(today + 'T00:00:00');
  let n = 0;
  for (let i = 0; i < 400; i++) {
    cursor.setDate(cursor.getDate() - 1);
    const p = (x: number) => (x < 10 ? '0' : '') + x;
    const key = `${cursor.getFullYear()}-${p(cursor.getMonth() + 1)}-${p(cursor.getDate())}`;
    if (key < data.startDate) break;
    const rec = data.days[key];
    if (!rec) break;
    if (rec.kind === 'postponed' || rec.kind === 'rest') continue;
    const doneCount = rec.itemIds.filter((id) => data.checked[id]).length;
    if (doneCount === 0) n += 1;
    else break;
  }
  return n;
}

/**
 * Study streak: consecutive past days with real progress (≥1 checked item
 * or a pass verdict). Rest/postponed days are skipped, not breaking.
 * A pass today extends the count by one — the chip should celebrate it.
 */
export function studyStreak(data: AppData, today: string): number {
  const p = (x: number) => (x < 10 ? '0' : '') + x;
  let n = 0;
  const cursor = new Date(today + 'T00:00:00');
  for (let i = 0; i < 400; i++) {
    cursor.setDate(cursor.getDate() - 1);
    const key = `${cursor.getFullYear()}-${p(cursor.getMonth() + 1)}-${p(cursor.getDate())}`;
    if (key < data.startDate) break;
    const rec = data.days[key];
    if (!rec) break; // an unrecorded past day ends the history we can trust
    if (rec.kind === 'postponed' || rec.kind === 'rest') continue;
    const progress = rec.itemIds.some((id) => data.checked[id]) || rec.verdict === 'pass';
    if (progress) n += 1;
    else break;
  }
  if (data.days[today]?.verdict === 'pass') n += 1;
  return n;
}
