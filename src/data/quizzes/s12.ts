import type { QuizItem } from './types';

/**
 * S12 — Sorting & Searching: 20-item set (BLUEPRINT: 20).
 * Six sorts, binary search family, two pointers, sliding windows.
 */

export const s12Items: QuizItem[] = [
  /* mcq ×5 */
  {
    id: 'q.s12.mc1',
    stageId: 's12',
    format: 'mcq',
    difficulty: 1,
    targets: 's12.t1 — stability across the sorts',
    explanation: 'Stable sorts preserve the relative order of equal keys: merge sort and insertion sort are stable; quicksort, heapsort, and selection sort are not (long swaps jump over equals).',
    prompt: 'Which sort is NOT stable?',
    options: ['Merge sort', 'Insertion sort', 'Quicksort', 'Bubble sort'],
    answer: 2,
  },
  {
    id: 'q.s12.mc2',
    stageId: 's12',
    format: 'mcq',
    difficulty: 2,
    targets: 's12.t3 — quicksort worst case',
    explanation: 'Sorted input with a first/last-element pivot gives maximally unbalanced partitions: n-1, n-2, … — O(n²). Randomized or median-of-three pivots kill the pattern.',
    prompt: 'Quicksort hits its O(n²) worst case when:',
    options: [
      'The array contains duplicates only',
      'The pivot choice repeatedly produces maximally unbalanced partitions (e.g. sorted input, first-element pivot)',
      'The array is too large for memory',
      'Recursion is used instead of loops',
    ],
    answer: 1,
  },
  {
    id: 'q.s12.mc3',
    stageId: 's12',
    format: 'mcq',
    difficulty: 2,
    targets: 's12.t4 — counting sort escapes comparisons',
    explanation: 'Counting sort never compares: it counts key occurrences and reconstructs order — O(n+k) where k is the key range. Only works when keys are small integers.',
    prompt: 'When can sorting beat the O(n log n) comparison bound?',
    options: [
      'When the array is nearly sorted',
      'When keys are small-range integers — count them instead of comparing (O(n+k))',
      'When the array is small',
      'Never — n log n is a hard floor',
    ],
    answer: 1,
  },
  {
    id: 'q.s12.mc4',
    stageId: 's12',
    format: 'mcq',
    difficulty: 2,
    targets: 's12.t5 — quickselect partitions without sorting',
    explanation: 'After partitioning, the pivot sits at its FINAL rank. Quickselect recurses only into the side containing k — average O(n), no full sort.',
    prompt: 'Quickselect finds the kth smallest in average O(n) because:',
    options: [
      'It uses a heap of size k',
      'Each partition places its pivot at its final rank, so only ONE side needs recursing',
      'It sorts first, then indexes',
      'It uses hash tables',
    ],
    answer: 1,
  },
  {
    id: 'q.s12.mc5',
    stageId: 's12',
    format: 'mcq',
    difficulty: 2,
    targets: 's12.t1 — insertion sort earns its keep',
    explanation: 'Insertion is adaptive: nearly-sorted input means almost no shifts — O(n + inversions). Real libraries (Timsort, introsort) hand small or nearly-sorted runs to insertion.',
    prompt: 'Why do real libraries still ship insertion sort inside their main sorts?',
    options: [
      'It is stable on large arrays',
      'It wins on small or nearly-sorted runs — O(n) when inversions are rare',
      'It uses no memory at all',
      'Tradition',
    ],
    answer: 1,
  },

  /* predict-output ×4 */
  {
    id: 'q.s12.po1',
    stageId: 's12',
    format: 'predict-output',
    difficulty: 2,
    targets: 's12.t6 — binary search halving count',
    explanation: '32 elements: 32→16→8→4→2→1 — 5 halvings (log₂ 32 = 5) worst case. The whole family is "how many halvings".',
    prompt: 'Worst-case comparisons for binary search on 32 sorted elements?',
    code: `/* while (lo < hi) { mid = lo + (hi-lo)/2; ... }\n   worst case on n = 32: ? comparisons */`,
    answer: '5',
  },
  {
    id: 'q.s12.po2',
    stageId: 's12',
    format: 'predict-output',
    difficulty: 2,
    targets: 's12.t1 — one bubble pass bubbles the max',
    explanation: 'One bubble pass pushes the largest element to the end via adjacent swaps: 5 2 4 1 → 2 4 1 5. Each pass fixes one final position.',
    prompt: 'After ONE bubble pass (left to right, swapping bigger), what is the array?',
    code: `int a[] = {5, 2, 4, 1};\n/* one pass of: for (i = 0; i < 3; i++)\n                 if (a[i] > a[i+1]) swap */`,
    answer: '2 4 1 5',
  },
  {
    id: 'q.s12.po3',
    stageId: 's12',
    format: 'predict-output',
    difficulty: 3,
    targets: 's12.t7 — two pointers converge',
    explanation: 'Sorted 1 2 3 5 8, target 9: first check a[0]+a[4] = 1+8 = 9 — hit immediately. Output: 0 4. (Sum too small → lo++ grows it; too big → hi-- shrinks it.)',
    prompt: 'Two pointers on a sorted array — what does this print?',
    code: `/* sorted: 1 2 3 5 8, target sum 9\n   lo = 0, hi = 4\n   while (lo < hi):\n     if (a[lo]+a[hi] == target) -> print lo, hi; break\n     else if (sum < target) lo++\n     else hi-- */`,
    answer: '0 4',
  },
  {
    id: 'q.s12.po4',
    stageId: 's12',
    format: 'predict-output',
    difficulty: 3,
    targets: 's12.t6 — mid computed the safe way',
    explanation: 'lo=2, hi=10: mid = 2 + (10-2)/2 = 6 — the overflow-safe form gives the same answer here but never overflows when lo and hi are both huge (near INT_MAX).',
    prompt: 'What is mid?',
    code: `int lo = 2, hi = 10;\nint mid = lo + (hi - lo) / 2;\nprintf("%d\\n", mid);`,
    answer: '6',
  },

  /* fill-blank ×3 */
  {
    id: 'q.s12.fb1',
    stageId: 's12',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's12.tr1 — the overflow-safe mid',
    explanation: 'lo + (hi-lo)/2 never overflows: the difference is small even when both bounds are huge. (lo+hi)/2 adds two big ints first — the classic overflow.',
    prompt: 'Write the overflow-safe binary search midpoint.',
    code: `int mid = lo + (___) / 2;`,
    answers: [['hi - lo', 'hi-lo']],
  },
  {
    id: 'q.s12.fb2',
    stageId: 's12',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's12.t6 — half-open loop condition',
    explanation: 'Half-open [lo, hi): the search runs while the interval is non-empty — lo < hi. Closed bounds would need lo <= hi; mixing conventions is where off-by-ones breed.',
    prompt: 'Complete the half-open binary search condition.',
    code: `/* search space is [lo, hi) */\nwhile (lo ___ hi) {\n    int mid = lo + (hi - lo) / 2;\n    /* ... */\n}`,
    answers: [['<']],
  },
  {
    id: 'q.s12.fb3',
    stageId: 's12',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's12.t7 — the merge step of merge sort',
    explanation: 'Merge: compare fronts, take the smaller, advance that side. The merge is where the O(n) work of each level happens.',
    prompt: 'Take the smaller front element.',
    code: `if (L[i] ___ R[j]) out[k++] = L[i++];\nelse out[k++] = R[j++];`,
    answers: [['<=', '<']],
  },

  /* find-the-bug ×3 */
  {
    id: 'q.s12.ftb1',
    stageId: 's12',
    format: 'find-bug',
    difficulty: 2,
    targets: 's12.tr3 — binary search skips the mid',
    explanation: 'Half-open search space [lo, mid, hi): after comparing mid you must exclude it from the next range — hi = mid (not mid-1, which pairs with closed bounds; and certainly not hi = mid + 1, which SKIPS mid and can miss the answer).',
    prompt: 'This binary search can miss the target. Click the line that skips it.',
    code: `int bsearch_first(int *a, int n, int t) {\n    int lo = 0, hi = n;\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] < t) lo = mid + 1;\n        else hi = mid;\n    }\n    return lo;\n}\n/* variant below is broken: */\nint broken(int *a, int n, int t) {\n    int lo = 0, hi = n - 1;\n    while (lo < hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] < t) lo = mid + 1;\n        else hi = mid + 1;   /* ??? */\n    }\n    return lo;\n}`,
    answerLine: 17,
  },
  {
    id: 'q.s12.ftb2',
    stageId: 's12',
    format: 'find-bug',
    difficulty: 2,
    targets: 's12.t3 — partition bound walks off the array',
    explanation: 'Lomuto partition scans j from lo to hi-1 (the pivot sits at hi). Scanning to hi includes the pivot against itself — the counts and swaps drift wrong.',
    prompt: 'The partition scans one element too many. Click the wrong bound.',
    code: `int lomuto(int *a, int lo, int hi) {\n    int pivot = a[hi], i = lo - 1;\n    for (int j = lo; j <= hi; j++)     /* ??? */\n        if (a[j] < pivot) swap(&a[++i], &a[j]);\n    swap(&a[i + 1], &a[hi]);\n    return i + 1;\n}`,
    answerLine: 3,
  },
  {
    id: 'q.s12.ftb3',
    stageId: 's12',
    format: 'find-bug',
    difficulty: 3,
    targets: 's12.tr4 — window never shrinks',
    explanation: 'The sliding window needs the shrink invariant: while the constraint is violated, advance lo. Without it, hi marches to the end and the "window" is the whole array.',
    prompt: 'The window never shrinks — click the missing-move line\'s neighborhood.',
    code: `int longest_unique(const char *s) {\n    int last[256] = {0}, lo = 0, best = 0;\n    for (int hi = 0; s[hi]; hi++) {\n        if (last[(unsigned char)s[hi]] > lo)\n            ;                          /* lo must move here */\n        last[(unsigned char)s[hi]] = hi + 1;\n        if (hi - lo + 1 > best) best = hi - lo + 1;\n    }\n    return best;\n}`,
    answerLine: 5,
  },

  /* why-crash ×2 */
  {
    id: 'q.s12.wc1',
    stageId: 's12',
    format: 'why-crash',
    difficulty: 2,
    targets: 's12.tr2 — infinite quicksort on all-equal arrays',
    explanation: 'All-equal keys with a bad partition (e.g. Lomuto with < only) put everything on one side — recursion on n-1 forever, or stack overflow at depth n. Handle equals explicitly (3-way partition).',
    prompt: 'Quicksort overflows the stack on 10⁶ identical elements. Why?',
    code: `/* Lomuto partition, all keys equal to the pivot */
int partition(int *a, int lo, int hi) {
    int p = a[hi], i = lo - 1;
    for (int j = lo; j < hi; j++)
        if (a[j] < p) { i++; swap(&a[i], &a[j]); }
    swap(&a[i + 1], &a[hi]);
    return i + 1;   /* = hi every time: left side gets n-1 elems */
}`, /* recursion depth ⇒ n ⇒ stack overflow */
    options: [
      'Identical elements cannot be sorted',
      'The partition puts every element on one side — recursion depth becomes n',
      'Memory runs out',
      'The pivot is random',
    ],
    answer: 1,
  },
  {
    id: 'q.s12.wc2',
    stageId: 's12',
    format: 'why-crash',
    difficulty: 3,
    targets: 's12.t6 — rotated-array search boundary',
    explanation: 'Rotated binary search must decide WHICH half is sorted, then check the target against that half\'s range. A naive mid comparison on a rotated array throws away the correct half.',
    prompt: 'This rotated-array search returns wrong indices. Why does it lose the target?',
    code: `int search_rot(int *a, int n, int t) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (a[mid] == t) return mid;\n        if (a[mid] < t) lo = mid + 1;   /* ??? */\n        else hi = mid - 1;\n    }\n    return -1;\n}\n/* array: [4,5,6,7,0,1,2], t = 0 */`,
    options: [
      'The array must be re-sorted first',
      'The mid comparison assumes a sorted array — the correct half depends on WHICH half is sorted',
      'Binary search cannot work on rotated arrays at all',
      'lo + (hi-lo)/2 overflows',
    ],
    answer: 1,
  },

  /* ordering ×1 */
  {
    id: 'q.s12.ord1',
    stageId: 's12',
    format: 'ordering',
    difficulty: 2,
    targets: 's12.t2 — merge sort mechanics',
    explanation: 'Merge sort: split to base case, sort halves, merge linearly — the recursion collapses top-down and the merges build bottom-up.',
    prompt: 'Order merge sort\'s execution on [4,2,3,1].',
    steps: [
      'Split into [4,2] and [3,1]',
      'Split again: [4],[2],[3],[1] — base cases',
      'Merge [4] and [2] → [2,4]; merge [3] and [1] → [1,3]',
      'Merge [2,4] and [1,3] → [1,2,3,4]',
    ],
  },

  /* match ×1 */
  {
    id: 'q.s12.match1',
    stageId: 's12',
    format: 'match',
    difficulty: 2,
    targets: 's12.t1–t4 — sort → signature property',
    explanation: 'Merge: stable + O(n) space. Quicksort: in-place + fast average. Heapsort: in-place + worst-case guarantee. Counting: non-comparison when keys are small ints.',
    prompt: 'Match each sort to its defining property.',
    pairs: [
      { left: 'merge sort', right: 'stable, O(n) extra memory' },
      { left: 'quicksort', right: 'in-place, O(n log n) average, O(n²) worst' },
      { left: 'heapsort', right: 'in-place, O(n log n) worst case guaranteed' },
      { left: 'counting sort', right: 'O(n+k), keys must be small-range integers' },
    ],
  },

  /* fix-code ×1 */
  {
    id: 'q.s12.fix1',
    stageId: 's12',
    format: 'fix-code',
    difficulty: 3,
    targets: 's12.tr1 + s12.tr3 — overflow mid + bound drift in one search',
    explanation: 'Two classic binary-search bugs in one: (lo+hi)/2 overflow form AND a hi bound that skips the mid. Fix both, run, confirm.',
    prompt:
      'This binary search has TWO bugs: the overflow-prone midpoint and a bound that can skip the target. Fix both, run it in the online compiler until it finds every test key, then confirm.',
    code: `#include <stdio.h>\n\n/* returns index of t in a[n] or -1; broken twice */\nint find(int a[], int n, int t) {\n    int lo = 0, hi = n - 1;\n    while (lo <= hi) {\n        int mid = (lo + hi) / 2;      /* bug 1 */\n        if (a[mid] == t) return mid;\n        if (a[mid] < t) lo = mid + 1;\n        else hi = mid + 1;            /* bug 2 */\n    }\n    return -1;\n}\n\nint main(void) {\n    int a[] = {2, 4, 7, 9, 13, 21, 40};\n    printf(\"7 at %d\\n\", find(a, 7, 7));\n    printf(\"2 at %d\\n\", find(a, 7, 2));\n    printf(\"40 at %d\\n\", find(a, 7, 40));\n    printf(\"5 at %d\\n\", find(a, 7, 5));\n    return 0;\n}`,
    runnerUrl: 'https://www.onlinegdb.com/',
    runnerName: 'OnlineGDB',
    solutionNote:
      'Bug 1: mid = lo + (hi - lo) / 2 — no overflow at any bounds. Bug 2: hi = mid - 1 (closed-interval search): hi = mid + 1 skips mid and can loop past the target. All four queries then return 2, 0, 6, -1.',
  },
];
