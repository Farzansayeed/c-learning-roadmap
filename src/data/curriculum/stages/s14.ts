import { res } from '../resources';
import type { Stage } from '../types';

export const s14: Stage = {
  id: 's14',
  phase: 'p4',
  title: 'Dynamic Programming',
  goal: 'Memoization → tabulation, the core five families, and reconstructing answers — not just counting them.',
  days: 6,
  canStatements: [
    'Decide "is this DP?" from problem shape',
    'Convert recursion → memo → table consciously',
    'Implement the core five families',
    'Reconstruct (not just count) optimal answers',
  ],
  topics: [
    {
      id: 's14.t1',
      order: 1,
      title: 'Overlapping subproblems + optimal substructure',
      concept:
        'DP applies when the same subproblems recur (fibonacci recomputes fib(3) exponentially many times) and the best answer composes from best sub-answers. Memoize the first, exploit the second.',
      resources: [res('erickson', 'ch. 2 (DP intro)'), res('abdulBari', 'DP videos')],
      quizRefs: ['q.s14.1'],
    },
    {
      id: 's14.t2',
      order: 2,
      title: 'Fibonacci ladder: naive → memo → table → two vars',
      concept:
        'The on-ramp everyone needs: exponential → O(n) memo → O(n) table → O(1) space. Same answer, four designs — complexity collapse demonstrated by hand.',
      resources: [],
      viz: res('pythonTutor', 'memo table filling'),
      quizRefs: ['q.s14.2'],
    },
    {
      id: 's14.t3',
      order: 3,
      title: 'Grid paths',
      concept:
        'Unique paths / min path sum: each cell = answer from above + answer from left. The table IS the grid you are walking — fill it in order.',
      resources: [res('neetcode', '1-D DP + grids')],
      viz: res('algoViz', 'grid DP animation'),
      quizRefs: ['q.s14.3'],
    },
    {
      id: 's14.t4',
      order: 4,
      title: '0/1 Knapsack',
      concept:
        'dp[i][w] = best value using first i items with capacity w: take it (value + dp[i-1][w-wt]) or skip it (dp[i-1][w]). The family behind a thousand problems.',
      resources: [res('erickson', 'knapsack'), res('weiss', 'knapsack section')],
      viz: res('visualgo', 'knapsack table animation'),
      quizRefs: ['q.s14.4'],
    },
    {
      id: 's14.t5',
      order: 5,
      title: 'LCS with reconstruction',
      concept:
        'dp[i][j] = LCS of prefixes; walk the table backwards to print the actual subsequence. Counting is half the answer — reconstructing is the interview differentiator.',
      resources: [res('erickson', 'LCS')],
      quizRefs: ['q.s14.5'],
    },
    {
      id: 's14.t6',
      order: 6,
      title: 'LIS',
      concept:
        'dp[i] = longest increasing subsequence ENDING at i: look back at all smaller predecessors, O(n²). Then the O(n log n) patience idea, conceptually.',
      resources: [res('cpAlgorithms', 'LIS')],
      quizRefs: ['q.s14.6'],
    },
    {
      id: 's14.t7',
      order: 7,
      title: 'Coin change (count + min)',
      concept:
        'Count ways: order-independent loops over coins outside. Min coins: dp[x] = 1 + min(dp[x-coin]). Same coins, two loop orders, two different problems.',
      resources: [res('neetcode', 'coin change')],
      quizRefs: ['q.s14.7'],
    },
    {
      id: 's14.t8',
      order: 8,
      title: 'When NOT to DP',
      concept:
        'Greedy works when a local choice provably stays optimal (fractional knapsack, interval scheduling). Knowing the boundary is the bridge to S15.',
      resources: [],
      quizRefs: ['q.s14.8'],
    },
  ],
  drills: [
    { id: 's14.d1', title: 'Climb stairs & house robber', detail: 'the two-entry DP warmups.', difficulty: 1, platform: 'leetcode' },
    { id: 's14.d2', title: 'Coin change ×2 forms', detail: 'min coins AND count ways; explain the loop-order difference.', difficulty: 2, platform: 'leetcode' },
    { id: 's14.d3', title: 'Knapsack with reconstruction', detail: 'print the chosen items, not just the value.', difficulty: 3, platform: 'local' },
    { id: 's14.d4', title: 'LCS printing the sequence', detail: 'table + backward walk + the actual string.', difficulty: 3, platform: 'local' },
    { id: 's14.d5', title: 'Memo vs table benchmark', detail: 'same problem both ways: timing + memory table.', difficulty: 2, platform: 'local' },
  ],
  build: {
    id: 's14.build',
    name: 'DPLab',
    brief:
      'Five solvers (knapsack, LCS, LIS, coin change, grid paths), each exposing naive / memoized / tabulated variants, plus a table-tracer printing the DP table filling step by step in ASCII. The tracer IS the product.',
    acceptance: [
      'All five problems, three implementations each',
      'Tracer renders each fill step; correctness vs brute force verified',
      'Reconstruction output for knapsack and LCS',
      'Benchmark table: naive is visibly exponential, table linear-ish',
    ],
  },
  traps: [
    { id: 's14.tr1', mistake: 'Off-by-one table semantics', why: 'dp[i] = "answer using first i items" vs "up to item i" — pick the definition and guard the borders.', quizRefs: ['q.s14.4'] },
    { id: 's14.tr2', mistake: 'Memo keyed wrongly', why: 'memoizing on the wrong state (e.g. ignoring the capacity) returns confident garbage. The state is the full signature.', quizRefs: ['q.s14.2'] },
    { id: 's14.tr3', mistake: 'Counting instead of reconstructing', why: 'the length is not the answer — interviews ask for the sequence. Keep parent pointers or walk back.', quizRefs: ['q.s14.5'] },
    { id: 's14.tr4', mistake: 'Recursion-depth stack overflow', why: 'deep memo recursion dies on big inputs — that is what tabulation is for. Know when to switch.', quizRefs: ['q.s14.2'] },
  ],
};
