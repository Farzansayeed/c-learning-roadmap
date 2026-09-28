import { res } from '../resources';
import type { Stage } from '../types';

export const s12: Stage = {
  id: 's12',
  phase: 'p4',
  title: 'Sorting & Searching',
  goal: 'All six classic sorts by hand, the binary search family, two pointers, sliding windows.',
  days: 6,
  canStatements: [
    'Implement all six classic sorts from scratch and state complexity/stability/in-place-ness from understanding',
    'Binary search in the modern robust form (half-open intervals) plus its three famous variants',
    'Deploy two pointers and sliding windows as reflexes',
  ],
  topics: [
    {
      id: 's12.t1',
      order: 1,
      title: 'Bubble, selection, insertion',
      concept:
        'The O(n²) trio — each teaches one idea: bubble bubbles the max up, selection selects the min in, insertion inserts into a sorted prefix. Insertion is the one that survives in real libraries (for small n).',
      resources: [res('weiss', 'ch. 7.1–7.2'), res('mycodeschool', 'sorting')],
      viz: res('visualgo', 'race view'),
      quizRefs: ['q.s12.1'],
    },
    {
      id: 's12.t2',
      order: 2,
      title: 'Merge sort',
      concept:
        'Split, sort halves, linear merge. Stable, O(n log n) always, pays O(n) memory. The recursion your S07 recurrence analysis predicted.',
      resources: [res('weiss', 'ch. 7.4')],
      viz: res('pythonTutor', 'merge recursion visual'),
      quizRefs: ['q.s12.2'],
    },
    {
      id: 's12.t3',
      order: 3,
      title: 'Quick sort & partitioning',
      concept:
        'Pick a pivot, partition (Lomuto/Hoare), recurse on the sides. O(n log n) average, O(n²) worst (sorted input + bad pivot), in-place, unstable. Randomize the pivot to kill the worst case.',
      resources: [res('weiss', 'ch. 7.7'), res('mycodeschool', 'quicksort')],
      quizRefs: ['q.s12.3', 'q.s12.4'],
    },
    {
      id: 's12.t4',
      order: 4,
      title: 'Heapsort & counting sort',
      concept:
        'Heapsort: your S10 heap as a sorter — in-place O(n log n) worst case. Counting sort: when keys are small integers, skip comparisons entirely — O(n+k) and the idea behind radix.',
      resources: [res('weiss', 'ch. 7 (non-comparison)')],
      quizRefs: ['q.s12.5'],
    },
    {
      id: 's12.t5',
      order: 5,
      title: 'Quickselect (kth smallest)',
      concept:
        'Partition without sorting: after partition, the pivot sits at its final rank. Recurse only into the side containing k. Average O(n) — selection without the sort.',
      resources: [res('skiena', 'selection')],
      quizRefs: ['q.s12.6'],
    },
    {
      id: 's12.t6',
      order: 6,
      title: 'Binary search family',
      concept:
        'Half-open bounds [lo, hi): mid = lo + (hi-lo)/2 (no overflow!), shrink until empty. Variants: first occurrence, last occurrence, rotated-array search. Off-by-ones die here or never.',
      resources: [res('weiss', 'ch. 7'), res('ctci', 'binary search chapter')],
      viz: res('algoViz', 'binary search animation'),
      quizRefs: ['q.s12.7', 'q.s12.8'],
    },
    {
      id: 's12.t7',
      order: 7,
      title: 'Two pointers & sliding window',
      concept:
        'Sorted pair-sum: ends converge. Subarray problems: a window [lo,hi) grows and shrinks while maintaining an invariant — O(n) where a nested loop would be O(n²).',
      resources: [res('neetcode', 'two pointers + sliding window')],
      quizRefs: ['q.s12.9', 'q.s12.10'],
    },
  ],
  drills: [
    { id: 's12.d1', title: 'All sorts, instrumented', detail: 'comparison/swap counters printed per sort.', difficulty: 2, platform: 'local' },
    { id: 's12.d2', title: 'Stability demo', detail: 'sort structs with ties; show which sorts preserve order.', difficulty: 2, platform: 'local' },
    { id: 's12.d3', title: 'Binary search variants ×3', detail: 'first, last, rotated — each from the half-open template.', difficulty: 3, platform: 'local' },
    { id: 's12.d4', title: 'Two-sum sorted', detail: 'two pointers converging — O(n) after sorting.', difficulty: 2, platform: 'leetcode' },
    { id: 's12.d5', title: 'Longest substring without repeats', detail: 'sliding window with a last-seen table.', difficulty: 2, platform: 'leetcode' },
    { id: 's12.d6', title: 'LeetCode first 10 easy', detail: 'search/sort tagged, C-first.', difficulty: 2, platform: 'leetcode' },
  ],
  build: {
    id: 's12.build',
    name: 'SortLab',
    brief:
      'All sorts behind one interface with a comparison-counting harness; exports n-vs-comparisons tables per sort and an ASCII bar race; stability and adaptivity demonstrated with real data.',
    acceptance: [
      'Six sorts + counting sort, one interface',
      'Measured counts match theoretical growth (table proves it)',
      'Stability demonstrated with tie-heavy structs',
      'Nearly-sorted input shows insertion sort winning — adaptivity visible',
    ],
  },
  traps: [
    { id: 's12.tr1', mistake: '(lo+hi)/2 overflow', why: 'two big ints add to negative; lo + (hi-lo)/2 never overflows. The classic interview catch.', quizRefs: ['q.s12.7'] },
    { id: 's12.tr2', mistake: 'Infinite loop on duplicate-heavy quicksort', why: 'all-equal arrays with bad partitioning recurse on n-1 repeatedly. Hoare + middle element tames it.', quizRefs: ['q.s12.3'] },
    { id: 's12.tr3', mistake: 'Half-open bound drift', why: '[lo, mid) and [mid, hi) — mixing closed and half-open ends skips or doubles elements. One convention, always.', quizRefs: ['q.s12.8'] },
    { id: 's12.tr4', mistake: 'Window shrink forgotten', why: 'the window grows forever without the while-invariant that shrinks it — silently wrong answers.', quizRefs: ['q.s12.9'] },
  ],
};
