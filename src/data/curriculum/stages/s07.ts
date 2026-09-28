import { res } from '../resources';
import type { Stage } from '../types';

export const s07: Stage = {
  id: 's07',
  phase: 'p3',
  title: 'Complexity Toolkit',
  goal: 'Big-O as a reflex: analyze any loop or recursion, reason about tradeoffs, and teach your eyes the growth curves.',
  days: 3,
  canStatements: [
    'Big-O/Θ/Ω any loop or recursion you meet',
    'Explain amortized analysis (why doubling is O(1) amortized)',
    'Reason with log n intuition ("halving")',
    'Trace recurrence costs on paper',
    'Analyze space complexity and time-vs-space tradeoffs',
  ],
  topics: [
    {
      id: 's07.t1',
      order: 1,
      title: 'Asymptotic notation & the common classes',
      concept:
        'Big-O is an upper-bound story about growth, not stopwatch time. O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ). Halving is log; double loop over the same n is squared.',
      resources: [res('erickson', 'ch. 1 (first half)'), res('weiss', 'ch. 2'), res('abdulBari', 'complexity videos')],
      quizRefs: ['q.s07.1'],
    },
    {
      id: 's07.t2',
      order: 2,
      title: 'Space complexity & tradeoffs',
      concept:
        'Memory is the other axis: a memo table buys speed with space; recursion buys clarity with stack. Every design decision is a point on the time-space curve.',
      resources: [res('weiss', 'ch. 2 (space sections)')],
      quizRefs: ['q.s07.2'],
    },
    {
      id: 's07.t3',
      order: 3,
      title: 'Analyzing loops',
      concept:
        'Sequential loops add; nested loops multiply; a loop that halves its input each pass is log; dependent inner loops (j = i) are triangular ≈ n²/2 = O(n²). Trace, then classify.',
      resources: [],
      quizRefs: ['q.s07.3', 'q.s07.4'],
    },
    {
      id: 's07.t4',
      order: 4,
      title: 'Recurrences',
      concept:
        'T(n) = 2T(n/2) + n is merge sort: two halves + linear merge = O(n log n). Read recurrences as recipes: how many subproblems, how big, how much non-recursive work.',
      resources: [res('abdulBari', 'recurrence videos'), res('erickson', 'ch. 1')],
      quizRefs: ['q.s07.5'],
    },
    {
      id: 's07.t5',
      order: 5,
      title: 'Amortized analysis',
      concept:
        'Occasional expensive ops averaged over many cheap ones: doubling an array costs O(n) once in n pushes — O(1) amortized. Your S03 vector is the running proof.',
      resources: [res('weiss', 'ch. 2 (amortized)')],
      quizRefs: ['q.s07.6'],
    },
    {
      id: 's07.t6',
      order: 6,
      title: 'Interview math: logs & series',
      concept:
        '2¹⁰≈10³, log₂(10⁶)≈20, 1+2+…+n = n(n+1)/2. The zero-prerequisite primer in the app teaches exactly this before using it — the only math the roadmap needs.',
      resources: [],
      quizRefs: ['q.s07.7'],
    },
    {
      id: 's07.t7',
      order: 7,
      title: 'Watch the curves race',
      concept:
        'Watch O(n²) sorting drown as O(n log n) glides — intuition before formulas, so the formulas land on prepared ground.',
      resources: [],
      viz: res('visualgo', 'sorting race view'),
      quizRefs: [],
    },
  ],
  drills: [
    { id: 's07.d1', title: 'Classify 15 loops', detail: 'given code, write Big-O with one-line justifications.', difficulty: 2, platform: 'local' },
    { id: 's07.d2', title: 'Trace 5 recursions', detail: 'cost of each call tree on paper.', difficulty: 2, platform: 'local' },
    { id: 's07.d3', title: 'Doubling experiment', detail: 'count array-resize copies at n = 10³..10⁶; verify amortization empirically.', difficulty: 2, platform: 'local' },
    { id: 's07.d4', title: 'The one-second question', detail: 'n = 10⁶: which algorithms finish in ~1s? Justify with class math.', difficulty: 2, platform: 'local' },
  ],
  build: {
    id: 's07.build',
    name: 'Complexity Bench',
    brief:
      'Benchmark harness timing naive vs optimized pairs (linear vs binary search; O(n²) vs O(n log n) dedup), printing measured-vs-theoretical tables.',
    acceptance: [
      'At least 3 naive/optimized pairs timed over multiple n',
      'Measured growth matches theoretical class (report shows it)',
      'Table printed in clean columns; harness reuses S03 vector',
    ],
  },
  traps: [
    { id: 's07.tr1', mistake: 'Claiming O(1) for hidden O(n)', why: 'a "constant" hash lookup is O(n) worst-case; hidden loops inside library calls lie to you.', quizRefs: ['q.s07.3'] },
    { id: 's07.tr2', mistake: 'Ignoring constants everywhere', why: 'O notation drops constants asymptotically — but at n = 100, a 100× constant decides the winner.', quizRefs: ['q.s07.1'] },
    { id: 's07.tr3', mistake: 'Worst-case vs average confusion', why: 'quicksort is O(n log n) average, O(n²) worst — say which one you mean.', quizRefs: ['q.s07.5'] },
  ],
};
