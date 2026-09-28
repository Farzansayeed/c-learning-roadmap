import type { ReviewCard } from '../lib/schema';

/**
 * spacedReview.ts — SM-2-lite (DESIGN.md §4).
 * Ladder: 1 → 3 → 7 → 16 → 35 days, then n × ease.
 * pass: climb the ladder (× ease at the top). fail: back to 1 day, ease −0.2 (floor 1.3), lapse++.
 */

export const REVIEW_INTERVALS = [1, 3, 7, 16, 35] as const;
export const EASE_FLOOR = 1.3;
export const EASE_START = 2.5;
export const EASE_STEP = 0.2;
/** Due cards surfaced per day (design cap). */
export const MAX_DUE_PER_DAY = 10;

export function addDaysISO(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  const p = (x: number) => (x < 10 ? '0' : '') + x;
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function intervalFor(card: Pick<ReviewCard, 'step' | 'ease'>): number {
  const { step, ease } = card;
  if (step < REVIEW_INTERVALS.length) return REVIEW_INTERVALS[step];
  const base = REVIEW_INTERVALS[REVIEW_INTERVALS.length - 1];
  return Math.min(180, Math.round(base * Math.pow(ease, step - REVIEW_INTERVALS.length + 1)));
}

/** Missed an item: create (or reset) its review card, due tomorrow. */
export function scheduleFailure(card: ReviewCard | undefined, itemId: string, today: string): ReviewCard {
  if (!card) {
    return { itemId, step: 0, ease: EASE_START, due: addDaysISO(today, 1), lapses: 1, lastAt: new Date().toISOString() };
  }
  return {
    ...card,
    step: 0,
    ease: Math.max(EASE_FLOOR, card.ease - EASE_STEP),
    lapses: card.lapses + 1,
    due: addDaysISO(today, 1),
    lastAt: new Date().toISOString(),
  };
}

/** Passed a review: climb the ladder. */
export function scheduleSuccess(card: ReviewCard, today: string): ReviewCard {
  const next: ReviewCard = {
    ...card,
    step: card.step + 1,
    due: addDaysISO(today, 1), // placeholder, recomputed below
    lastAt: new Date().toISOString(),
  };
  next.due = addDaysISO(today, intervalFor(next));
  return next;
}

export function isDue(card: ReviewCard, today: string): boolean {
  return card.due <= today;
}

/** Today's review queue, weakest first, capped. */
export function dueCards(
  review: Readonly<Record<string, ReviewCard>>,
  today: string,
  cap = MAX_DUE_PER_DAY,
): ReviewCard[] {
  return Object.values(review)
    .filter((c) => isDue(c, today))
    .sort((a, b) => b.lapses - a.lapses || a.due.localeCompare(b.due))
    .slice(0, cap);
}
