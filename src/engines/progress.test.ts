import { describe, expect, it } from 'vitest';
import { STAGES, stageById } from '../data/curriculum';
import { globalProgress, itemsOfStage, phaseProgress, stageProgress } from './progress';

const s03 = stageById('s03')!;
const allIds = new Set(STAGES.flatMap((s) => itemsOfStage(s).map((i) => i.id)));

describe('progress engine', () => {
  it('counts topics + drills as items; build excluded (Phase 2 model)', () => {
    const items = itemsOfStage(s03);
    expect(items).toHaveLength(s03.topics.length + s03.drills.length);
    expect(items[0].id.startsWith('s03:t:')).toBe(true);
  });

  it('empty set → zero progress; full set → 100%', () => {
    expect(globalProgress(new Set()).pct).toBe(0);
    expect(globalProgress(allIds).pct).toBe(100);
  });

  it('checking one item moves both stage and global counts', () => {
    const first = itemsOfStage(STAGES[0])[0].id;
    const set = new Set([first]);
    expect(stageProgress(STAGES[0], set).done).toBe(1);
    expect(globalProgress(set).done).toBe(1);
  });

  it('phase progress = sum of its stages', () => {
    const p1 = PHASES_FIXTURE();
    const sum = p1.stageIds.reduce(
      (acc, sid) => acc + stageProgress(stageById(sid)!, allIds).done,
      0,
    );
    expect(phaseProgress(p1, allIds).done).toBe(sum);
    expect(phaseProgress(p1, allIds).total).toBe(sum);
  });
});

import { PHASES } from '../data/curriculum';
function PHASES_FIXTURE() {
  return PHASES[1];
}
