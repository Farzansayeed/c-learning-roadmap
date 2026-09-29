import type { QuizItem } from './types';

/**
 * S17 — Capstone Portfolio Build: 8-item set (BLUEPRINT: 8).
 * Spec-first, milestone discipline, polish, review.
 */

export const s17Items: QuizItem[] = [
  {
    id: 'q.s17.mc1',
    stageId: 's17',
    format: 'mcq',
    difficulty: 1,
    targets: 's17.t2 — spec first',
    explanation: 'Acceptance criteria and milestones BEFORE code: the spec is the contract the build is judged against — and the README\'s first draft.',
    prompt: 'What comes before the first line of capstone code?',
    options: [
      'The benchmark suite',
      'The spec: interface, invariants, test list, milestone plan',
      'The demo GIF',
      'The README acknowledgments',
    ],
    answer: 1,
  },
  {
    id: 'q.s17.mc2',
    stageId: 's17',
    format: 'mcq',
    difficulty: 2,
    targets: 's17.tr1 — scope explosion',
    explanation: 'The brief caps features deliberately: a finished small system beats a broken big one. Cut features, do not creep — the acceptance criteria are the scope.',
    prompt: 'Mid-build you imagine three more features. The discipline says:',
    options: [
      'Add them — more is better',
      'Cut: finish the acceptance criteria first; new ideas go in the README\'s "future work"',
      'Rewrite from scratch with the new scope',
      'Add them only if untested',
    ],
    answer: 1,
  },
  {
    id: 'q.s17.mc3',
    stageId: 's17',
    format: 'mcq',
    difficulty: 2,
    targets: 's17.t3 — milestones land with tests',
    explanation: 'Every milestone lands with tests green — the S05 harness discipline at project scale. "Tests at the end" means integration failures found at the worst possible time.',
    prompt: 'When do a milestone\'s tests need to pass?',
    options: [
      'At the end of the project, all together',
      'Before the milestone is called done — every landing is green',
      'Only the final milestone needs tests',
      'Tests are optional for internal milestones',
    ],
    answer: 1,
  },
  {
    id: 'q.s17.mc4',
    stageId: 's17',
    format: 'mcq',
    difficulty: 2,
    targets: 's17.t4 — polish means measure',
    explanation: 'gprof/perf find the hot 3% — optimize what the profiler proves hot, not what looks slow. clang-format sets style; clang-tidy catches smells; a clean make is the entry fee.',
    prompt: 'The right way to pick what to optimize in the capstone:',
    options: [
      'The functions that look slow',
      'Whatever the profiler shows dominating runtime — the hot 3%',
      'Everything equally',
      'The newest code',
    ],
    answer: 1,
  },

  {
    id: 'q.s17.po1',
    stageId: 's17',
    format: 'predict-output',
    difficulty: 2,
    targets: 's17.t5 — the README tells the WHY',
    explanation: 'A capstone README explains decisions, tradeoffs, and benchmarks — the WHY. The diff between the spec-README and the final README is the design story.',
    prompt: 'A capstone README that survives review explains:',
    code: `/* which README? */`,
    answer: 'why — decisions, tradeoffs, benchmarks',
    accepts: ['why', 'decisions', 'decisions and tradeoffs', 'design decisions'],
  },

  {
    id: 'q.s17.fb1',
    stageId: 's17',
    format: 'fill-blank',
    difficulty: 1,
    targets: 's17.t4 — the zero-warning bar',
    explanation: '-Wall -Wextra -Werror -pedantic: the capstone compiles clean under the strictest flag set — warnings were optional in week one; they are forbidden here.',
    prompt: 'The capstone build flag that makes every warning fatal.',
    code: `CFLAGS = -Wall -Wextra -pedantic ___`,
    answers: [['-Werror']],
  },

  {
    id: 'q.s17.ftb1',
    stageId: 's17',
    format: 'find-bug',
    difficulty: 2,
    targets: 's17.tr2 — integration without unit discipline',
    explanation: 'The integration milestone fails in ways unit tests would have caught weeks earlier — the missing piece is per-milestone test targets wired into make test, not a final test sprint.',
    prompt: 'The project "works" until the parts meet. Click the Makefile line that should have existed all along.',
    code: `all: kv cli\nkv:\n\tgcc -Wall -Wextra -c kv.c\ncli:\n\tgcc -Wall -Wextra -c cli.c\n\tgcc kv.o cli.o -o kvdb\n/* ??? */`,
    answerLine: 6,
  },

  {
    id: 'q.s17.match1',
    stageId: 's17',
    format: 'match',
    difficulty: 2,
    targets: 's17.t1 — brief → its proof burden',
    explanation: 'Allocator: benchmark + valgrind. KV store: persistence + index correctness. Pathfinder: multiple algorithms + real data. Each brief ships with its own proof.',
    prompt: 'Match each capstone brief to its acceptance proof.',
    pairs: [
      { left: 'arena allocator library', right: 'benchmark suite + valgrind-clean stress' },
      { left: 'mini key-value store', right: 'persistence across restarts + BST index correctness' },
      { left: 'graph pathfinder toolkit', right: 'multiple algorithms verified on real map data' },
      { left: 'any capstone', right: 'README explaining every major decision' },
    ],
  },
];
