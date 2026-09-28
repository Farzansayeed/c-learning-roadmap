import { describe, expect, it } from 'vitest';
import { defaultData } from '../lib/schema';
import { addDaysISO, buildSchedule, dayOfWeek, entryFor, workQueue, workingDay } from './schedule';

function mk(overrides: Partial<ReturnType<typeof defaultData>> = {}) {
  const d = defaultData();
  d.startDate = '2026-09-28'; // a Monday
  return { ...d, ...overrides };
}

describe('schedule engine', () => {
  it('work queue covers every topic and drill of all 19 stages', () => {
    const q = workQueue();
    expect(q.length).toBe(230); // matches the journey-map total
    expect(new Set(q.map((i) => i.id)).size).toBe(230);
  });

  it('day 1 is a study day on the start date with items', () => {
    const entries = buildSchedule(mk(), '2026-09-28');
    const first = entries[0];
    expect(first.key).toBe('2026-09-28');
    expect(first.kind).toBe('study');
    expect(first.itemIds.length).toBeGreaterThan(0);
    expect(first.itemIds.every((id) => id.startsWith('s00:'))).toBe(true);
  });

  it('every 7th day is a sunday', () => {
    const entries = buildSchedule(mk(), '2026-09-28', { horizon: 21 });
    const sundays = entries.filter((e) => dayOfWeek(e.key) === 0);
    expect(sundays.length).toBe(3);
    expect(sundays.every((e) => e.kind === 'sunday')).toBe(true);
  });

  it('s00 items are paced across ~3 days (day budget respected)', () => {
    const entries = buildSchedule(mk(), '2026-09-28', { horizon: 14 });
    const s00Days = entries.filter((e) => e.stageId === 's00' && e.kind === 'study');
    expect(s00Days.length).toBeGreaterThanOrEqual(2);
    expect(s00Days.length).toBeLessThanOrEqual(4);
  });

  it('postponed day: kind flips, queue does not advance, next day resumes', () => {
    const d = mk();
    d.postponed['2026-09-29'] = 'tired';
    const entries = buildSchedule(d, '2026-09-30');
    const p = entries.find((e) => e.key === '2026-09-29');
    expect(p?.kind).toBe('postponed');
    expect(p?.itemIds).toHaveLength(0);
    const resume = entries.find((e) => e.key === '2026-09-30');
    expect(resume?.kind).toBe('study');
    expect(resume?.itemIds.length).toBeGreaterThan(0);
  });

  it('two consecutive ghosted past days arm a catch-up day', () => {
    const d = mk();
    // Day 1 and day 2 items left unchecked (ghosted) — past days relative to "today"
    const entries = buildSchedule(d, '2026-10-05', { horizon: 10 });
    const catchups = entries.filter((e) => e.kind === 'catchup');
    expect(catchups.length).toBeGreaterThanOrEqual(1);
    // catch-up happens on/after day 3
    expect(catchups[0].key >= addDaysISO('2026-09-28', 2)).toBe(true);
    // carry drained: catchup holds unchecked items
    expect(catchups[0].itemIds.length).toBeGreaterThan(0);
  });

  it('checked items do not roll into carry', () => {
    const d = mk();
    const q = workQueue();
    // mark all of day 1 done
    const e1 = buildSchedule(d, '2026-09-28')[0];
    for (const id of e1.itemIds) d.checked[id] = true;
    const entries = buildSchedule(d, '2026-09-29', { horizon: 6 });
    const day2 = entries.find((e) => e.key === '2026-09-29')!;
    // day 2 must not repeat day-1 items
    const overlap = day2.itemIds.filter((id) => e1.itemIds.includes(id));
    expect(overlap).toHaveLength(0);
    expect(q.length).toBe(230); // sanity: queue unchanged
  });

  it('schedule terminates: last entry exhausts the queue within horizon', () => {
    const entries = buildSchedule(mk(), '2026-09-28');
    const allScheduled = new Set(entries.flatMap((e) => e.itemIds));
    expect(allScheduled.size).toBe(230);
    // pace ≈ 230 items / ~2.5 per work-day ≈ 92 work days ≈ 107 calendar days.
    // Accept the honest range rather than a guess.
    expect(entries.length).toBeLessThan(400);
    expect(entries.length).toBeGreaterThan(85);
  });

  it('no stage items scheduled on sundays (review day)', () => {
    const entries = buildSchedule(mk(), '2026-09-28');
    const sundays = entries.filter((e) => dayOfWeek(e.key) === 0);
    for (const s of sundays) {
      // sunday items come only from carry, never fresh pulls with a stageId
      expect(s.stageId).toBeNull();
    }
  });

  it('entryFor and workingDay resolve sensibly', () => {
    const entries = buildSchedule(mk(), '2026-09-28');
    expect(entryFor(entries, '2026-09-28')?.kind).toBe('study');
    expect(workingDay(entries, '2026-09-28')?.key).toBe('2026-09-28');
  });

  it('leap-year February does not skip days', () => {
    const d = mk();
    d.startDate = '2028-02-27';
    const entries = buildSchedule(d, '2028-03-02', { horizon: 6 });
    const keys = entries.map((e) => e.key);
    expect(keys).toContain('2028-02-28');
    expect(keys).toContain('2028-02-29');
    expect(keys).toContain('2028-03-01');
  });
});
