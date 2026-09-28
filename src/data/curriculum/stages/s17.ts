import { res } from '../resources';
import type { Stage } from '../types';

export const s17: Stage = {
  id: 's17',
  phase: 'p5',
  title: 'Capstone Portfolio Build',
  goal: 'Ship one substantial, tested, documented system that survives a code review.',
  days: 8,
  canStatements: [
    'Ship one substantial, tested, documented system',
    'Explain every design decision in its README',
    'Profile and polish code to house style',
  ],
  topics: [
    {
      id: 's17.t1',
      order: 1,
      title: 'Choose the project',
      concept:
        'Three briefs with acceptance criteria: (a) arena allocator library with benchmark suite; (b) mini key-value store — HashKV grown up with persistence + BST index; (c) graph pathfinder toolkit — Pathfinder generalized with multiple algorithms + real map data.',
      resources: [],
      quizRefs: [],
    },
    {
      id: 's17.t2',
      order: 2,
      title: 'Spec first',
      concept:
        'Acceptance criteria and milestone split BEFORE code. The brief template in the app forces: interface, invariants, test list, milestone plan.',
      resources: [],
      quizRefs: [],
    },
    {
      id: 's17.t3',
      order: 3,
      title: 'Milestone builds with tests',
      concept:
        'Each milestone lands with tests green — the S05 harness discipline at project scale. No "tests at the end".',
      resources: [],
      quizRefs: [],
    },
    {
      id: 's17.t4',
      order: 4,
      title: 'Polish: profiling + house style',
      concept:
        'gprof/perf find the hot 3%; clang-format sets the style; clang-tidy catches the smells. A clean `make` and a green test script are the entry fee, not the achievement.',
      resources: [],
      quizRefs: [],
    },
    {
      id: 's17.t5',
      order: 5,
      title: 'Review & publish',
      concept:
        'Self-review checklist, then mentor/peer review via Exercism. README explains WHY (decisions, tradeoffs, benchmarks) — repo published with a demo GIF.',
      resources: [res('exercism')],
      quizRefs: [],
    },
  ],
  drills: [],
  build: {
    id: 's17.build',
    name: 'The Capstone',
    brief:
      'IS the stage. One of the three briefs, taken to acceptance criteria.',
    acceptance: [
      'Zero leaks under stress (valgrind), zero UB (ASan)',
      'Zero warnings under -Wall -Wextra -Werror -pedantic',
      'Test suite green via make test; CI-style script included',
      'README explains every major design decision and its alternative',
      'Benchmark table included; repo published with demo GIF',
    ],
  },
  traps: [
    { id: 's17.tr1', mistake: 'Scope explosion', why: 'the brief caps features deliberately — a finished small system beats a broken big one. Cut, do not creep.', quizRefs: [] },
    { id: 's17.tr2', mistake: 'No tests until the end', why: 'integration of untested parts fails in ways unit discipline would have caught weeks earlier.', quizRefs: [] },
    { id: 's17.tr3', mistake: 'README written last-minute', why: 'write it FIRST as the spec; revisit at the end. The diff between them is your design story.', quizRefs: [] },
  ],
};
