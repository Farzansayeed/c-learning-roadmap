import { describe, expect, it } from 'vitest';
import { PHASES, STAGES, stageById } from './index';
import { unusedResources, validateCurriculum } from './validate';

const report = validateCurriculum();

describe('curriculum integrity (Guardian reborn)', () => {
  it('has exactly 19 stages across 6 phases', () => {
    expect(STAGES).toHaveLength(19);
    expect(PHASES).toHaveLength(6);
  });

  it('passes full structural validation with zero issues', () => {
    const msg = report.issues.map((i) => `${i.code}: ${i.message}`).join('\n');
    expect(msg === '' ? 'clean' : msg).toBe('clean');
  });

  it('every stage has can-statements, topics, a build, and ≥3 traps (except s17)', () => {
    for (const s of STAGES) {
      expect(s.canStatements.length, `${s.id} canStatements`).toBeGreaterThan(0);
      expect(s.topics.length, `${s.id} topics`).toBeGreaterThan(0);
      expect(s.build.name.length, `${s.id} build`).toBeGreaterThan(0);
      if (s.id !== 's17') expect(s.traps.length, `${s.id} traps`).toBeGreaterThanOrEqual(3);
    }
  });

  it('S03 (memory model) carries the largest day budget in Phase 1', () => {
    const s03 = stageById('s03')!;
    const p1 = ['s01', 's02', 's03'].map((id) => stageById(id)!.days);
    expect(s03.days).toBe(Math.max(...p1));
    expect(s03.days).toBe(8);
  });

  it('the roadmap totals ≈112 day-budget days (±10%)', () => {
    expect(report.stats.totalDays).toBeGreaterThanOrEqual(101);
    expect(report.stats.totalDays).toBeLessThanOrEqual(123);
  });

  it('every stage quizRef space is prefixed by its stage id', () => {
    for (const s of STAGES) {
      for (const t of s.topics) {
        for (const q of t.quizRefs) {
          expect(q.startsWith(`q.${s.id}.`), `${t.id} -> ${q}`).toBe(true);
        }
      }
    }
  });

  it('thin concepts are rejected (≥40 chars enforced by validator)', () => {
    expect(report.issues.some((i) => i.code === 'THIN_CONCEPT')).toBe(false);
  });

  it('resource canon is mostly consumed (≤6 unused entries tolerated)', () => {
    const unused = unusedResources();
    expect(unused.length, `unused: ${unused.join(', ')}`).toBeLessThanOrEqual(6);
  });

  it('phase 5 has no boss gate; phases 1–4 do', () => {
    expect(PHASES.find((p) => p.id === 'p5')!.bossGateId).toBeNull();
    for (const pid of ['p1', 'p2', 'p3', 'p4']) {
      expect(PHASES.find((p) => p.id === pid)!.bossGateId).toMatch(/^boss\.p\d$/);
    }
  });

  it('stats snapshot: the curriculum is real, not a stub', () => {
    expect(report.stats.topics).toBeGreaterThan(90);
    expect(report.stats.drills).toBeGreaterThan(60);
    expect(report.stats.vizLinks).toBeGreaterThan(20);
  });
});
