import type { QuizItem } from './types';

/**
 * S15 — Greedy & Heaps in Anger: 12-item set (BLUEPRINT: 12).
 * Exchange arguments, interval scheduling, Huffman, PQ patterns.
 */

export const s15Items: QuizItem[] = [
  /* mcq ×4 */
  {
    id: 'q.s15.mc1',
    stageId: 's15',
    format: 'mcq',
    difficulty: 2,
    targets: 's15.t1 — the exchange argument',
    explanation: 'To prove greedy correct: assume an optimal solution differs from the greedy choice, SWAP the greedy choice in, and show the swap never hurts. If every swap is safe, greedy is optimal.',
    prompt: 'The exchange argument proves greedy by:',
    options: [
      'Trying all inputs',
      'Showing any optimal solution can be swapped to include the greedy choice without getting worse',
      'Induction on array length',
      'Timing both approaches',
    ],
    answer: 1,
  },
  {
    id: 'q.s15.mc2',
    stageId: 's15',
    format: 'mcq',
    difficulty: 2,
    targets: 's15.tr1 — the only correct interval sort',
    explanation: 'Sort by END time: the meeting that finishes earliest leaves the most room. Start-sorted fails (a long meeting blocks all), length-sorted fails (short meetings can start late).',
    prompt: 'Interval scheduling (max non-overlapping meetings) sorts by:',
    options: ['Start time', 'End time', 'Duration', 'Whatever — all work'],
    answer: 1,
  },
  {
    id: 'q.s15.mc3',
    stageId: 's15',
    format: 'mcq',
    difficulty: 2,
    targets: 's15.t3 — Huffman merge rule',
    explanation: 'Huffman repeatedly merges the TWO LEAST frequent nodes (a min-heap drives it): rare symbols sink deep (long codes), common ones stay shallow (short codes) — the prefix-free optimum.',
    prompt: 'Huffman coding builds its tree by always merging:',
    options: [
      'The two most frequent symbols',
      'The two least-frequent nodes',
      'Random pairs',
      'Adjacent symbols in the input',
    ],
    answer: 1,
  },
  {
    id: 'q.s15.mc4',
    stageId: 's15',
    format: 'mcq',
    difficulty: 3,
    targets: 's15.t4 — streaming median two heaps',
    explanation: 'Max-heap holds the lower half, min-heap the upper, sizes balanced within 1: the median is the max-heap top (or the average of both tops). Every insert rebalances.',
    prompt: 'The streaming-median pattern maintains:',
    options: [
      'One sorted array',
      'A max-heap (lower half) + min-heap (upper half), sizes within one',
      'Two queues',
      'A balanced BST only',
    ],
    answer: 1,
  },

  /* predict-output ×3 */
  {
    id: 'q.s15.po1',
    stageId: 's15',
    format: 'predict-output',
    difficulty: 2,
    targets: 's15.t2 — greedy interval pick trace',
    explanation: 'Sorted by end: B(4), A(5), C(7)... B ends 4; A starts 3 (overlap, skip), C starts 6 ≥ 4 (take), D starts 5.5 — D overlaps C? D starts 9: take.Greedy picks B, C, D → 3 meetings.',
    prompt: 'How many meetings does end-sorted greedy pick?',
    code: `/* meetings (start, end):\n   A (3, 5)   B (1, 4)   C (6, 7)   D (9, 10)\n   sort by end: B, A, C, D — take if start >= last end */`,
    answer: '3',
  },
  {
    id: 'q.s15.po2',
    stageId: 's15',
    format: 'predict-output',
    difficulty: 2,
    targets: 's15.tr2 — heap pop order',
    explanation: 'Min-heap pops 1, 3, 4, 9 — always the smallest remaining, regardless of insertion order. One inverted comparator turns it into 9, 4, 3, 1.',
    prompt: 'In what order does a min-heap emit these?',
    code: `/* push 3, 1, 9, 4 into a MIN-heap, then pop all */`,
    answer: '1 3 4 9',
  },
  {
    id: 'q.s15.po3',
    stageId: 's15',
    format: 'predict-output',
    difficulty: 3,
    targets: 's15.t5 — greedy fails 0/1 knapsack',
    explanation: 'Ratios: A = 5/3 ≈ 1.67, B = C = 1.5. Greedy grabs A (3 kg, value 5) — then 1 kg of capacity remains and nothing fits: total 5. Optimal is B + C: 4 kg exactly, value 6. Best-ratio-first starved the knapsack — the 0/1 trap that fractional greedy never hits.',
    prompt: 'Ratio-greedy picks which total value? (capacity 4)',
    code: `/* items (weight, value): A(3, 5) B(2, 3) C(2, 3)\n   capacity = 4\n   ratios: A = 1.67, B = 1.5, C = 1.5\n   greedy: take A (3 kg, value 5)... 1 kg left, nothing fits\n   greedy total = ? */`,
    answer: '5',
  },

  /* fill-blank ×2 */
  {
    id: 'q.s15.fb1',
    stageId: 's15',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's15.t2 — the take condition',
    explanation: 'After end-sorting, take a meeting only if it starts at or after the last taken meeting\'s end — the single comparison the whole algorithm needs.',
    prompt: 'Take the meeting only if it starts after the last end.',
    code: `if (m.start ___ last_end) { take(m); last_end = m.end; }`,
    answers: [['>=', '>']],
  },
  {
    id: 'q.s15.fb2',
    stageId: 's15',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's15.t4 — heap of size K',
    explanation: 'Top-K largest with a MIN-heap of size K: the heap root is the Kth largest candidate; anything bigger replaces it. K space, n log k time.',
    prompt: 'Keep the heap at capacity K while streaming.',
    code: `if (heap_size ___ K) {\n    if (x > heap_top()) pop_and_push(x);\n} else\n    push(x);`,
    answers: [['==', '=']],
  },

  /* find-the-bug ×1 */
  {
    id: 'q.s15.ftb1',
    stageId: 's15',
    format: 'find-bug',
    difficulty: 2,
    targets: 's15.tr2 — inverted comparator direction',
    explanation: 'A min-heap comparator returns negative when a < b. This one flips it — the "min-heap" pops the LARGEST first, and every top-K answer built on it is quietly wrong.',
    prompt: 'The "min-heap" pops the biggest first. Click the flipped line.',
    code: `int cmp_min(int a, int b) {\n    return b - a;      /* ??? */\n}\n/* used as: if (cmp_min(a, b) < 0) a comes first */`,
    answerLine: 2,
  },

  /* why-crash ×1 */
  {
    id: 'q.s15.wc1',
    stageId: 's15',
    format: 'why-crash',
    difficulty: 2,
    targets: 's15.tr3 — two-heap invariant under removals',
    explanation: 'The median invariant (|lower| − |upper| ≤ 1) must be restored after EVERY operation — a removal that empties one half makes the "median" read garbage or crash on an empty top().',
    prompt: 'The median stream crashes after a removal. What broke?',
    code: `/* lower = max-heap (smaller half)\n   upper = min-heap (larger half)\n   remove(x) just deletes x from its heap — nothing else */\ndouble median(void) {\n    return top(lower);\n}`,
    options: [
      'Heaps cannot support deletion',
      'The size invariant was never rebalanced — one half can be empty while the answer reads its top',
      'The median needs both tops averaged always',
      'Removals must rebuild from an array',
    ],
    answer: 1,
  },

  /* ordering ×1 */
  {
    id: 'q.s15.ord1',
    stageId: 's15',
    format: 'ordering',
    difficulty: 2,
    targets: 's15.t3 — Huffman construction sequence',
    explanation: 'Huffman: every symbol in a min-heap; pop two smallest, merge under a new node, push the merge back; repeat until one node — the root. The last node is the tree.',
    prompt: 'Order the Huffman build.',
    steps: [
      'Push every symbol (with its frequency) into a min-heap',
      'Pop the two least-frequent nodes',
      'Merge them under a new parent with summed frequency; push it back',
      'Repeat until one node remains — that is the root',
    ],
  },
];
