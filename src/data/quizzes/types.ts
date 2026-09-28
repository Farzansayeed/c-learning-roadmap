/**
 * Quiz item types (DESIGN.md §3.4, Phase 4).
 * Discriminated union on `format` — one renderer per shape, typos are
 * compile errors (the whole reason the curriculum is typed data).
 */

export type QuizFormat =
  | 'mcq'
  | 'find-bug'
  | 'predict-output'
  | 'why-crash'
  | 'fill-blank'
  | 'match'
  | 'ordering'
  | 'fix-code';

interface QuizItemBase {
  /** 'q.sNN.N' — must match the quizRefs used by curriculum topics/traps. */
  id: string;
  stageId: string;
  format: QuizFormat;
  /** 1 = gentle, 3 = boss-worthy. */
  difficulty: 1 | 2 | 3;
  /** The trap or topic this item tortures — shown in review and on failure. */
  targets: string;
  /** The "why" — shown after answering, win or lose. One honest sentence. */
  explanation: string;
  /** Micro-resource the user is pointed at when they miss it. */
  remedyUrl?: string;
  remedyLabel?: string;
}

export interface McqItem extends QuizItemBase {
  format: 'mcq';
  prompt: string;
  options: string[];
  answer: number; // index into options
}

export interface FindBugItem extends QuizItemBase {
  format: 'find-bug';
  prompt: string;
  code: string;
  /** 1-based line number of the bug. */
  answerLine: number;
}

export interface PredictOutputItem extends QuizItemBase {
  format: 'predict-output';
  prompt: string;
  code: string;
  /** Normalized before comparison (case/whitespace-insensitive). */
  answer: string;
  /** Acceptable alternates, normalized the same way. */
  accepts?: string[];
}

export interface WhyCrashItem extends QuizItemBase {
  format: 'why-crash';
  prompt: string;
  code: string;
  options: string[];
  answer: number;
}

export interface FillBlankItem extends QuizItemBase {
  format: 'fill-blank';
  prompt: string;
  /** Use ___ to mark the blank(s). */
  code: string;
  /** Accepted answers per blank, all normalized-equal. */
  answers: string[][];
}

export interface MatchItem extends QuizItemBase {
  format: 'match';
  prompt: string;
  pairs: { left: string; right: string }[];
}

export interface OrderingItem extends QuizItemBase {
  format: 'ordering';
  prompt: string;
  /** Presented shuffled to the user; stored in correct order. */
  steps: string[];
}

export interface FixCodeItem extends QuizItemBase {
  format: 'fix-code';
  prompt: string;
  code: string;
  /** Deep-link mode: pre-filled exercise on an online compiler + honor checkbox. */
  runnerUrl: string;
  runnerName: string;
  /** What a correct fix looks like — shown after the user confirms. */
  solutionNote: string;
}

export type QuizItem =
  | McqItem
  | FindBugItem
  | PredictOutputItem
  | WhyCrashItem
  | FillBlankItem
  | MatchItem
  | OrderingItem
  | FixCodeItem;

export interface QuizSet {
  id: string; // 'q.s03' set id or 'boss.p1'
  kind: 'torture' | 'boss';
  title: string;
  stageIds: string[];
  passMark: number; // 0..1
  items: QuizItem[];
}
