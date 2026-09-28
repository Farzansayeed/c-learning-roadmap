/**
 * Curriculum data types (DESIGN.md §3.1).
 * The curriculum IS data — every screen reads from these structures.
 */

export type PhaseId = 'p0' | 'p1' | 'p2' | 'p3' | 'p4' | 'p5';

export type ResourceKind = 'book' | 'video' | 'site' | 'tool' | 'viz' | 'practice';

export interface Resource {
  id: string;
  label: string;
  url: string;
  kind: ResourceKind;
  note?: string; // e.g. "ch. 11", "weeks 1–5"
}

/** A topic inside a stage — one learning unit with its own resources + quiz. */
export interface Topic {
  id: string; // 's03.t4'
  order: number;
  title: string;
  /** Beginner-level concept explanation; the app renders this text directly. */
  concept: string;
  /** Primary resources first. */
  resources: Resource[];
  /** The "watch it move" companion (Python Tutor, VisuAlgo, godbolt…). */
  viz?: Resource;
  /** Torture-test item ids that check this topic. */
  quizRefs: string[];
}

export type Platform = 'hackerrank' | 'exercism' | 'codechef' | 'leetcode' | 'local';

export interface Drill {
  id: string; // 's03.d1'
  title: string;
  detail: string;
  difficulty: 1 | 2 | 3;
  platform?: Platform;
}

export interface FlagshipBuild {
  id: string; // 's03.build'
  name: string;
  brief: string;
  /** Observable acceptance criteria — the stage build is done when all hold. */
  acceptance: string[];
}

export interface Trap {
  id: string; // 's03.tr1'
  mistake: string;
  why: string;
  quizRefs: string[];
}

export interface Stage {
  id: string; // 's03'
  phase: PhaseId;
  title: string;
  goal: string;
  /** Day budget at default pace (3h weekdays / 6-7h Sunday). */
  days: number;
  /** Observable outcomes — the stage is done only when all are true. */
  canStatements: string[];
  /** Ordered learning path. */
  topics: Topic[];
  drills: Drill[];
  build: FlagshipBuild;
  traps: Trap[];
}

export interface Phase {
  id: PhaseId;
  num: number; // 0..5, display order
  title: string;
  tagline: string;
  stageIds: Stage['id'][];
  /** Boss exam quiz-set id that gates this phase's exit (null for p5). */
  bossGateId: string | null;
}

/** Quiz-set kind — content itself lands in data/quizzes (Phase 4/5/8). */
export type QuizSetKind = 'torture' | 'boss';
