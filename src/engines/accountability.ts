/**
 * accountability.ts — Phase 6: the mechanics behind tribunal, pardons,
 * streak insurance, and the bedtime lockout. Pure functions; stores own
 * persistence, components own drama.
 */

/* ── Sunday Tribunal — the week gets a stamp ─────────────────── */

export interface TribunalStamp {
  id: 'flawless' | 'solid' | 'shaky' | 'poor' | 'abysmal';
  name: string;
  /** minimum completion ratio (0..1) for this stamp */
  min: number;
  color: string;
}

export const TRIBUNAL_STAMPS: TribunalStamp[] = [
  { id: 'flawless', name: 'FLAWLESS', min: 0.8, color: 'var(--good)' },
  { id: 'solid', name: 'SOLID', min: 0.5, color: 'var(--info)' },
  { id: 'shaky', name: 'SHAKY', min: 0.25, color: 'var(--warn)' },
  { id: 'poor', name: 'POOR', min: 0.01, color: 'var(--danger)' },
  { id: 'abysmal', name: 'ABYSMAL', min: 0, color: 'var(--danger)' },
];

/** The week's completion ratio → its stamp. 0 items scheduled counts as 0. */
export function tribunalStamp(ratio: number): TribunalStamp {
  const r = Math.max(0, Math.min(1, ratio));
  return TRIBUNAL_STAMPS.find((s) => r >= s.min) ?? TRIBUNAL_STAMPS[TRIBUNAL_STAMPS.length - 1];
}

/* ── Pardon tokens — earned per 10 clean days, spend to erase ── */

/**
 * How many pardons a clean-day count has earned beyond `current`.
 * Clean days = closed pass days (the store counts them; we do the math).
 */
export function pardonEarned(cleanDays: number, currentPardons: number): number {
  const earned = Math.floor(cleanDays / 10);
  return Math.max(0, earned - currentPardons);
}

/* ── Bedtime lockout — nag → overlay; quiet once closed ─────── */

export type BedtimeMode = 'none' | 'nag' | 'overlay' | 'closed';

export interface BedtimeStatus {
  past: boolean;
  mode: BedtimeMode;
  minutesLate: number;
}

/**
 * Minutes past bedtime for the current moment (midnight-crossing aware:
 * 00:45 with a 23:30 bedtime is 75 minutes late).
 */
export function minutesPast(bedtime: string, now: Date): number {
  const [h, m] = bedtime.split(':').map(Number);
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const bedMin = h * 60 + m;
  let delta = nowMin - bedMin;
  if (delta < -720) delta += 1440; // bedtime 23:30, it's now 00:10 → 40 min
  return Math.max(0, delta);
}

export function bedtimeStatus(bedtime: string, now: Date, dayClosed: boolean): BedtimeStatus {
  const late = minutesPast(bedtime, now);
  if (!late) return { past: false, mode: 'none', minutesLate: 0 };
  if (dayClosed) return { past: true, mode: 'closed', minutesLate: late };
  return { past: true, mode: late >= 30 ? 'overlay' : 'nag', minutesLate: late };
}
