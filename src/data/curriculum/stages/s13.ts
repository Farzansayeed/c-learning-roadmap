import { res } from '../resources';
import type { Stage } from '../types';

export const s13: Stage = {
  id: 's13',
  phase: 'p4',
  title: 'Recursion & Backtracking',
  goal: 'Choose → explore → unchoose: turn "explore all options" problems into pruned search trees.',
  days: 5,
  canStatements: [
    'Turn any "explore all options" problem into backtracking with correct pruning',
    'Trace and bound the search tree',
    'Implement subsets/permutations/N-Queens/Sudoku from patterns, not memorization',
  ],
  topics: [
    {
      id: 's13.t1',
      order: 1,
      title: 'The backtracking skeleton',
      concept:
        'Three moves per level: CHOOSE an option, EXPLORE with it, UNCHOOSE it. The un-choose is what makes the other branches see a clean slate — forget it and every answer is wrong.',
      resources: [res('erickson', 'backtracking chapter')],
      viz: res('pythonTutor', 'tree-of-calls visuals'),
      quizRefs: ['q.s13.1'],
    },
    {
      id: 's13.t2',
      order: 2,
      title: 'Subsets & combinations',
      concept:
        'At each element: include it or not — 2ⁿ leaves. Combinations prune order-duplicates by only moving forward (start index).',
      resources: [res('ctci', 'recursion chapter')],
      quizRefs: ['q.s13.2'],
    },
    {
      id: 's13.t3',
      order: 3,
      title: 'Permutations',
      concept:
        'n! leaves: swap-into-place, recurse deeper, swap back. The swap-back IS the un-choose — watch it in the viz.',
      resources: [res('ctci', 'permutations')],
      viz: res('algoViz', 'permutation tree animation'),
      quizRefs: ['q.s13.3'],
    },
    {
      id: 's13.t4',
      order: 4,
      title: 'Pruning: feasibility + bounding',
      concept:
        'Kill branches early: a partially-attacked row means N-Queens never places the queen. Pruning turns exponential doom into tractable search — measure it in the build.',
      resources: [res('skiena', 'backtracking war stories')],
      quizRefs: ['q.s13.4'],
    },
    {
      id: 's13.t5',
      order: 5,
      title: 'N-Queens',
      concept:
        'One queen per row; columns and diagonals as boolean sets. The canonical backtracking exercise — every concept in one problem.',
      resources: [],
      viz: res('visualgo', 'N-Queens animation'),
      quizRefs: ['q.s13.5'],
    },
    {
      id: 's13.t6',
      order: 6,
      title: 'Sudoku solver',
      concept:
        'Find the emptiest cell, try 1–9 with constraint checks, recurse, undo. Constraint propagation is just pruning with manners.',
      resources: [],
      quizRefs: ['q.s13.6'],
    },
    {
      id: 's13.t7',
      order: 7,
      title: 'Grid backtracking',
      concept:
        'Rat-in-maze: mark cell visited, try four directions, unmark on return. Transfers directly to S11-style pathfinding.',
      resources: [],
      quizRefs: [],
    },
  ],
  drills: [
    { id: 's13.d1', title: 'Subsets & permutations printouts', detail: 'small n, print every branch; verify counts 2ⁿ and n!.', difficulty: 2, platform: 'local' },
    { id: 's13.d2', title: 'N-Queens pruned/unpruned', detail: 'node counts side by side — pruning\u2019s value made visible.', difficulty: 3, platform: 'local' },
    { id: 's13.d3', title: 'Sudoku, graded boards', detail: 'easy → hard; count nodes each.', difficulty: 3, platform: 'local' },
    { id: 's13.d4', title: 'Grid paths with obstacles', detail: 'count paths around walls with backtracking.', difficulty: 2, platform: 'local' },
  ],
  build: {
    id: 's13.build',
    name: 'Backtrack Bench',
    brief:
      'One CLI running N-Queens (n=4..12), Sudoku (3 graded boards), maze pathfinding — each reporting nodes explored with and without pruning.',
    acceptance: [
      'N-Queens solutions correct for all n ≤ 12',
      'Pruned vs unpruned node counts reported side by side',
      'Sudoku boards solved with correctness check',
      'Timing table stable across runs',
    ],
  },
  traps: [
    { id: 's13.tr1', mistake: 'Missing the un-choose', why: 'state leaks across branches; later answers are contaminated by earlier choices. Undo is half the algorithm.', quizRefs: ['q.s13.1'] },
    { id: 's13.tr2', mistake: 'Inverted prune condition', why: 'a backwards feasibility check prunes the SOLUTIONS and keeps the garbage — results look plausible and are wrong.', quizRefs: ['q.s13.4'] },
    { id: 's13.tr3', mistake: 'Base case in the wrong place', why: 'check success BEFORE the loop (at entry), not after the last recursion — or you miss the leaf answers.', quizRefs: ['q.s13.2'] },
  ],
};
