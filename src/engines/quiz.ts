import type { QuizItem, PredictOutputItem, FillBlankItem } from '../data/quizzes/types';

/**
 * quiz.ts — delivery, scoring, gating (DESIGN.md §4, Phase 4).
 * Pure functions. No storage — the quiz store owns persistence.
 */

/** Deterministic-ish shuffle (Fisher–Yates); optionally seeded per retry. */
export function shuffled<T>(arr: readonly T[], seed = Date.now()): T[] {
  const out = [...arr];
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  const rnd = (): number => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * selectItems — format-interleaved selection: never two same-format items
 * adjacent (whenever a valid arrangement exists). Classic greedy: each step
 * places the most-remaining format that differs from the last placed one.
 * Reruns of a failed boss pass a different seed → re-rolled order
 * (decision 7: "immediate same-day retry with re-rolled variants").
 */
export function selectItems(items: readonly QuizItem[], count: number, seed = Date.now()): QuizItem[] {
  const picked = shuffled(items, seed).slice(0, Math.min(count, items.length));
  const pools = new Map<string, QuizItem[]>();
  for (const it of picked) {
    if (!pools.has(it.format)) pools.set(it.format, []);
    pools.get(it.format)!.push(it);
  }
  const out: QuizItem[] = [];
  let last: string | null = null;
  while (out.length < picked.length) {
    let bestFormat: string | null = null;
    for (const [fmt, pool] of pools) {
      if (fmt === last || pool.length === 0) continue;
      if (bestFormat === null || pool.length > pools.get(bestFormat)!.length) bestFormat = fmt;
    }
    if (bestFormat === null) {
      // every remaining item shares the last format — degenerate, append as-is
      for (const pool of pools.values()) out.push(...pool.splice(0));
      break;
    }
    out.push(pools.get(bestFormat)!.shift()!);
    last = bestFormat;
  }
  return out;
}

export interface Answered {
  itemId: string;
  correct: boolean;
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/\s+/g, ' ').replace(/[ \t]*\n[ \t]*/g, '\n').trim();
}

/** Per-item check — each format knows how to grade its own answer shape. */
export function isCorrect(item: QuizItem, answer: unknown): boolean {
  switch (item.format) {
    case 'mcq':
    case 'why-crash':
      return answer === item.answer;
    case 'find-bug':
      return answer === item.answerLine;
    case 'predict-output': {
      const p = item as PredictOutputItem;
      const a = normalize(String(answer));
      return normalize(p.answer) === a || (p.accepts ?? []).some((x) => normalize(x) === a);
    }
    case 'fill-blank': {
      const f = item as FillBlankItem;
      if (!Array.isArray(answer) || answer.length !== f.answers.length) return false;
      return f.answers.every((accepted, i) => accepted.some((x) => normalize(x) === normalize(String(answer[i] ?? ''))));
    }
    case 'match': {
      // answer: Record<leftIndex, rightIndex>
      if (typeof answer !== 'object' || answer === null) return false;
      const rec = answer as Record<number, number>;
      return item.pairs.every((_, i) => rec[i] === i);
    }
    case 'ordering': {
      // answer: array of original step indexes in the user's chosen order
      if (!Array.isArray(answer)) return false;
      return item.steps.every((_, i) => answer[i] === i);
    }
    case 'fix-code':
      return answer === true; // honor-system confirm after running the fixed code
  }
}

export interface ScoreResult {
  correct: number;
  total: number;
  pct: number;
  passed: boolean;
  missed: QuizItem[];
}

export function score(items: readonly QuizItem[], answers: readonly Answered[], passMark: number): ScoreResult {
  const byId = new Map(answers.map((a) => [a.itemId, a.correct]));
  let correct = 0;
  const missed: QuizItem[] = [];
  for (const it of items) {
    const ok = byId.get(it.id) === true;
    if (ok) correct += 1;
    else missed.push(it);
  }
  const total = items.length;
  const pct = total === 0 ? 0 : correct / total;
  return { correct, total, pct, passed: pct >= passMark, missed };
}

/* ── XP for quizzes (xp.ts consts: pass 25, first-try bonus 15) ── */

export function quizXp(attemptsBefore: number, passed: boolean): number {
  if (!passed) return 0;
  return attemptsBefore === 0 ? 25 + 15 : 25;
}

/* ── Boss gate status ── */

export interface GateStatus {
  passed: boolean;
  best: number; // best pct so far
  attempts: number;
}

export function gateStatus(setId: string, results: Readonly<Record<string, { best: number; attempts: number; lastAt: string }>>): GateStatus {
  const r = results[setId];
  return { passed: (r?.best ?? 0) >= 80, best: r?.best ?? 0, attempts: r?.attempts ?? 0 };
}
