import type { QuizItem } from './types';

/**
 * S14 — Dynamic Programming: 14-item set (BLUEPRINT: 14).
 * Memo→table, grids, knapsack, LCS, LIS, coins, greedy boundary.
 */

export const s14Items: QuizItem[] = [
  /* mcq ×4 */
  {
    id: 'q.s14.mc1',
    stageId: 's14',
    format: 'mcq',
    difficulty: 1,
    targets: 's14.t1 — the two DP preconditions',
    explanation: 'DP needs BOTH: overlapping subproblems (the same states recur — memoization pays) and optimal substructure (best answers compose). Missing either, DP is the wrong tool.',
    prompt: 'A problem is a DP candidate when:',
    options: [
      'It is recursive',
      'The same subproblems recur AND optimal answers compose from optimal sub-answers',
      'It involves grids',
      'Greedy already solves it',
    ],
    answer: 1,
  },
  {
    id: 'q.s14.mc2',
    stageId: 's14',
    format: 'mcq',
    difficulty: 2,
    targets: 's14.t2 — the fibonacci complexity collapse',
    explanation: 'Naive fib is O(2ⁿ) (recomputation), memo and table are O(n), and two rolling variables are O(n) time with O(1) space. Same recurrence — four designs.',
    prompt: 'Naive recursive fib(30) vs memoized: the memo version wins because:',
    options: [
      'It avoids recursion entirely',
      'Each subproblem is computed once — 30 states instead of ~2³⁰ calls',
      'It uses less memory',
      'The compiler optimizes it',
    ],
    answer: 1,
  },
  {
    id: 'q.s14.mc3',
    stageId: 's14',
    format: 'mcq',
    difficulty: 2,
    targets: 's14.t7 — coin change loop order',
    explanation: 'Coins OUTSIDE, amounts inside → combinations (order ignored). Amounts outside, coins inside → permutations (order matters). Same items, different loop nesting, different answers.',
    prompt: 'Coin change: counting COMBINATIONS (not permutations) requires:',
    options: [
      'The coin loop outside, the amount loop inside',
      'The amount loop outside, the coin loop inside',
      'Sorting the coins first',
      'A visited set',
    ],
    answer: 0,
  },
  {
    id: 'q.s14.mc4',
    stageId: 's14',
    format: 'mcq',
    difficulty: 3,
    targets: 's14.t8 — when greedy wins instead',
    explanation: 'Greedy is correct when a local choice provably stays optimal (fractional knapsack by ratio, interval scheduling by end time). 0/1 knapsack breaks greedy — DP required.',
    prompt: 'Fractional knapsack is greedy-solvable but 0/1 knapsack is not, because:',
    options: [
      'Fractions are easier to compute',
      'Taking a fraction of the best-ratio item leaves no regret — a whole item can crowd out two better ones, so greedy needs proof that fails',
      '0/1 knapsack is not an optimization problem',
      'DP cannot solve fractional knapsack',
    ],
    answer: 1,
  },

  /* predict-output ×3 */
  {
    id: 'q.s14.po1',
    stageId: 's14',
    format: 'predict-output',
    difficulty: 1,
    targets: 's14.t2 — the table fill',
    explanation: 'fib table: 0,1,1,2,3,5 — each cell is the sum of the two before it. The table IS the recursion, flattened.',
    prompt: 'What does tab[5] hold?',
    code: `tab[0] = 0; tab[1] = 1;\nfor (int i = 2; i <= 5; i++)\n    tab[i] = tab[i-1] + tab[i-2];\n/* tab[5] = ? */`,
    answer: '5',
  },
  {
    id: 'q.s14.po2',
    stageId: 's14',
    format: 'predict-output',
    difficulty: 2,
    targets: 's14.t3 — grid paths recurrence',
    explanation: 'Each cell = above + left. Row-major fill: 1,3,6 / 1,4,10 — the (2,3) grid has 10 unique monotone paths. Pascal\'s triangle wearing a grid costume.',
    prompt: 'How many unique paths in the 2×3 grid (moving only right/down)?',
    code: `/* dp[r][c] = dp[r-1][c] + dp[r][c-1]\n   first row/col all 1\n   grid: 2 rows × 3 cols; dp[1][2] = ? */`,
    answer: '10',
  },
  {
    id: 'q.s14.po3',
    stageId: 's14',
    format: 'predict-output',
    difficulty: 3,
    targets: 's14.t7 — min coins trace',
    explanation: 'dp[1..5] with coins {1,3,4}: 1,2,1,1,2 — dp[5] = 1 + min(dp[4], dp[2], dp[1]) = 1 + 1 = 2 (4+1). Greedy (4 then 1) happens to match here; DP is provably right everywhere.',
    prompt: 'Minimum coins for 5 from {1, 3, 4}?',
    code: `/* dp[x] = 1 + min(dp[x-c]) over coins c <= x\n   dp[0] = 0\n   dp[5] = ?  (coins {1,3,4}) */`,
    answer: '2',
  },

  /* fill-blank ×3 */
  {
    id: 'q.s14.fb1',
    stageId: 's14',
    format: 'fill-blank',
    difficulty: 1,
    targets: 's14.t1 — memoization check',
    explanation: 'Memoize: if the state was computed, return it. The check-before-work discipline is what turns exponential into linear.',
    prompt: 'Return the cached answer if present.',
    code: `long fib(int n) {\n    if (memo[n] != -1) ___ memo[n];\n    return memo[n] = fib(n-1) + fib(n-2);\n}`,
    answers: [['return']],
  },
  {
    id: 'q.s14.fb2',
    stageId: 's14',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's14.t4 — the knapsack take/skip',
    explanation: 'dp[i][w] = max(skip: dp[i-1][w], take: value[i] + dp[i-1][w-wt[i]]). The two-branch max IS 0/1 knapsack.',
    prompt: 'Complete the take branch of 0/1 knapsack.',
    code: `dp[i][w] = max(dp[i-1][w],\n               val[i] + dp[i-1][w ___ wt[i]]);`,
    answers: [['-']],
  },
  {
    id: 'q.s14.fb3',
    stageId: 's14',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's14.tr1 — table border semantics',
    explanation: '"First i items, capacity w" semantics needs the 0-item row all zeros (nothing fits in nothing). Border cells encode the base case — wrong borders poison the whole table.',
    prompt: 'Initialize the border of the knapsack table.',
    code: `/* dp[i][w]: best value using FIRST i items, capacity w */\nfor (w = 0; w <= W; w++)\n    dp[___][w] = 0;   /* zero items → zero value */`,
    answers: [['0']],
  },

  /* find-the-bug ×2 */
  {
    id: 'q.s14.ftb1',
    stageId: 's14',
    format: 'find-bug',
    difficulty: 2,
    targets: 's14.tr2 — memo keyed on partial state',
    explanation: 'The memo ignores remaining capacity — two calls with the same index but different capacities collide and return confident garbage. The memo key is the FULL state (index, capacity).',
    prompt: 'The memo returns wrong answers. Click the key that is too small.',
    code: `int steal(int i, int cap) {\n    if (i == n || cap == 0) return 0;\n    if (memo[i] != -1)           /* ??? */\n        return memo[i];\n    int skip = steal(i + 1, cap);\n    int take = wt[i] <= cap ? val[i] + steal(i + 1, cap - wt[i]) : INT_MIN;\n    return memo[i] = max(skip, take);\n}`,
    answerLine: 4,
  },
  {
    id: 'q.s14.ftb2',
    stageId: 's14',
    format: 'find-bug',
    difficulty: 3,
    targets: 's14.t7 — counting coins with the wrong loop order',
    explanation: 'Amounts outside, coins inside counts PERMUTATIONS (each order separately). For combinations, coins must be the outer loop so each coin\'s use is decided once, in sequence.',
    prompt: 'This counts permutations, not combinations. Click the loop that is on the wrong side.',
    code: `int count_ways(int amount, int *coins, int m) {\n    int dp[100] = {1, 0};\n    for (int x = 1; x <= amount; x++)      /* ??? */\n        for (int i = 0; i < m; i++)\n            if (x >= coins[i])\n                dp[x] += dp[x - coins[i]];\n    return dp[amount];\n}`,
    answerLine: 3,
  },

  /* ordering ×1 */
  {
    id: 'q.s14.ord1',
    stageId: 's14',
    format: 'ordering',
    difficulty: 2,
    targets: 's14.t2 — naive → memo → table progression',
    explanation: 'The DP ladder: write the recursion, memoize its states, flip to a table (iteration), then squeeze space. Each step preserves the answer while cutting cost.',
    prompt: 'Order the DP design progression.',
    steps: [
      'Define the state and write the naive recursion',
      'Memoize: cache each state on first computation',
      'Tabulate: fill a table iteratively in dependency order',
      'Shrink space with rolling rows/variables if only recent states are used',
    ],
  },

  /* match ×1 */
  {
    id: 'q.s14.match1',
    stageId: 's14',
    format: 'match',
    difficulty: 2,
    targets: 's14.t3–t7 — family → signature recurrence',
    explanation: 'Each DP family has a one-line recurrence: grids sum neighbors, knapsack maxes take/skip, LCS walks two strings, LIS looks back at smaller predecessors, coins minimize over last coin.',
    prompt: 'Match each DP family to its recurrence shape.',
    pairs: [
      { left: 'grid paths', right: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]' },
      { left: '0/1 knapsack', right: 'max(skip, take: val + dp[i-1][w-wt])' },
      { left: 'LCS', right: 'match ? 1+diag : max(up, left)' },
      { left: 'LIS', right: 'dp[i] = 1 + max(dp[j] for j < i, a[j] < a[i])' },
    ],
  },
];
