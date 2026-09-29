import { describe, it, expect } from 'vitest';
import { QUIZ_SETS } from './index';
import { BLUEPRINT, BOSS_BLUEPRINT, COVERED_STAGES, COVERED_BOSSES } from './blueprint';
import { isCorrect } from '../../engines/quiz';
import type { QuizItem, McqItem, FindBugItem, PredictOutputItem, FillBlankItem, WhyCrashItem } from './types';

/**
 * Blueprint validator (PHASES.md Phase 5): content incomplete = CI red.
 * Enforces Appendix A counts, unique ids, and per-format structural
 * invariants so no authoring slip can ship a broken item.
 */

function allTortureItems(): QuizItem[] {
  return Object.values(QUIZ_SETS)
    .filter((s) => s.kind === 'torture' && s.id !== 'q.probe')
    .flatMap((s) => s.items);
}

describe('quiz blueprint', () => {
  it('every COVERED stage has exactly its Appendix A count', () => {
    for (const stageId of COVERED_STAGES) {
      const count = BLUEPRINT[stageId];
      expect(count, `${stageId} covered but not in BLUEPRINT`).toBeDefined();
      const items = allTortureItems().filter((i) => i.stageId === stageId);
      expect(items, `${stageId} has ${items.length} items, blueprint says ${count}`).toHaveLength(count);
    }
  });

  it('no torture item exists outside the blueprint stages', () => {
    const known = new Set(Object.keys(BLUEPRINT));
    const strays = allTortureItems().filter((i) => !known.has(i.stageId));
    expect(strays, `stray stageIds: ${strays.map((i) => i.stageId).join(', ')}`).toHaveLength(0);
  });

  it('covered boss exams exist with exact counts', () => {
    for (const setId of COVERED_BOSSES) {
      const count = BOSS_BLUEPRINT[setId];
      const set = QUIZ_SETS[setId];
      expect(set, `${setId} missing from QUIZ_SETS`).toBeDefined();
      expect(set!.kind).toBe('boss');
      expect(set!.items).toHaveLength(count);
      expect(set!.passMark).toBe(0.8);
    }
  });

  it('all item ids are unique across every set', () => {
    const ids = Object.values(QUIZ_SETS).flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every COVERED stage has a registered torture set', () => {
    for (const stageId of COVERED_STAGES) {
      const sets = Object.values(QUIZ_SETS).filter(
        (s) => s.kind === 'torture' && s.id !== 'q.probe' && s.stageIds.includes(stageId),
      );
      expect(sets.length, `no torture set registered for ${stageId}`).toBeGreaterThan(0);
    }
  });

  it('every item has explanation, targets, difficulty 1–3', () => {
    for (const item of Object.values(QUIZ_SETS).flatMap((s) => s.items)) {
      expect(item.explanation.length, `${item.id} missing explanation`).toBeGreaterThan(10);
      expect(item.targets.length, `${item.id} missing targets`).toBeGreaterThan(3);
      expect([1, 2, 3]).toContain(item.difficulty);
    }
  });

  /* ── per-format structural invariants ────────────────────── */

  it('mcq/why-crash: answer index in bounds, distractors unique', () => {
    for (const item of allTortureItems().concat(
      Object.values(QUIZ_SETS).filter((s) => s.kind === 'boss').flatMap((s) => s.items),
    )) {
      if (item.format === 'mcq' || item.format === 'why-crash') {
        const it = item as McqItem | WhyCrashItem;
        expect(it.options.length, `${it.id} needs >= 2 options`).toBeGreaterThanOrEqual(2);
        expect(it.answer, `${it.id} answer out of range`).toBeGreaterThanOrEqual(0);
        expect(it.answer, `${it.id} answer out of range`).toBeLessThan(it.options.length);
        expect(new Set(it.options).size, `${it.id} has duplicate options`).toBe(it.options.length);
      }
    }
  });

  it('find-bug: answerLine within the code block, code has that many lines', () => {
    for (const item of allTortureItems().concat(
      Object.values(QUIZ_SETS).filter((s) => s.kind === 'boss').flatMap((s) => s.items),
    )) {
      if (item.format === 'find-bug') {
        const it = item as FindBugItem;
        const lines = it.code.split('\n');
        expect(it.answerLine, `${it.id} answerLine out of range`).toBeGreaterThanOrEqual(1);
        expect(it.answerLine, `${it.id} answerLine ${it.answerLine} > ${lines.length} lines`).toBeLessThanOrEqual(lines.length);
      }
    }
  });

  it('fill-blank: ___ count matches answer groups, all non-empty', () => {
    for (const item of allTortureItems().concat(
      Object.values(QUIZ_SETS).filter((s) => s.kind === 'boss').flatMap((s) => s.items),
    )) {
      if (item.format === 'fill-blank') {
        const it = item as FillBlankItem;
        const blanks = it.code.split('___').length - 1;
        expect(blanks, `${it.id} has ${blanks} blanks but ${it.answers.length} answer groups`).toBe(it.answers.length);
        expect(blanks, `${it.id} needs at least one blank`).toBeGreaterThan(0);
        for (const group of it.answers) {
          expect(group.length, `${it.id} empty answer group`).toBeGreaterThan(0);
          for (const a of group) expect(a.trim().length, `${it.id} blank-only answer`).toBeGreaterThan(0);
        }
      }
    }
  });

  it('predict-output: answer non-empty', () => {
    for (const item of allTortureItems()) {
      if (item.format === 'predict-output') {
        const it = item as PredictOutputItem;
        expect(it.answer.trim().length, `${it.id} empty answer`).toBeGreaterThan(0);
      }
    }
  });

  it('fix-code: runner wired, solution note present', () => {
    for (const item of allTortureItems().concat(
      Object.values(QUIZ_SETS).filter((s) => s.kind === 'boss').flatMap((s) => s.items),
    )) {
      if (item.format === 'fix-code') {
        expect(item.runnerUrl.startsWith('http'), `${item.id} runnerUrl`).toBe(true);
        expect(item.runnerName.length, `${item.id} runnerName`).toBeGreaterThan(0);
        expect(item.solutionNote.length, `${item.id} solutionNote`).toBeGreaterThan(10);
      }
    }
  });

  it('ordering/match: at least 3 elements, distinct', () => {
    for (const item of allTortureItems().concat(
      Object.values(QUIZ_SETS).filter((s) => s.kind === 'boss').flatMap((s) => s.items),
    )) {
      if (item.format === 'ordering') {
        expect(item.steps.length, `${item.id} needs >= 3 steps`).toBeGreaterThanOrEqual(3);
        expect(new Set(item.steps).size, `${item.id} duplicate steps`).toBe(item.steps.length);
      }
      if (item.format === 'match') {
        expect(item.pairs.length, `${item.id} needs >= 3 pairs`).toBeGreaterThanOrEqual(3);
      }
    }
  });

  /* ── engine spot-checks on real authored answers ─────────── */

  it('spot-check: authored mcq answers grade correct through isCorrect', () => {
    const samples = allTortureItems().filter((i) => i.format === 'mcq') as McqItem[];
    for (const it of samples) {
      expect(isCorrect(it, it.answer), `${it.id} should grade its own answer correct`).toBe(true);
    }
  });

  it('spot-check: authored fill-blank first accepted answers grade correct', () => {
    const samples = allTortureItems().filter((i) => i.format === 'fill-blank') as FillBlankItem[];
    for (const it of samples) {
      const firsts = it.answers.map((g) => g[0]);
      expect(isCorrect(it, firsts), `${it.id} should accept its first answers`).toBe(true);
    }
  });

  it('spot-check: authored predict-output answers grade correct', () => {
    const samples = allTortureItems().filter((i) => i.format === 'predict-output') as PredictOutputItem[];
    for (const it of samples) {
      expect(isCorrect(it, it.answer), `${it.id} should accept its own answer`).toBe(true);
    }
  });
});
