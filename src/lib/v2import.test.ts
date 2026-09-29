import { describe, it, expect } from 'vitest';
import { importV2, importV2State } from './v2import';
import { isValidAppData, defaultData } from './schema';

/** A faithful v2 export (DEFAULT_STATE() + usage, per legacy/index.html L1284). */
function v2Fixture(): Record<string, unknown> {
  return {
    theme: 'light',
    checked: { 's03:t1': true, 's03:t2': true },
    notes: { 's03:t1': 'pointers finally clicked' },
    collapsed: {},
    hideDone: false,
    celebrated: false,
    startDate: '2026-07-01',
    settings: { wdTarget: 2.5, suTarget: 5, bedtime: 22, strict: true },
    hours: { '2026-07-01': 2.5, '2026-07-02': 3, '2026-07-03': 0.5 },
    closedDays: { '2026-07-01': true, '2026-07-02': true, '2026-07-03': true },
    badLog: {
      '2026-07-01': { verdict: 'pass', hours: 2.5, target: 2.5, closedAt: '22:10' },
      '2026-07-02': { verdict: 'fail', hours: 3, target: 3.5, closedAt: '23:40' },
      '2026-07-03': { verdict: 'rest', hours: 0.5, target: 2.5 },
    },
    postponed: { '2026-07-05': { label: 'guardian visit' } },
    customExcuses: ['illness', 'server on fire'],
    excuseUse: {},
    corrupted: false,
    migratedV2: true,
    dread: null,
    pardons: 2,
    pardonBase: 0,
    timer: { running: false, startedAt: null, accMin: 0, dayK: null },
    focusLog: { '2026-07-01': 90, '2026-07-02': 45 },
    checkLog: {},
    lastTribunalWeek: '',
    mondayMsg: null,
    lastVerdict: null,
    xp: 1234,
    xpSeen: {},
    rankIdx: 3,
    restTokens: 3,
    lateNight: {},
  };
}

describe('v2import', () => {
  it('maps a faithful v2 export to a valid v4 AppData', () => {
    const res = importV2State(v2Fixture());
    expect(res).not.toBeNull();
    const { data, summary } = res as NonNullable<ReturnType<typeof importV2State>>;
    expect(isValidAppData(data)).toBe(true);
    expect(data.version).toBe(4);
    expect(data.startDate).toBe('2026-07-01');
    expect(data.settings.weekdayTarget).toBe(2.5);
    expect(data.settings.sundayTarget).toBe(5);
    expect(data.settings.bedtime).toBe('22:00'); // hour number -> HH:MM
    expect(data.xp).toBe(1234);
    expect(data.pardons).toBe(2);
    expect(data.insurance).toBe(3); // restTokens -> insurance
    expect(data.customExcuses).toEqual(['illness', 'server on fire']);
    expect(summary).toContain('1 pass'); // 07-01 pass; 07-02 fail; 07-03 rest
    expect(summary).toContain('6.0h');
    expect(summary).toContain('1234 XP');
  });

  it('carries day verdicts, hours and postponed labels', () => {
    const data = (importV2State(v2Fixture()) as NonNullable<ReturnType<typeof importV2State>>).data;
    expect(data.days['2026-07-01']).toMatchObject({ kind: 'study', verdict: 'pass', hoursLogged: 2.5 });
    expect(data.days['2026-07-02']).toMatchObject({ verdict: 'fail', hoursLogged: 3 });
    expect(data.days['2026-07-03']).toMatchObject({ verdict: 'rest' });
    expect(data.days['2026-07-05']).toMatchObject({ kind: 'postponed' });
    expect(data.postponed['2026-07-05']).toBe('guardian visit');
    // 2026-07-05 is a Sunday -> sunday kind for non-postponed would apply; postponed wins.
    expect(data.days['2026-07-01'].itemIds).toEqual([]);
  });

  it('converts focusLog minutes into sorted focusSessions', () => {
    const data = (importV2State(v2Fixture()) as NonNullable<ReturnType<typeof importV2State>>).data;
    expect(data.focusSessions).toEqual([
      { date: '2026-07-01', minutes: 90, strict: false },
      { date: '2026-07-02', minutes: 45, strict: false },
    ]);
  });

  it('rejects a v4 export, a random object, and malformed JSON', () => {
    expect(importV2State(defaultData())).toBeNull(); // v4 shape has no v2 markers
    expect(importV2State({ hello: 'world' })).toBeNull();
    expect(importV2State(null)).toBeNull();
    expect(importV2('{not json')).toBeNull();
  });

  it('survives partial/garbage fields without throwing', () => {
    const res = importV2State({
      settings: { bedtime: 99, wdTarget: Number.NaN },
      hours: { 'not-a-date': 5, '2026-07-01': 'garbage' },
      badLog: 'oops',
      focusLog: { '2026-07-01': -10 },
      restTokens: 'many',
    });
    expect(res).not.toBeNull();
    const data = (res as NonNullable<ReturnType<typeof importV2State>>).data;
    expect(isValidAppData(data)).toBe(true);
    expect(data.settings.bedtime).toBe('03:00'); // 99 % 24
    expect(data.days['2026-07-01'].hoursLogged).toBe(0);
    expect(data.focusSessions).toEqual([]); // negative minutes dropped
    expect(data.insurance).toBe(1); // restTokens garbage -> default 1
  });
});
