import type { QuizSet } from './types';
import { s00Items } from './s00';
import { s01Items } from './s01';
import { s02Items } from './s02';
import { s03Items } from './s03';
import { s04Items } from './s04';
import { s05Items } from './s05';
import { s06Items } from './s06';
import { s07Items } from './s07';
import { s08Items } from './s08';
import { s09Items } from './s09';
import { s10Items } from './s10';
import { s11Items } from './s11';
import { s12Items } from './s12';
import { s13Items } from './s13';
import { s14Items } from './s14';
import { s15Items } from './s15';
import { s16Items } from './s16';
import { s17Items } from './s17';
import { formatProbeSet } from './probe';
import { bossP1Set } from './bossP1';
import { bossP2Set } from './bossP2';
import { bossP3Set } from './bossP3';
import { bossP4Set } from './bossP4';

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
const s07Set = tortureSet('q.s07', 'Torture Tests — S07 · Complexity Toolkit', 's07', s07Items);
const s08Set = tortureSet('q.s08', 'Torture Tests — S08 · Linear Data Structures I', 's08', s08Items);
const s09Set = tortureSet('q.s09', 'Torture Tests — S09 · Linear Data Structures II', 's09', s09Items);
const s10Set = tortureSet('q.s10', 'Torture Tests — S10 · Non-Linear Data Structures', 's10', s10Items);
const s11Set = tortureSet('q.s11', 'Torture Tests — S11 · Graphs', 's11', s11Items);
const s12Set = tortureSet('q.s12', 'Torture Tests — S12 · Sorting & Searching', 's12', s12Items);
const s13Set = tortureSet('q.s13', 'Torture Tests — S13 · Recursion & Backtracking', 's13', s13Items);
const s14Set = tortureSet('q.s14', 'Torture Tests — S14 · Dynamic Programming', 's14', s14Items);
const s15Set = tortureSet('q.s15', 'Torture Tests — S15 · Greedy & Heaps', 's15', s15Items);
const s16Set = tortureSet('q.s16', 'Torture Tests — S16 · Interview Patterns Sprint', 's16', s16Items);
const s17Set = tortureSet('q.s17', 'Torture Tests — S17 · Capstone Portfolio Build', 's17', s17Items);

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
  [s07Set.id]: s07Set,
  [s08Set.id]: s08Set,
  [s09Set.id]: s09Set,
  [s10Set.id]: s10Set,
  [s11Set.id]: s11Set,
  [s12Set.id]: s12Set,
  [s13Set.id]: s13Set,
  [s14Set.id]: s14Set,
  [s15Set.id]: s15Set,
  [s16Set.id]: s16Set,
  [s17Set.id]: s17Set,
  [formatProbeSet.id]: formatProbeSet,
  [bossP1Set.id]: bossP1Set,
  [bossP2Set.id]: bossP2Set,
  [bossP3Set.id]: bossP3Set,
  [bossP4Set.id]: bossP4Set,
};

export function quizSetsForStage(stageId: string): QuizSet[] {
  return Object.values(QUIZ_SETS).filter(
    (s) => s.kind === 'torture' && s.stageIds.includes(stageId),
  );
}

export function bossSet(phaseId: string): QuizSet | undefined {
  return Object.values(QUIZ_SETS).find((s) => s.kind === 'boss' && s.id === `boss.${phaseId}`);
}
