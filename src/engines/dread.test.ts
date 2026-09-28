import { describe, expect, it } from 'vitest';
import { defaultData } from '../lib/schema';
import { consecutiveBadDays, dreadLevel, ghostStreak, maxRoastTier, studyStreak } from './dread';

function day(key: string, kind: 'study' | 'sunday' | 'catchup' | 'rest' | 'postponed', verdict?: 'pass' | 'fail' | 'ghost' | 'postponed' | 'rest', itemIds: string[] = ['s00:t:s00.t1']) {
  return { key, kind, verdict, itemIds, hoursLogged: 0 };
}

/** data with a startDate safely before all test dates */
function mk(): ReturnType<typeof defaultData> {
  const d = defaultData();
  d.startDate = '2026-09-20';
  return d;
}

describe('dread engine', () => {
  it('clean history → level 0', () => {
    const d = mk();
    expect(dreadLevel(d, '2026-09-28')).toBe(0);
  });

  it('two fails escalate; a pass resets', () => {
    const d = mk();
    d.days['2026-09-27'] = day('2026-09-27', 'study', 'fail');
    d.days['2026-09-26'] = day('2026-09-26', 'study', 'fail');
    expect(consecutiveBadDays(d, '2026-09-28')).toBe(2);
    d.days['2026-09-25'] = day('2026-09-25', 'study', 'fail');
    expect(consecutiveBadDays(d, '2026-09-28')).toBe(3);
    // insert a pass between: 25 fail, 26 pass, 27 fail → streak = 1
    const d2 = mk();
    d2.days['2026-09-27'] = day('2026-09-27', 'study', 'fail');
    d2.days['2026-09-26'] = day('2026-09-26', 'study', 'pass');
    d2.days['2026-09-25'] = day('2026-09-25', 'study', 'fail');
    expect(consecutiveBadDays(d2, '2026-09-28')).toBe(1);
  });

  it('rest days break the streak (mercy)', () => {
    const d = mk();
    d.days['2026-09-27'] = day('2026-09-27', 'study', 'fail');
    d.days['2026-09-26'] = day('2026-09-26', 'rest', 'rest');
    d.days['2026-09-25'] = day('2026-09-25', 'study', 'fail');
    expect(consecutiveBadDays(d, '2026-09-28')).toBe(1);
  });

  it('postpones neither reset nor add', () => {
    const d = mk();
    d.days['2026-09-27'] = day('2026-09-27', 'study', 'fail');
    d.days['2026-09-26'] = day('2026-09-26', 'postponed', 'postponed');
    d.days['2026-09-25'] = day('2026-09-25', 'study', 'fail');
    expect(consecutiveBadDays(d, '2026-09-28')).toBe(2);
  });

  it('level caps at 5 and intensity caps tiers', () => {
    const d = mk();
    for (let i = 1; i <= 8; i++) {
      const key = `2026-09-${(28 - i).toString().padStart(2, '0')}`;
      d.days[key] = day(key, 'study', 'fail');
    }
    expect(dreadLevel(d, '2026-09-28')).toBe(5);
    expect(maxRoastTier('mild')).toBe(2);
    expect(maxRoastTier('spicy')).toBe(4);
    expect(maxRoastTier('nuclear')).toBe(5);
  });

  it('ghostStreak counts zero-check days but skips rest', () => {
    const d = mk();
    d.days['2026-09-27'] = day('2026-09-27', 'study', 'ghost');
    d.days['2026-09-26'] = day('2026-09-26', 'rest', 'rest');
    d.days['2026-09-25'] = day('2026-09-25', 'study', 'ghost');
    expect(ghostStreak(d, '2026-09-28')).toBe(2);
  });

  it('studyStreak counts progress days, skips rest, celebrates a pass today', () => {
    const d = mk();
    expect(studyStreak(d, '2026-09-28')).toBe(0);
    // two progress days back-to-back
    const p1 = day('2026-09-27', 'study', 'pass');
    p1.hoursLogged = 3;
    d.days['2026-09-27'] = p1;
    d.days['2026-09-26'] = day('2026-09-26', 'study', 'pass');
    expect(studyStreak(d, '2026-09-28')).toBe(2);
    // a rest day between progress days does not break it
    const d2 = mk();
    d2.days['2026-09-27'] = day('2026-09-27', 'study', 'pass');
    d2.days['2026-09-26'] = day('2026-09-26', 'rest', 'rest');
    d2.days['2026-09-25'] = day('2026-09-25', 'study', 'pass');
    expect(studyStreak(d2, '2026-09-28')).toBe(2);
    // a fail breaks it
    const d3 = mk();
    d3.days['2026-09-27'] = day('2026-09-27', 'study', 'fail');
    d3.days['2026-09-26'] = day('2026-09-26', 'study', 'pass');
    expect(studyStreak(d3, '2026-09-28')).toBe(0);
    // closing today as pass extends the count by one
    const d4 = mk();
    d4.days['2026-09-27'] = day('2026-09-27', 'study', 'pass');
    expect(studyStreak(d4, '2026-09-28')).toBe(1);
    d4.days['2026-09-28'] = day('2026-09-28', 'study', 'pass');
    expect(studyStreak(d4, '2026-09-28')).toBe(2);
  });
});
