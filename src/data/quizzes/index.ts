import type { QuizSet } from './types';
import { s00Items } from './s00';
import { s01Items } from './s01';
import { s02Items } from './s02';
import { s03Items } from './s03';
import { s04Items } from './s04';
import { s05Items } from './s05';
import { s06Items } from './s06';
import { formatProbeSet } from './probe';
import { bossP1Set } from './bossP1';
import { bossP2Set } from './bossP2';

const s03Set: QuizSet = {
  id: 'q.s03',
  kind: 'torture',
  title: 'Torture Tests — S03 · The Memory Model',
  stageIds: ['s03'],
  passMark: 0.8,
  items: s03Items,
};

const tortureSet = (id: string, title: string, stageId: string, items: QuizSet['items']): QuizSet => ({
  id,
  kind: 'torture',
  title,
  stageIds: [stageId],
  passMark: 0.8,
  items,
});

const s00Set = tortureSet('q.s00', 'Torture Tests — S00 · Toolchain & Workflow', 's00', s00Items);
const s01Set = tortureSet('q.s01', 'Torture Tests — S01 · C Fundamentals I', 's01', s01Items);
const s02Set = tortureSet('q.s02', 'Torture Tests — S02 · C Fundamentals II', 's02', s02Items);
const s04Set = tortureSet('q.s04', 'Torture Tests — S04 · Structs & ADTs', 's04', s04Items);
const s05Set = tortureSet('q.s05', 'Torture Tests — S05 · Preprocessor & Builds', 's05', s05Items);
const s06Set = tortureSet('q.s06', 'Torture Tests — S06 · Bits & Low-Level Craft', 's06', s06Items);

/**
 * Quiz registry — set id → content. Phase 8 fills the remaining stages
 * (s07–s17); the Arena renders whatever exists and marks the rest
 * "authoring soon".
 */
export const QUIZ_SETS: Record<string, QuizSet> = {
  [s00Set.id]: s00Set,
  [s01Set.id]: s01Set,
  [s02Set.id]: s02Set,
  [s03Set.id]: s03Set,
  [s04Set.id]: s04Set,
  [s05Set.id]: s05Set,
  [s06Set.id]: s06Set,
  [formatProbeSet.id]: formatProbeSet,
  [bossP1Set.id]: bossP1Set,
  [bossP2Set.id]: bossP2Set,
};

export function quizSetsForStage(stageId: string): QuizSet[] {
  return Object.values(QUIZ_SETS).filter(
    (s) => s.kind === 'torture' && s.stageIds.includes(stageId),
  );
}

export function bossSet(phaseId: string): QuizSet | undefined {
  return Object.values(QUIZ_SETS).find((s) => s.kind === 'boss' && s.id === `boss.${phaseId}`);
}
