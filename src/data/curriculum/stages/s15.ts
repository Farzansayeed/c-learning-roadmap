import { res } from '../resources';
import type { Stage } from '../types';

export const s15: Stage = {
  id: 's15',
  phase: 'p4',
  title: 'Greedy & Heaps in Anger',
  goal: 'Recognize greedy-solvable problems, defend the choice, and weaponize priority queues.',
  days: 4,
  canStatements: [
    'Recognize greedy-solvable problems and defend the choice',
    'Implement interval scheduling, Huffman sketch, and PQ-driven patterns',
    'Justify greedy vs DP on a given problem',
  ],
  topics: [
    {
      id: 's15.t1',
      order: 1,
      title: 'Greedy strategy & exchange-argument intuition',
      concept:
        'Greedy = commit to the locally best and never reconsider. It is only correct when swapping any alternative for your choice never helps (the exchange argument). Stay honest: collect the counterexamples where greedy breaks.',
      resources: [res('erickson', 'greedy intro'), res('skiena', 'greedy chapter')],
      quizRefs: ['q.s15.1'],
    },
    {
      id: 's15.t2',
      order: 2,
      title: 'Interval scheduling & covering',
      concept:
        'Maximum non-overlapping meetings: sort by END time, take greedily — sorting by start fails, by length fails. The sort order IS the algorithm; the playground drill proves all six orderings.',
      resources: [res('skiena', 'interval scheduling')],
      quizRefs: ['q.s15.2'],
    },
    {
      id: 's15.t3',
      order: 3,
      title: 'Huffman coding sketch',
      concept:
        'Two least-frequent nodes merge repeatedly (your heap drives it) into a prefix-free code. Real compression: encode/decode a file with your S10 heap.',
      resources: [res('weiss', 'huffman section')],
      viz: res('visualgo', 'huffman animation'),
      quizRefs: ['q.s15.3'],
    },
    {
      id: 's15.t4',
      order: 4,
      title: 'PQ patterns: top-K, merge-K, two heaps',
      concept:
        'Top-K frequent: heap of size K. Merge K lists: heap of current heads. Streaming median: max-heap + min-heap balanced by count. Three patterns, one structure.',
      resources: [res('neetcode', 'heap pattern cards')],
      quizRefs: ['q.s15.4'],
    },
    {
      id: 's15.t5',
      order: 5,
      title: 'Greedy vs DP shootout',
      concept:
        '0/1 knapsack: greedy by ratio fails, DP wins. Fractional knapsack: greedy wins outright. The decision flowchart in the app drills the boundary until it is reflex.',
      resources: [],
      quizRefs: ['q.s15.5'],
    },
  ],
  drills: [
    { id: 's15.d1', title: 'Meeting rooms / max overlap', detail: 'sweep line with sorted endpoints.', difficulty: 2, platform: 'leetcode' },
    { id: 's15.d2', title: 'Fractional knapsack', detail: 'greedy by ratio; verify optimality.', difficulty: 2, platform: 'local' },
    { id: 's15.d3', title: 'Huffman encode/decode toy', detail: 'real file round-trip through your heap.', difficulty: 3, platform: 'local' },
    { id: 's15.d4', title: 'Top-K frequent', detail: 'heap of size K over your HashKV word counts.', difficulty: 2, platform: 'local' },
    { id: 's15.d5', title: 'Streaming median (two heaps)', detail: 'invariant survives inserts AND removals.', difficulty: 3, platform: 'local' },
    { id: 's15.d6', title: 'Greedy-fail collection', detail: 'three problems where greedy provably breaks; write down why.', difficulty: 2, platform: 'local' },
  ],
  build: {
    id: 's15.build',
    name: 'GreedyLab',
    brief:
      'Interval tooling + Huffman codec (real compress/decompress with your S10 heap) + two-heap median stream — each shipping with its greedy-vs-DP comparison note.',
    acceptance: [
      'Interval scheduler + optimal counter-example demo for wrong sort orders',
      'Huffman compresses and decompresses a real file byte-identically',
      'Median stream maintains both heap invariants under random ops',
      'Each tool documents when greedy suffices vs when DP is required',
    ],
  },
  traps: [
    { id: 's15.tr1', mistake: 'Sorting intervals by the wrong endpoint', why: 'start-sorted or length-sorted greedy fails classic cases; end-sorted is the provable one.', quizRefs: ['q.s15.2'] },
    { id: 's15.tr2', mistake: 'Min-heap vs max-heap sign flips', why: 'C has no built-in PQ direction — one inverted comparator and the "top-K largest" returns the smallest. Test both directions.', quizRefs: ['q.s15.4'] },
    { id: 's15.tr3', mistake: 'Two-heap invariant lost after removals', why: 'median needs balanced sizes; lazy deletion + rebalance on every op, not just inserts.', quizRefs: ['q.s15.4'] },
  ],
};
