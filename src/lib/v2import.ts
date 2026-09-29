/**
 * v2import.ts — one-way migration from the legacy v2 tracker
 * (single-file app, localStorage key 'c-learning-roadmap-v1').
 *
 * v2 kept flat maps (hours, closedDays, badLog, postponed, focusLog) keyed by
 * 'YYYY-MM-DD', hour-number bedtime, and `restTokens`. v4 keeps per-day
 * DayRecords, 'HH:MM' bedtime, focusSessions[], and `insurance`.
 *
 * Checked/notes item ids are curriculum-coupled (v2 used `sNN:tM` ids, v4 uses
 * a different curriculum), so task-level progress does NOT carry — hours,
 * verdicts, postponed excuses, focus minutes, XP, pardons and insurance do.
 * Everything is defensive: garbage in, `null` out, never a throw.
 */

import { SCHEMA_VERSION, todayKey, type AppData, type DayRecord, type Verdict } from './schema';

interface V2BadLogEntry {
  verdict?: unknown;
  hours?: unknown;
  target?: unknown;
  closedAt?: unknown;
}

export interface V2ImportResult {
  data: AppData;
  /** one-line human summary for the settings toast */
  summary: string;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function num(v: unknown, fallback: number): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function dateKeyLike(v: unknown): v is string {
  return typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function mapVerdict(raw: V2BadLogEntry): Verdict | undefined {
  switch (raw.verdict) {
    case 'pass':
      return 'pass';
    case 'fail':
      return 'fail';
    case 'rest':
      return 'rest';
    default:
      return undefined;
  }
}

/** Map a legacy v2 state object into v4 AppData. Returns null if unusable. */
export function importV2State(raw: unknown): V2ImportResult | null {
  if (!isRecord(raw)) return null;

  // Marker gate: a genuine v2 export has v2-named settings (wdTarget/suTarget)
  // or at least one of the flat day maps. A v4 export (weekdayTarget/days)
  // or a random JSON file fails here instead of mapping to silent defaults.
  // (bedtime exists in BOTH schemas so it proves nothing — not a marker.)
  const s0 = isRecord(raw.settings) ? raw.settings : {};
  const hasV2Settings = 'wdTarget' in s0 || 'suTarget' in s0;
  const hasV2Maps = ['hours', 'closedDays', 'badLog', 'focusLog', 'restTokens'].some(
    (k) => k in raw,
  );
  if (!hasV2Settings && !hasV2Maps) return null;

  // Settings — bedtime was an hour number (23) in v2; suTarget→sundayTarget.
  const s = s0;
  const wdTarget = Math.min(16, Math.max(0.5, num(s.wdTarget, 3)));
  const suTarget = Math.min(16, Math.max(0, num(s.suTarget, 6.5)));
  const bedHour = Math.round(num(s.bedtime, 23.5)) % 24;
  const bedtime = `${String(bedHour).padStart(2, '0')}:00`;

  const days: Record<string, DayRecord> = {};
  const hours = isRecord(raw.hours) ? raw.hours : {};
  const closedDays = isRecord(raw.closedDays) ? raw.closedDays : {};
  const badLog = isRecord(raw.badLog) ? raw.badLog : {};
  const postponed = isRecord(raw.postponed) ? raw.postponed : {};

  const keys = new Set<string>([
    ...Object.keys(hours),
    ...Object.keys(closedDays),
    ...Object.keys(badLog),
    ...Object.keys(postponed),
  ]);
  let passes = 0;
  let fails = 0;
  let totalHours = 0;
  for (const k of keys) {
    if (!dateKeyLike(k)) continue;
    const log = isRecord(badLog[k]) ? (badLog[k] as V2BadLogEntry) : {};
    const isPostponed = Boolean(postponed[k]);
    const verdict = isPostponed ? 'postponed' : mapVerdict(log);
    const h = num(hours[k], 0) || num(log.hours, 0);
    totalHours += h;
    if (verdict === 'pass') passes++;
    if (verdict === 'fail') fails++;
    const dow = new Date(Number(k.slice(0, 4)), Number(k.slice(5, 7)) - 1, Number(k.slice(8, 10))).getDay();
    days[k] = {
      key: k,
      kind: isPostponed ? 'postponed' : dow === 0 ? 'sunday' : 'study',
      itemIds: [],
      hoursLogged: Math.round(h * 100) / 100,
      verdict,
      closedAt: typeof log.closedAt === 'string' ? log.closedAt : undefined,
    };
  }

  // focusLog: dateKey -> minutes. focusSessions needs a stable order.
  const focusSessions: AppData['focusSessions'] = [];
  if (isRecord(raw.focusLog)) {
    for (const [k, v] of Object.entries(raw.focusLog)) {
      const minutes = num(v, 0);
      if (dateKeyLike(k) && minutes > 0) focusSessions.push({ date: k, minutes: Math.round(minutes), strict: false });
    }
    focusSessions.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
  }

  const data: AppData = {
    version: SCHEMA_VERSION,
    startDate: dateKeyLike(raw.startDate) ? raw.startDate : todayKey(),
    settings: {
      weekdayTarget: wdTarget,
      sundayTarget: suTarget,
      bedtime,
      roastIntensity: 'spicy',
      theme: 'terminal',
    },
    // Curriculum-coupled maps: carried as-is; ids from the v2 curriculum that
    // do not exist in v4 simply never match an item and stay inert.
    checked: isRecord(raw.checked) ? (raw.checked as AppData['checked']) : {},
    notes: isRecord(raw.notes) ? (raw.notes as AppData['notes']) : {},
    days,
    postponed: isRecord(raw.postponed)
      ? Object.fromEntries(
          Object.entries(raw.postponed)
            .filter(([k]) => dateKeyLike(k))
            .map(([k, v]) => [k, isRecord(v) && typeof v.label === 'string' ? v.label : 'postponed']),
        )
      : {},
    customExcuses: Array.isArray(raw.customExcuses)
      ? raw.customExcuses.filter((x): x is string => typeof x === 'string')
      : [],
    xp: Math.max(0, Math.round(num(raw.xp, 0))),
    pardons: Math.max(0, Math.round(num(raw.pardons, 0))),
    insurance: Math.min(5, Math.max(0, Math.round(num(raw.restTokens, 1)))),
    quizResults: {},
    focusSessions,
    review: {},
  };

  const summary = `${passes} pass + ${fails} fail days, ${totalHours.toFixed(1)}h, ${data.xp} XP`;
  return { data, summary };
}

/** Parse a v2 export string (the raw localStorage JSON or a saved file). */
export function importV2(json: string): V2ImportResult | null {
  try {
    return importV2State(JSON.parse(json));
  } catch {
    return null;
  }
}
