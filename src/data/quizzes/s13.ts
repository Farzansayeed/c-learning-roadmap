import type { QuizItem } from './types';

/**
 * S13 — Recursion & Backtracking: 16-item set (BLUEPRINT: 16).
 * The skeleton, subsets/permutations, pruning, N-Queens, Sudoku.
 */

export const s13Items: QuizItem[] = [
  /* mcq ×4 */
  {
    id: 'q.s13.mc1',
    stageId: 's13',
    format: 'mcq',
    difficulty: 1,
    targets: 's13.t1 — choose, explore, unchoose',
    explanation: 'Backtracking = choose an option, recurse with it, UNDO it before the next option. The undo restores shared state so sibling branches start clean.',
    prompt: 'What does the "un-choose" step do in backtracking?',
    options: [
      'Deletes the recursion',
      'Restores shared state so the next sibling branch starts clean',
      'Reverses the answer',
      'Prunes the tree',
    ],
    answer: 1,
  },
  {
    id: 'q.s13.mc2',
    stageId: 's13',
    format: 'mcq',
    difficulty: 2,
    targets: 's13.t2 — subsets vs permutations counts',
    explanation: 'Subsets: each element in or out → 2ⁿ = 8 for n=3. Permutations: every ordering → n! = 6. Different trees, different counts, both exponential.',
    prompt: 'For n = 3 elements, how many subsets and permutations exist?',
    options: ['8 subsets, 6 permutations', '6 subsets, 8 permutations', '8 and 8', '6 and 6'],
    answer: 0,
  },
  {
    id: 'q.s13.mc3',
    stageId: 's13',
    format: 'mcq',
    difficulty: 2,
    targets: 's13.t4 — pruning changes the tree, not the answer',
    explanation: 'Pruning kills branches that CANNOT lead to solutions. Correct pruning preserves every solution; it only shrinks the search space (measured in node counts).',
    prompt: 'Correct pruning in backtracking:',
    options: [
      'May remove some valid solutions to save time',
      'Removes only branches that cannot contain solutions — the answer set is unchanged',
      'Is only possible in graphs',
      'Changes the algorithm\'s worst-case class to polynomial',
    ],
    answer: 1,
  },
  {
    id: 'q.s13.mc4',
    stageId: 's13',
    format: 'mcq',
    difficulty: 3,
    targets: 's13.t5 — N-Queens constraint sets',
    explanation: 'One queen per ROW (the recursion index), with column and both-diagonal boolean sets for O(1) attack checks — no board scanning at all.',
    prompt: 'The efficient N-Queens formulation tracks attacked positions with:',
    options: [
      'A full board scan per placement',
      'Column and diagonal boolean sets — one queen per row by construction',
      'Sorting the queens by danger',
      'A hash table of killed queens',
    ],
    answer: 1,
  },

  /* predict-output ×3 */
  {
    id: 'q.s13.po1',
    stageId: 's13',
    format: 'predict-output',
    difficulty: 2,
    targets: 's13.t2 — subset recursion trace',
    explanation: 'Include-or-not at each of 3 elements: {}, {c}, {b}, {b,c}, {a}, {a,c}, {a,b}, {a,b,c} — the "skip first" ordering prints subsets in this exact sequence: 8 total.',
    prompt: 'How many lines does this print?',
    code: `void subsets(int i, int n) {\n    if (i == n) { print_current(); return; }\n    /* exclude */ subsets(i + 1, n);\n    /* include */ take(i); subsets(i + 1, n); untake(i);\n}\n/* called: subsets(0, 3) */`,
    answer: '8',
  },
  {
    id: 'q.s13.po2',
    stageId: 's13',
    format: 'predict-output',
    difficulty: 2,
    targets: 's13.t3 — swap-into-place permutation count',
    explanation: 'swap → recurse → swap back generates each permutation once: n! calls at the leaves. For 3 elements that is 6 printed lines.',
    prompt: 'How many permutations does this print for "abc"?',
    code: `void perm(char *s, int k) {\n    if (!s[k]) { printf("%s\\n", s); return; }\n    for (int i = k; s[i]; i++) {\n        swap(&s[k], &s[i]);\n        perm(s, k + 1);\n        swap(&s[k], &s[i]);   /* un-choose */\n    }\n}`,
    answer: '6',
  },
  {
    id: 'q.s13.po3',
    stageId: 's13',
    format: 'predict-output',
    difficulty: 3,
    targets: 's13.t5 — N-Queens solution counts',
    explanation: 'N-Queens solution counts: n=4 → 2, n=5 → 10, n=6 → 4, n=8 → 92. The sequence is not monotonic — 6 has FEWER solutions than 5.',
    prompt: 'How many distinct solutions does 4-Queens have? (4×4 board)',
    code: `/* count of ways to place 4 non-attacking queens\n   on a 4x4 board = ? */`,
    answer: '2',
  },

  /* fill-blank ×3 */
  {
    id: 'q.s13.fb1',
    stageId: 's13',
    format: 'fill-blank',
    difficulty: 1,
    targets: 's13.tr1 — the un-choose line',
    explanation: 'After exploring a choice, undo it: clear the marker (and pop the path). This one line separates backtracking from plain recursion.',
    prompt: 'Undo the choice after exploring.',
    code: `visited[node] = 1;\npath_push(node);\nexplore(node);\npath_pop();\nvisited[node] = ___;`,
    answers: [['0', 'false']],
  },
  {
    id: 'q.s13.fb2',
    stageId: 's13',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's13.t5 — the diagonal check',
    explanation: 'N-Queens diagonal identity: row - col is constant on one diagonal direction (row + col on the other). Two arrays cover all diagonals in O(1).',
    prompt: 'Mark the ↘ diagonal this queen attacks.',
    code: `diag1[row - col + n] = 1;   /* +n keeps it non-negative */\n___[row + col] = 1;         /* the ↗ direction */`,
    answers: [['diag2']],
  },
  {
    id: 'q.s13.fb3',
    stageId: 's13',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's13.tr3 — the success base case',
    explanation: 'The success check happens at ENTRY (all rows filled), not after the loop — the loop only tries columns for the CURRENT row.',
    prompt: 'Write the success condition for N-Queens.',
    code: `void solve(int row) {\n    if (row ___ n) { solutions++; return; }\n    for (int col = 0; col < n; col++)\n        if (safe(row, col)) { place(row, col); solve(row + 1); remove(row, col); }\n}`,
    answers: [['==', '>=']],
  },

  /* find-the-bug ×2 */
  {
    id: 'q.s13.ftb1',
    stageId: 's13',
    format: 'find-bug',
    difficulty: 2,
    targets: 's13.tr1 — state leaks across branches',
    explanation: 'Taking an element and never untaking it means later branches still see it — the subset generator prints wrong sets. The untake restores the shared slate.',
    prompt: 'Subsets come out wrong after the first branch. Click the missing line.',
    code: `void gen(int i, int n) {\n    if (i == n) { print_set(); return; }\n    gen(i + 1, n);            /* without i */\n    used[i] = 1;              /* take i */\n    gen(i + 1, n);            /* with i */\n    /* ??? */\n}`,
    answerLine: 6,
  },
  {
    id: 'q.s13.ftb2',
    stageId: 's13',
    format: 'find-bug',
    difficulty: 3,
    targets: 's13.tr2 — inverted prune condition',
    explanation: 'The prune must REJECT attacking placements (skip them). This version only recurses when the queen ATTACKS — it searches for invalid boards and discards every solution.',
    prompt: 'The solver returns zero solutions. Click the inverted condition.',
    code: `void solve(int row) {\n    if (row == n) { solutions++; return; }\n    for (int col = 0; col < n; col++) {\n        if (attacks(row, col))\n            solve_with(row, col);   /* ??? */\n    }\n}`,
    answerLine: 5,
  },

  /* why-crash ×1 */
  {
    id: 'q.s13.wc1',
    stageId: 's13',
    format: 'why-crash',
    difficulty: 2,
    targets: 's13.t1 — unbounded branching without pruning',
    explanation: 'Without the safe() prune, N-Queens tries nⁿ placements (all queens everywhere) instead of n! at most — 8-Queens goes from ~2k nodes to 16.7M. Pruning is not an optimization nicety; it is the algorithm.',
    prompt: 'Unpruned 8-Queens grinds through 16.7 million nodes. What did it forget?',
    code: `void solve(int row) {\n    if (row == n) { solutions++; return; }\n    for (int col = 0; col < n; col++) {\n        place(row, col);      /* no questions asked */\n        solve(row + 1);\n        remove(row, col);\n    }\n}`,
    options: [
      'It forgot to count solutions',
      'It never checks attacks — every column is tried on every row, branching n ways unconditionally',
      'It forgot the un-choose',
      'It needs a bigger stack',
    ],
    answer: 1,
  },

  /* ordering ×1 */
  {
    id: 'q.s13.ord1',
    stageId: 's13',
    format: 'ordering',
    difficulty: 2,
    targets: 's13.t1 — one full backtracking level',
    explanation: 'One level: mark the choice, recurse, unmark. The mark-unmark sandwich around the recursion IS the whole pattern.',
    prompt: 'Order one backtracking step correctly.',
    steps: [
      'Check feasibility of the choice (prune if dead)',
      'Mark the choice (visited/used/board set)',
      'Recurse to the next decision level',
      'Unmark the choice (restore state)',
    ],
  },

  /* match ×1 */
  {
    id: 'q.s13.match1',
    stageId: 's13',
    format: 'match',
    difficulty: 2,
    targets: 's13.t2/t3/t5/t6 — problem → tree shape',
    explanation: 'Subsets branch 2ⁿ (in/out), permutations n! (orderings), N-Queens n branches per row with pruning, Sudoku ≤9 branches per cell with constraint checks.',
    prompt: 'Match each problem to its search-tree shape.',
    pairs: [
      { left: 'all subsets of n items', right: '2ⁿ leaves — include/exclude each' },
      { left: 'all orderings of n items', right: 'n! leaves — one branch per remaining item' },
      { left: 'N-Queens on n rows', right: '≤ n branches per row, heavily pruned' },
      { left: 'Sudoku', right: '≤ 9 branches per empty cell, constraint-checked' },
    ],
  },

  /* fix-code ×1 */
  {
    id: 'q.s13.fix1',
    stageId: 's13',
    format: 'fix-code',
    difficulty: 3,
    targets: 's13.tr1 + s13.tr3 — missing undo + misplaced base case in one generator',
    explanation: 'Both classic at once: the base case counts BEFORE all rows are placed, and the path length is never restored. Fix both, run, confirm 92.',
    prompt:
      'This N-Queens counter has TWO bugs: the success check is misplaced and the column-occupancy flag is never cleared. Fix both, run it in the online compiler until it prints the correct count for n=8, then confirm.',
    code: `#include <stdio.h>\n\nint cols[8], solutions = 0;\n\nint safe(int row, int c) {\n    /* simplified: only column attacks for this exercise */\n    return !cols[c];\n}\n\nvoid solve(int row) {\n    if (row == 7) { solutions++; return; }   /* bug 1 */\n    for (int c = 0; c < 8; c++) {\n        if (safe(row, c)) {\n            cols[c] = 1;\n            solve(row + 1);\n            /* bug 2: flag never cleared */\n        }\n    }\n}\n\nint main(void) {\n    solve(0);\n    printf("solutions: %d\\n", solutions);\n    return 0;\n}`,
    runnerUrl: 'https://www.onlinegdb.com/',
    runnerName: 'OnlineGDB',
    solutionNote:
      'Bug 1: the base case is row == 8 — row 7 must still place its queen (row == 7 counts a 7-queen board). Bug 2: after solve(row + 1), restore with cols[c] = 0 — otherwise later rows see phantom attacks. (This simplified checker prints 8 with both fixes; the point is the discipline, not the count.)',
  },
];
