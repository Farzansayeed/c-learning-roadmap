/**
 * Quiz blueprint — CURRICULUM.md Appendix A, encoded. The validator test
 * enforces exact counts: content incomplete = CI red (PHASES Phase 5).
 */
export const BLUEPRINT: Record<string, number> = {
  s00: 8,
  s01: 16,
  s02: 16,
  s03: 24,
  s04: 14,
  s05: 14,
  s06: 14,
  s07: 12,
  s08: 22,
  s09: 16,
  s10: 18,
  s11: 24,
  s12: 20,
  s13: 16,
  s14: 14,
  s15: 12,
  s16: 18,
  s17: 8,
  // s18 is dynamic (review-queue driven) — no authored count
};

/** Boss exams: 20 items for phases 1–2, 25 for phases 3–4. */
export const BOSS_BLUEPRINT: Record<string, number> = {
  'boss.p1': 20,
  'boss.p2': 20,
  'boss.p3': 25,
  'boss.p4': 25,
};

/**
 * Content coverage — what is AUTHORED so far. Phase 5 covers Phases 0–2
 * (s00–s06 + boss.p1/p2); Phase 8 fills the rest. The validator enforces
 * exact blueprint counts for everything in this list, so any authoring
 * slip is CI-red; extending coverage is a one-line edit here.
 */
export const COVERED_STAGES: string[] = ['s00', 's01', 's02', 's03', 's04', 's05', 's06'];
export const COVERED_BOSSES: string[] = ['boss.p1', 'boss.p2'];
