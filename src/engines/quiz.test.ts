import { describe, expect, it } from 'vitest';
import { isCorrect, quizXp, selectItems, score } from './quiz';
import type { QuizItem } from '../data/quizzes/types';

const items: QuizItem[] = [
  { id: 'a', stageId: 's03', format: 'mcq', difficulty: 1, targets: 'x', explanation: 'e', prompt: 'p', options: ['a', 'b'], answer: 1 },
  { id: 'b', stageId: 's03', format: 'mcq', difficulty: 1, targets: 'x', explanation: 'e', prompt: 'p', options: ['a', 'b'], answer: 0 },
  { id: 'c', stageId: 's03', format: 'predict-output', difficulty: 1, targets: 'x', explanation: 'e', prompt: 'p', code: 'x', answer: '20' },
  { id: 'd', stageId: 's03', format: 'predict-output', difficulty: 1, targets: 'x', explanation: 'e', prompt: 'p', code: 'x', answer: '5 2' },
  { id: 'e', stageId: 's03', format: 'find-bug', difficulty: 1, targets: 'x', explanation: 'e', prompt: 'p', code: 'x', answerLine: 3 },
  { id: 'f', stageId: 's03', format: 'ordering', difficulty: 1, targets: 'x', explanation: 'e', prompt: 'p', steps: ['1', '2', '3'] },
];

describe('quiz engine', () => {
  it('selectItems never places two same-format items adjacent', () => {
    for (const seed of [1, 42, 999, 12345, 777]) {
      const sel = selectItems(items, items.length, seed);
      for (let i = 1; i < sel.length; i++) {
        expect(sel[i].format, `seed ${seed} idx ${i}`).not.toBe(sel[i - 1].format);
      }
    }
  });

  it('selectItems honors count and reseeds differently (re-rolled retries)', () => {
    const big: QuizItem[] = Array.from({ length: 40 }, (_, i) =>
      i % 2 === 0
        ? {
            id: `i${i}`, stageId: 's03', format: 'mcq' as const, difficulty: 1 as const,
            targets: 'x', explanation: 'e', prompt: 'p', options: ['a'], answer: 0,
          }
        : {
            id: `i${i}`, stageId: 's03', format: 'predict-output' as const, difficulty: 1 as const,
            targets: 'x', explanation: 'e', prompt: 'p', code: 'x', answer: 'x',
          },
    );
    const sel = selectItems(big, 10, 1);
    expect(sel).toHaveLength(10);
    const s1 = selectItems(big, 10, 1).map((i) => i.id).join(',');
    const s2 = selectItems(big, 10, 2).map((i) => i.id).join(',');
    expect(s1).not.toBe(s2);
  });

  it('grades every format correctly', () => {
    const mcq = items[0];
    expect(isCorrect(mcq, 1)).toBe(true);
    expect(isCorrect(mcq, 0)).toBe(false);
    const po = items[2];
    expect(isCorrect(po, '20')).toBe(true);
    expect(isCorrect(po, '  20 ')).toBe(true); // normalized
    expect(isCorrect(po, '21')).toBe(false);
    const fb = items[4];
    expect(isCorrect(fb, 3)).toBe(true);
    expect(isCorrect(fb, 2)).toBe(false);
    const ord = items[5];
    expect(isCorrect(ord, [0, 1, 2])).toBe(true);
    expect(isCorrect(ord, [1, 0, 2])).toBe(false);
  });

  it('predict-output accepts alternates case-insensitively', () => {
    const po: QuizItem = {
      id: 'x', stageId: 's03', format: 'predict-output', difficulty: 1, targets: 'x', explanation: 'e',
      prompt: 'p', code: 'x', answer: 'garbage (uninitialized value)', accepts: ['garbage', 'undefined'],
    };
    expect(isCorrect(po, 'GARBAGE')).toBe(true);
    expect(isCorrect(po, 'Undefined')).toBe(true);
    expect(isCorrect(po, 'segfault')).toBe(false);
  });

  it('fill-blank grades blank-by-blank with accepted variants', () => {
    const fb: QuizItem = {
      id: 'y', stageId: 's03', format: 'fill-blank', difficulty: 1, targets: 'x', explanation: 'e',
      prompt: 'p', code: 'x', answers: [['malloc'], ['free']],
    };
    expect(isCorrect(fb, ['malloc', 'free'])).toBe(true);
    expect(isCorrect(fb, [' MALLOC ', 'Free'])).toBe(true);
    expect(isCorrect(fb, ['malloc', 'delete'])).toBe(false);
    expect(isCorrect(fb, ['malloc'])).toBe(false); // wrong arity
  });

  it('scores against passMark and lists missed items', () => {
    const answers = [
      { itemId: 'a', correct: true },
      { itemId: 'b', correct: true },
      { itemId: 'c', correct: false },
      { itemId: 'd', correct: false },
      { itemId: 'e', correct: true },
      { itemId: 'f', correct: true },
    ];
    const r = score(items, answers, 0.8);
    expect(r.correct).toBe(4);
    expect(r.total).toBe(6);
    expect(r.passed).toBe(false); // 4/6 = 66.7% < 80%
    expect(r.missed.map((m) => m.id)).toEqual(['c', 'd']);
    const r2 = score(items, answers.map((a) => ({ ...a, correct: a.itemId !== 'c' })), 0.8);
    expect(r2.passed).toBe(true); // 5/6 = 83%
  });

  it('XP: first-try pass gets the bonus, retries do not, fails earn nothing', () => {
    expect(quizXp(0, true)).toBe(40);
    expect(quizXp(1, true)).toBe(25);
    expect(quizXp(3, true)).toBe(25);
    expect(quizXp(0, false)).toBe(0);
  });
});
