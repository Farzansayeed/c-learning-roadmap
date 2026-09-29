import { describe, it, expect } from 'vitest';
import { dreadLevel, consecutiveBadDays, ghostStreak, maxRoastTier } from './dread';
import { pickRoast } from '../data/roast';
import { defaultData, type AppData } from '../lib/schema';

/** Phase 6: dread state machine — roast tiers, level caps, ghost accounting. */

function withFailStreak(days: number, today: string): AppData {
  const d = defaultData();
  d.startDate = '2026-01-01';
  const cursor = new Date(today + 'T00:00:00');
  for (let i = 0; i < days; i++) {
    cursor.setDate(cursor.getDate() - 1);
    const p = (x: number) => (x < 10 ? '0' : '') + x;
    const key = `${cursor.getFullYear()}-${p(cursor.getMonth() + 1)}-${p(cursor.getDate())}`;
    d.days[key] = { key, kind: 'study', itemIds: [], hoursLogged: 0, verdict: 'fail' };
  }
  return d;
}

describe('dread engine', () => {
  it('clean history = dread 0', () => {
    const d = defaultData();
    expect(dreadLevel(d, '2026-09-29')).toBe(0);
  });

  it('each consecutive fail day raises dread one level', () => {
    for (let n = 1; n <= 5; n++) {
      expect(dreadLevel(withFailStreak(n, '2026-09-29'), '2026-09-29')).toBe(n);
    }
  });

  it('dread caps at 5', () => {
    expect(dreadLevel(withFailStreak(9, '2026-09-29'), '2026-09-29')).toBe(5);
  });

  it('a pass verdict resets the bad streak', () => {
    const d = withFailStreak(3, '2026-09-29');
    d.days['2026-09-28'] = { key: '2026-09-28', kind: 'study', itemIds: ['a'], hoursLogged: 3, verdict: 'pass' };
    expect(consecutiveBadDays(d, '2026-09-29')).toBe(0);
  });

  it('a postponed day neither resets nor adds to the bad streak', () => {
    const d = withFailStreak(2, '2026-09-29');
    d.days['2026-09-28'] = { key: '2026-09-28', kind: 'postponed', itemIds: [], hoursLogged: 0, verdict: 'postponed' };
    expect(consecutiveBadDays(d, '2026-09-29')).toBe(1); // 09-27's fail survives, the postpone is neutral
  });

  it('a rest day resets the bad streak (v2 semantics)', () => {
    const d = withFailStreak(2, '2026-09-29');
    d.days['2026-09-28'] = { key: '2026-09-28', kind: 'rest', itemIds: [], hoursLogged: 0, verdict: 'rest' };
    expect(consecutiveBadDays(d, '2026-09-29')).toBe(0);
  });

  it('ghost streak counts zero-item days until the first ticked day', () => {
    const d = withFailStreak(3, '2026-09-29');
    expect(ghostStreak(d, '2026-09-29')).toBe(3);
    d.days['2026-09-27'].itemIds = ['ticked'];
    d.checked['ticked'] = true;
    // walk stops at the first day with progress: only 09-28 counts
    expect(ghostStreak(d, '2026-09-29')).toBe(1);
  });

  it('intensity dial caps roast tiers: mild 2, spicy 4, nuclear 5', () => {
    expect(maxRoastTier('mild')).toBe(2);
    expect(maxRoastTier('spicy')).toBe(4);
    expect(maxRoastTier('nuclear')).toBe(5);
  });

  it('roast tier never exceeds the intensity cap, even at max dread', () => {
    for (const intensity of ['mild', 'spicy', 'nuclear'] as const) {
      for (let bad = 1; bad <= 9; bad++) {
        const { tier } = pickRoast(intensity, bad);
        expect(tier).toBeLessThanOrEqual(maxRoastTier(intensity));
        expect(tier).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
