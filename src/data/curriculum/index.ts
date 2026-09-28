import type { Phase, Stage } from './types';
import { s00 } from './stages/s00';
import { s01 } from './stages/s01';
import { s02 } from './stages/s02';
import { s03 } from './stages/s03';
import { s04 } from './stages/s04';
import { s05 } from './stages/s05';
import { s06 } from './stages/s06';
import { s07 } from './stages/s07';
import { s08 } from './stages/s08';
import { s09 } from './stages/s09';
import { s10 } from './stages/s10';
import { s11 } from './stages/s11';
import { s12 } from './stages/s12';
import { s13 } from './stages/s13';
import { s14 } from './stages/s14';
import { s15 } from './stages/s15';
import { s16 } from './stages/s16';
import { s17 } from './stages/s17';
import { s18 } from './stages/s18';

export const STAGES: Stage[] = [
  s00, s01, s02, s03, s04, s05, s06, s07, s08,
  s09, s10, s11, s12, s13, s14, s15, s16, s17, s18,
];

export const PHASES: Phase[] = [
  { id: 'p0', num: 0, title: 'Launchpad', tagline: 'Toolchain and workflow — the anvil is set', stageIds: ['s00'], bossGateId: null },
  { id: 'p1', num: 1, title: 'C Fluency', tagline: 'Grammar, data, and the memory model', stageIds: ['s01', 's02', 's03'], bossGateId: 'boss.p1' },
  { id: 'p2', num: 2, title: 'Systems C', tagline: 'Structs, builds, bits — write C like a systems programmer', stageIds: ['s04', 's05', 's06'], bossGateId: 'boss.p2' },
  { id: 'p3', num: 3, title: 'Data Structures', tagline: 'Build every structure by hand', stageIds: ['s07', 's08', 's09', 's10', 's11'], bossGateId: 'boss.p3' },
  { id: 'p4', num: 4, title: 'Algorithms & Interview Core', tagline: 'Sorting, backtracking, DP, greedy', stageIds: ['s12', 's13', 's14', 's15'], bossGateId: 'boss.p4' },
  { id: 'p5', num: 5, title: 'Interview Endgame', tagline: 'Patterns, capstone, the metronome', stageIds: ['s16', 's17', 's18'], bossGateId: null },
];

export function stageById(id: string): Stage | undefined {
  return STAGES.find((s) => s.id === id);
}

export function phaseById(id: Phase['id']): Phase | undefined {
  return PHASES.find((p) => p.id === id);
}

export function stagesOfPhase(phaseId: Phase['id']): Stage[] {
  const p = phaseById(phaseId);
  if (!p) return [];
  return p.stageIds.map((sid) => stageById(sid)).filter((s): s is Stage => !!s);
}
