import { describe, it, expect } from 'vitest';
import {
  TRIBUNAL_STAMPS,
  tribunalStamp,
  pardonEarned,
  bedtimeStatus,
  minutesPast,
} from './accountability';

/** Phase 6: tribunal math, pardon economy, insurance, bedtime lockout. */

describe('sunday tribunal', () => {
  it('every stamp has distinct descending thresholds and a name', () => {
    let prev = Infinity;
    for (const s of TRIBUNAL_STAMPS) {
      expect(s.name.length).toBeGreaterThan(2);
      expect(s.min).toBeLessThan(prev);
      prev = s.min;
    }
  });

  it('stamps order FLAWLESS → ABYSMAL with clean boundaries', () => {
    expect(tribunalStamp(1.0).id).toBe('flawless');
    expect(tribunalStamp(0.8).id).toBe('flawless');
    expect(tribunalStamp(0.79).id).toBe('solid');
    expect(tribunalStamp(0.5).id).toBe('solid');
    expect(tribunalStamp(0.49).id).toBe('shaky');
    expect(tribunalStamp(0.25).id).toBe('shaky');
    expect(tribunalStamp(0.24).id).toBe('poor');
    expect(tribunalStamp(0.01).id).toBe('poor');
    expect(tribunalStamp(0).id).toBe('abysmal');
    expect(tribunalStamp(0).name).toBe('ABYSMAL');
  });
});

describe('pardon economy', () => {
  it('grants one pardon per 10 clean days, carrying remainder', () => {
    expect(pardonEarned(9, 0)).toBe(0);
    expect(pardonEarned(10, 0)).toBe(1);
    expect(pardonEarned(15, 1)).toBe(0);
    expect(pardonEarned(25, 2)).toBe(0);
    expect(pardonEarned(29, 2)).toBe(0);
    expect(pardonEarned(30, 2)).toBe(1);
    expect(pardonEarned(35, 3)).toBe(0);
  });
});

describe('bedtime lockout', () => {
  const T = (h: number, m: number): Date => {
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d;
  };

  it('minutesPast computes distance past bedtime within the same night', () => {
    // 23:30 bedtime, now 23:45 → 15 minutes past
    const bedtime = '23:30';
    const now = T(23, 45);
    const [bh, bm] = bedtime.split(':').map(Number);
    const expected = (23 - bh) * 60 + (45 - bm);
    expect(minutesPast(bedtime, now)).toBe(Math.max(0, expected));
  });

  it('before bedtime = not past', () => {
    expect(minutesPast('23:30', T(22, 0))).toBe(0);
  });

  it('bedtimeStatus: no nag before bedtime', () => {
    const s = bedtimeStatus('23:30', T(12, 0), false);
    expect(s.past).toBe(false);
    expect(s.mode).toBe('none');
  });

  it('bedtimeStatus escalates nag → overlay with time', () => {
    const nagging = bedtimeStatus('23:30', T(23, 45), false);
    expect(nagging.past).toBe(true);
    expect(nagging.mode).toBe('nag');

    const locked = bedtimeStatus('23:30', T(0, 45), false);
    expect(locked.past).toBe(true);
    expect(locked.mode).toBe('overlay');
    expect(locked.minutesLate).toBeGreaterThan(30);
  });

  it('bedtimeStatus stays quiet once the day is closed', () => {
    const s = bedtimeStatus('23:30', T(23, 59), true);
    expect(s.mode).toBe('closed');
  });

  it('crossing midnight counts minutes into tomorrow', () => {
    // 00:45 with a 23:30 bedtime = 75 minutes past
    expect(minutesPast('23:30', T(0, 45))).toBe(75);
  });
});
