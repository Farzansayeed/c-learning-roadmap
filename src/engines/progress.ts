import { STAGES } from '../data/curriculum';
import type { Phase, Stage } from '../data/curriculum/types';

/**
 * Progress model (Phase 2): an item = topic or drill. Checks live in the
 * store keyed by `stage:kind:id` — checkedIds is the source of truth.
 * Builds count as a single item (their acceptance list is rendered, not checked).
 */

export function itemsOfStage(s: Stage): { kind: 'topic' | 'drill'; id: string; label: string }[] {
  return [
    ...s.topics.map((t) => ({ kind: 'topic' as const, id: `${s.id}:t:${t.id}`, label: t.title })),
    ...s.drills.map((d) => ({ kind: 'drill' as const, id: `${s.id}:d:${d.id}`, label: d.title })),
  ];
}

export function stageProgress(s: Stage, checkedIds: ReadonlySet<string>): { done: number; total: number } {
  const items = itemsOfStage(s);
  return { done: items.filter((i) => checkedIds.has(i.id)).length, total: items.length };
}

export function phaseProgress(p: Phase, checkedIds: ReadonlySet<string>): { done: number; total: number } {
  let done = 0;
  let total = 0;
  for (const sid of p.stageIds) {
    const s = STAGES.find((x) => x.id === sid);
    if (!s) continue;
    const sp = stageProgress(s, checkedIds);
    done += sp.done;
    total += sp.total;
  }
  return { done, total };
}

export function globalProgress(checkedIds: ReadonlySet<string>): { done: number; total: number; pct: number } {
  let done = 0;
  let total = 0;
  for (const s of STAGES) {
    const sp = stageProgress(s, checkedIds);
    done += sp.done;
    total += sp.total;
  }
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}
