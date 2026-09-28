import { describe, expect, it } from 'vitest';
import {
  addDaysISO,
  dueCards,
  EASE_FLOOR,
  REVIEW_INTERVALS,
  scheduleFailure,
  scheduleSuccess,
} from './spacedReview';
import type { ReviewCard } from '../lib/schema';

const T = '2026-09-29';

function card(over: Partial<ReviewCard> = {}): ReviewCard {
  return { itemId: 'q.x', step: 0, ease: 2.5, due: T, lapses: 0, lastAt: '2026-09-28T00:00:00Z', ...over };
}

describe('spaced review (SM-2-lite)', () => {
  it('ladder is 1, 3, 7, 16, 35 then × ease', () => {
    expect([...REVIEW_INTERVALS]).toEqual([1, 3, 7, 16, 35]);
  });

  it('failure creates a card due tomorrow with a lapse counted', () => {
    const c = scheduleFailure(undefined, 'q.s03.ftb1', T);
    expect(c.step).toBe(0);
    expect(c.due).toBe(addDaysISO(T, 1));
    expect(c.lapses).toBe(1);
    expect(c.ease).toBe(2.5);
  });

  it('failure resets the ladder and bleeds ease to the floor', () => {
    let c = card({ step: 4, ease: 2.5, lapses: 0 });
    c = scheduleFailure(c, 'q.x', T);
    expect(c.step).toBe(0);
    expect(c.lapses).toBe(1);
    expect(c.ease).toBe(2.3);
    for (let i = 0; i < 10; i++) c = scheduleFailure(c, 'q.x', T);
    expect(c.ease).toBe(EASE_FLOOR); // never below 1.3
    expect(c.lapses).toBe(11);
  });

  it('failure consumes rung 1 (+1d); passes climb 3 → 7 → 16 → 35, then × ease', () => {
    let c = scheduleFailure(undefined, 'q.x', T);
    expect(c.due).toBe(addDaysISO(T, 1)); // rung 1 = the first re-review
    const dueDates: string[] = [];
    for (let i = 0; i < 5; i++) {
      c = scheduleSuccess(c, T);
      dueDates.push(c.due);
    }
    expect(dueDates).toEqual([
      addDaysISO(T, 3),
      addDaysISO(T, 7),
      addDaysISO(T, 16),
      addDaysISO(T, 35),
      addDaysISO(T, Math.round(35 * 2.5)), // beyond the ladder: × ease (2.5)
    ]);
  });

  it('beyond the ladder the interval grows by ease', () => {
    let c = card({ step: 4, ease: 2.0 });
    c = scheduleSuccess(c, T); // step 5 → 35 × 2.0 = 70 (capped 180)
    expect(c.step).toBe(5);
    expect(c.due).toBe(addDaysISO(T, 70));
    const fast = scheduleSuccess(card({ step: 4, ease: 2.5 }), T);
    expect(fast.due).toBe(addDaysISO(T, Math.round(35 * 2.5))); // capped at 180 regardless
  });

  it('dueCards picks only due cards, weakest first, capped at 10', () => {
    const review = {
      a: card({ itemId: 'a', due: '2026-09-28', lapses: 1 }),
      b: card({ itemId: 'b', due: '2026-09-27', lapses: 3 }),
      c: card({ itemId: 'c', due: '2026-10-05' }), // future — not due
      d: card({ itemId: 'd', due: '2026-09-29', lapses: 0 }),
    };
    const due = dueCards(review, T);
    expect(due.map((c) => c.itemId)).toEqual(['b', 'a', 'd']); // most lapses first
    expect(due.length).toBeLessThanOrEqual(10);
    const many = Object.fromEntries(
      Array.from({ length: 25 }, (_, i) => [`k${i}`, card({ itemId: `k${i}`, due: '2026-09-01' })]),
    );
    expect(dueCards(many, T)).toHaveLength(10);
  });
});
