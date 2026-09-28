import type { QuizSet } from './types';
import { s03Items } from './s03';
import { formatProbeSet } from './probe';
import { bossP1Set } from './bossP1';

const s03Set: QuizSet = {
  id: 'q.s03',
  kind: 'torture',
  title: 'Torture Tests — S03 · The Memory Model',
  stageIds: ['s03'],
  passMark: 0.8,
  items: s03Items,
};

/**
 * Quiz registry — set id → content. Phases 5/8 fill the remaining stages;
 * the Arena renders whatever exists and marks the rest "authoring soon".
 */
export const QUIZ_SETS: Record<string, QuizSet> = {
  [s03Set.id]: s03Set,
  [formatProbeSet.id]: formatProbeSet,
  [bossP1Set.id]: bossP1Set,
};

export function quizSetsForStage(stageId: string): QuizSet[] {
  return Object.values(QUIZ_SETS).filter(
    (s) => s.kind === 'torture' && s.stageIds.includes(stageId),
  );
}

export function bossSet(phaseId: string): QuizSet | undefined {
  return Object.values(QUIZ_SETS).find((s) => s.kind === 'boss' && s.id === `boss.${phaseId}`);
}
