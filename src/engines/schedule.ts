import { STAGES } from '../data/curriculum';
import type { Stage } from '../data/curriculum/types';
import type { AppData, DayKind } from '../lib/schema';

/**
 * schedule.ts — the daily engine (PHASES Phase 3).
 * Ported from v2's buildSchedule(): stage items flow onto days at a pace
 * derived from the stage's day budget; Sundays carry milestone/review duty;
 * postpones shift everything; two consecutive fully-ghosted past days arm
 * a catch-up day that drains the carry queue.
 *
 * Pure function: (data, todayKey) -> entries. No DOM, no storage.
 */

export interface DayEntry {
  key: string; // YYYY-MM-DD
  kind: DayKind;
  stageId: string | null;
  itemIds: string[]; // curriculum item ids ('s03:t:s03.t4' shape from progress.ts)
  /** index into the schedule (0 = start date) */
  offset: number;
}

export interface ScheduleItem {
  id: string;
  stageId: string;
  label: string;
  kind: 'topic' | 'drill';
}

/** Flat, ordered work queue across all stages (topics then drills per stage). */
export function workQueue(): ScheduleItem[] {
  const out: ScheduleItem[] = [];
  for (const s of STAGES) {
    for (const t of s.topics) out.push({ id: `${s.id}:t:${t.id}`, stageId: s.id, label: t.title, kind: 'topic' });
    for (const d of s.drills) out.push({ id: `${s.id}:d:${d.id}`, stageId: s.id, label: d.title, kind: 'drill' });
  }
  return out;
}

const SUNDAY = 0;

export function addDaysISO(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + n);
  const p = (x: number) => (x < 10 ? '0' : '') + x;
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function dayOfWeek(iso: string): number {
  return new Date(iso + 'T00:00:00').getDay();
}

/** Pace: how many queue items a work-day consumes for a given stage. */
function paceFor(stage: Stage, stageItemCount: number): number {
  const days = Math.max(1, stage.days);
  const perWorkDay = days * (6 / 7); // 6 work days per week (Sunday is separate)
  return Math.max(1, Math.ceil(stageItemCount / perWorkDay));
}

export interface ScheduleOptions {
  /** max days to generate (default covers the whole curriculum) */
  horizon?: number;
}

/**
 * Build the day-by-day schedule from the start date.
 * - Sunday => 'sunday' day (milestone/review; carries no new queue items)
 * - postponed date keys => 'postponed' (no items; queue pauses)
 * - 2 consecutive ghosted PAST study days => next day is 'catchup' draining carry
 */
export function buildSchedule(data: AppData, today: string, opts: ScheduleOptions = {}): DayEntry[] {
  const horizon = opts.horizon ?? 500;
  const queue = workQueue();
  const byStage = new Map<string, ScheduleItem[]>();
  for (const it of queue) {
    if (!byStage.has(it.stageId)) byStage.set(it.stageId, []);
    byStage.get(it.stageId)!.push(it);
  }

  // pace per stage: items per work-day
  const pace = new Map<string, number>();
  for (const s of STAGES) {
    pace.set(s.id, paceFor(s, (byStage.get(s.id) ?? []).length));
  }

  const entries: DayEntry[] = [];
  let si = 0; // stage index
  let take = pace.get(STAGES[0]?.id ?? '') ?? 2;
  let carry: ScheduleItem[] = [];
  let ghostStreak = 0;
  let catchupArmed = false;
  let done = false;

  for (let offset = 0; offset < horizon && !done; offset++) {
    const key = addDaysISO(data.startDate, offset);
    const dow = dayOfWeek(key);

    const entry: DayEntry = { key, kind: 'study', stageId: null, itemIds: [], offset };

    if (dow === SUNDAY) {
      entry.kind = 'sunday';
      entry.stageId = null;
      // Sunday carries remaining carry items (review duty) but no new pulls
      entry.itemIds = carry.map((c) => c.id);
    } else if (data.postponed[key]) {
      entry.kind = 'postponed';
      ghostStreak = 0;
    } else if (catchupArmed) {
      entry.kind = 'catchup';
      entry.itemIds = carry.map((c) => c.id);
      carry = [];
      catchupArmed = false;
    } else {
      // pull NEW items (carry stacks on top — v2 debt semantics)
      const own: ScheduleItem[] = [];
      while (own.length < take) {
        const stage = STAGES[si];
        if (!stage) {
          done = true;
          break;
        }
        const q = byStage.get(stage.id) ?? [];
        if (q.length === 0) {
          si += 1;
          take = pace.get(STAGES[si]?.id ?? '') ?? take;
          continue;
        }
        own.push(q.shift()!);
      }
      const dayItems = [...carry, ...own];
      entry.stageId = own[0]?.stageId ?? STAGES[si]?.id ?? null;
      entry.itemIds = dayItems.map((p) => p.id);

      // ghost detection for PAST study days
      if (key < today) {
        const doneCount = dayItems.filter((p) => data.checked[p.id]).length;
        if (dayItems.length > 0 && doneCount === 0) {
          ghostStreak += 1;
          if (ghostStreak >= 2) {
            catchupArmed = true;
            ghostStreak = 0;
          }
        } else {
          ghostStreak = 0;
        }
      }

      // unchecked items roll into carry (debt)
      carry = dayItems.filter((p) => !data.checked[p.id]);
    }

    if (entry.kind !== 'sunday' || entry.itemIds.length > 0 || offset < 7) {
      entries.push(entry);
    }
    if (si >= STAGES.length && carry.length === 0) done = true;
  }

  return entries;
}

/** Today's entry (or nearest past entry if today is a rest/sunday with no items). */
export function entryFor(entries: DayEntry[], key: string): DayEntry | undefined {
  return entries.find((e) => e.key === key);
}

/** The current "working day". Today's entry always wins — a postponed or
 *  review day must be shown truthfully, never silently replaced by
 *  yesterday's stack. Only when today has no entry at all do we fall back
 *  to the latest past study/catch-up day.
 */
export function workingDay(entries: DayEntry[], today: string): DayEntry | undefined {
  const t = entryFor(entries, today);
  if (t) return t;
  const past = entries.filter((e) => e.key <= today && (e.kind === 'study' || e.kind === 'catchup'));
  return past[past.length - 1];
}
