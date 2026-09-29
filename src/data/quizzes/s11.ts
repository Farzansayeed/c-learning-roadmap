import type { QuizItem } from './types';

/**
 * S11 — Graphs: 24-item set (BLUEPRINT: 24, largest P3 stage).
 * Representations, BFS/DFS, topo sort, Dijkstra, Bellman-Ford,
 * union-find, MST.
 */

export const s11Items: QuizItem[] = [
  /* mcq ×5 */
  {
    id: 'q.s11.mc1',
    stageId: 's11',
    format: 'mcq',
    difficulty: 1,
    targets: 's11.t1 — matrix vs list',
    explanation: 'Adjacency matrix: O(1) edge lookup, O(V²) memory — dense graphs. Adjacency list: O(degree) lookup, O(V+E) memory — sparse graphs, which most real graphs are.',
    prompt: 'For a SPARSE graph with 10,000 vertices, the right representation is:',
    options: [
      'Adjacency matrix — lookup must be O(1)',
      'Adjacency list — O(V+E) memory beats the matrix\'s O(V²)',
      'Either — memory is identical',
      'A hash table of edges only',
    ],
    answer: 1,
  },
  {
    id: 'q.s11.mc2',
    stageId: 's11',
    format: 'mcq',
    difficulty: 2,
    targets: 's11.tr2 — mark on enqueue, not dequeue',
    explanation: 'Mark when ENQUEUED: a node reachable by two paths gets enqueued twice before either copy is dequeued — duplicates waste work and can corrupt path logic.',
    prompt: 'Why must BFS mark nodes visited when ENQUEUED, not when dequeued?',
    options: [
      'Dequeueing is too slow',
      'The same node can be enqueued twice before either copy is processed',
      'The queue requires sorted entries',
      'It does not matter — both are correct',
    ],
    answer: 1,
  },
  {
    id: 'q.s11.mc3',
    stageId: 's11',
    format: 'mcq',
    difficulty: 2,
    targets: 's11.t2 — BFS shortest-path side effect',
    explanation: 'BFS explores in waves of equal edge-count: the first time you reach a node is via a fewest-edges path. True only for UNWEIGHTED graphs — weights need Dijkstra.',
    prompt: 'BFS finds shortest paths as a side effect — in which graphs?',
    options: ['Any graph', 'Unweighted graphs (or all weights equal)', 'Only trees', 'Only DAGs'],
    answer: 1,
  },
  {
    id: 'q.s11.mc4',
    stageId: 's11',
    format: 'mcq',
    difficulty: 3,
    targets: 's11.tr3 — stale Dijkstra entries',
    explanation: 'Lazy Dijkstra re-pushes improved distances instead of decrease-key: stale (longer) entries remain in the heap. Pop, check against the settled distance, skip if outdated.',
    prompt: 'In lazy Dijkstra, what do you do when a popped heap entry is stale?',
    options: [
      'Rehash the heap',
      'Compare its distance to the settled best — skip if it is worse',
      'Restart the algorithm',
      'Stale entries cannot happen',
    ],
    answer: 1,
  },
  {
    id: 'q.s11.mc5',
    stageId: 's11',
    format: 'mcq',
    difficulty: 2,
    targets: 's11.t7 — Bellman-Ford niche',
    explanation: 'Relax all edges V-1 times: handles NEGATIVE weights, and a round V that still improves proves a negative cycle. Dijkstra is faster but cannot touch negatives.',
    prompt: 'Why run Bellman-Ford instead of Dijkstra?',
    options: [
      'It is always faster',
      'The graph may contain negative edge weights',
      'It needs no queue',
      'It works on disconnected graphs only',
    ],
    answer: 1,
  },

  /* predict-output ×4 */
  {
    id: 'q.s11.po1',
    stageId: 's11',
    format: 'predict-output',
    difficulty: 2,
    targets: 's11.t2 — BFS wave order',
    explanation: 'From A: wave 0 = A; wave 1 = B, C (neighbors in list order); wave 2 = D. BFS visits by layers — output A B C D.',
    prompt: 'What does this BFS print?',
    code: `/* graph: A-B, A-C, B-D, C-D; adjacency lists keep\n   insertion order; BFS from A */`,
    answer: 'A B C D',
  },
  {
    id: 'q.s11.po2',
    stageId: 's11',
    format: 'predict-output',
    difficulty: 3,
    targets: 's11.t3 — DFS dives deep first',
    explanation: 'DFS from A: A → B (first neighbor) → D → then backtrack; C is reached last. Depth-first: A B D C — the exact opposite flavor of BFS\'s waves.',
    prompt: 'What does this DFS print?',
    code: `/* same graph: A-B, A-C, B-D, C-D\n   DFS from A, recursive, neighbors in list order */`,
    answer: 'A B D C',
  },
  {
    id: 'q.s11.po3',
    stageId: 's11',
    format: 'predict-output',
    difficulty: 2,
    targets: 's11.t8 — union-find connectivity',
    explanation: '1-2 union, 3-4 union, then 2-4 union merges the two sets: {1,2,3,4}. find(1) == find(3) is true — connectivity is transitive through unions.',
    prompt: 'What does this print?',
    code: `/* union(1,2); union(3,4); union(2,4);\n   query: find(1) == find(3) ? */`,
    answer: 'true',
    accepts: ['true', '1', 'yes', 'connected'],
  },
  {
    id: 'q.s11.po4',
    stageId: 's11',
    format: 'predict-output',
    difficulty: 3,
    targets: 's11.t6 — Dijkstra settles in distance order',
    explanation: 'From A: settle A(0), then B(1), then C(3) — even though A-C is an edge, B(1) < C(3) settles first. Dijkstra pops by current-best distance.',
    prompt: 'Which node settles second?',
    code: `/* A --1--> B, A --3--> C, B --5--> C\n   Dijkstra from A; settle order? (2nd) */`,
    answer: 'B',
  },

  /* fill-blank ×3 */
  {
    id: 'q.s11.fb1',
    stageId: 's11',
    format: 'fill-blank',
    difficulty: 1,
    targets: 's11.tr1 — the visited guard',
    explanation: 'Without a visited set, every cycle loops forever. Mark on discovery — the one-line fix for infinite graph traversal.',
    prompt: 'Guard the traversal against cycles.',
    code: `if (visited[node]) ___;\nvisited[node] = 1;\nfor (each neighbor) dfs(neighbor);`,
    answers: [['return']],
  },
  {
    id: 'q.s11.fb2',
    stageId: 's11',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's11.t5 — Kahn zero-indegree queue',
    explanation: 'Kahn\'s algorithm: repeatedly dequeue zero-indegree nodes and decrement their neighbors. Empty queue with pending nodes = cycle.',
    prompt: 'Seed Kahn\'s algorithm with the right starters.',
    code: `for (v = 0; v < V; v++)\n    if (indeg[v] == ___)\n        enqueue(q, v);`,
    answers: [['0']],
  },
  {
    id: 'q.s11.fb3',
    stageId: 's11',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's11.t6 — edge relaxation',
    explanation: 'Relaxation: if dist[u] + w < dist[v], the path through u is better — update. It is the only operation shortest-path algorithms repeat.',
    prompt: 'Write the relaxation test.',
    code: `if (dist[u] + w ___ dist[v])\n    dist[v] = dist[u] + w;`,
    answers: [['<']],
  },

  /* find-the-bug ×3 */
  {
    id: 'q.s11.ftb1',
    stageId: 's11',
    format: 'find-bug',
    difficulty: 2,
    targets: 's11.tr4 — undirected edges go both ways',
    explanation: 'Undirected graph: every edge is two directed arcs. Adding only (u,v) and not (v,u) hides half the graph — BFS/DFS then miss reachable nodes.',
    prompt: 'This builder breaks undirectedness. Click the missing direction.',
    code: `void add_edge(Graph *g, int u, int v) {\n    g->adj[u][g->count[u]++] = v;\n    /* one-way street */\n}`,
    answerLine: 3,
  },
  {
    id: 'q.s11.ftb2',
    stageId: 's11',
    format: 'find-bug',
    difficulty: 2,
    targets: 's11.tr2 — visited at dequeue',
    explanation: 'Marking at dequeue lets duplicates pile up in the queue (marked too late). The visited check must happen at ENQUEUE time.',
    prompt: 'Duplicates flood the queue. Click the line that marks too late.',
    code: `void bfs(Graph *g, int s) {\n    enqueue(q, s);\n    while (!empty(q)) {\n        int u = dequeue(q);\n        visited[u] = 1;          /* ??? */\n        for (each v in adj[u])\n            if (!visited[v]) enqueue(q, v);\n    }\n}`,
    answerLine: 5,
  },
  {
    id: 'q.s11.ftb3',
    stageId: 's11',
    format: 'find-bug',
    difficulty: 3,
    targets: 's11.tr3 — skipping the stale check',
    explanation: 'Lazy Dijkstra pops stale entries: without comparing entry distance to dist[u], stale copies re-relax neighbors and can produce wrong (too-long) settled paths.',
    prompt: 'Stale entries corrupt the answer. Click the missing guard.',
    code: `while (!empty(pq)) {\n    Entry e = pop(pq);\n    int u = e.node;\n    for (each (v, w) in adj[u]) {\n        if (dist[u] + w < dist[v]) {\n            dist[v] = dist[u] + w;\n            push(pq, v, dist[v]);\n        }\n    }\n}`,
    answerLine: 3,
  },

  /* why-crash ×2 */
  {
    id: 'q.s11.wc1',
    stageId: 's11',
    format: 'why-crash',
    difficulty: 2,
    targets: 's11.t3 — recursion depth on big graphs',
    explanation: 'Recursive DFS depth = longest path — up to V frames. A 100k-node path overflows the stack; the explicit-stack DFS handles any depth.',
    prompt: 'Recursive DFS dies on a 100,000-node path graph. Why?',
    code: `void dfs(int v) {            /* each unreturned call
    visited[v] = 1;             is one live stack frame */
    for (int u : adj[v])
        if (!visited[u]) dfs(u);  /* depth = longest path */
}`, /* a 100k-node path ⇒ dfs nested 100,000 frames deep */
    options: [
      'Graphs must be matrices',
      'The recursion is V frames deep — the call stack overflows',
      'DFS needs a visited array',
      'Path graphs are cyclic',
    ],
    answer: 1,
  },
  {
    id: 'q.s11.wc2',
    stageId: 's11',
    format: 'why-crash',
    difficulty: 3,
    targets: 's11.t8 — union-find without path compression',
    explanation: 'Without path compression (and union by rank), find() degenerates to O(n) chains — the "near-O(1)" claim collapses; stress tests time out rather than crash, but deep recursion in find dies the same way as wc1.',
    prompt: 'This union-find crawls on large inputs. What is missing?',
    code: `int find(int x) {\n    while (parent[x] != x)\n        x = parent[x];\n    return x;\n}\n/* unions always attach to the first root */`,
    options: [
      'find needs recursion, not a loop',
      'No path compression (and no union by rank) — chains grow linear',
      'parent should be a hash table',
      'The loop needs a visited set',
    ],
    answer: 1,
  },

  /* ordering ×2 */
  {
    id: 'q.s11.ord1',
    stageId: 's11',
    format: 'ordering',
    difficulty: 2,
    targets: 's11.t5 — Kahn\'s algorithm sequence',
    explanation: 'Kahn: compute indegrees, seed the zero-indegree queue, process-and-decrement, and detect cycles when the output is shorter than V.',
    prompt: 'Order Kahn\'s topological sort.',
    steps: [
      'Compute in-degrees of all vertices',
      'Enqueue every zero-indegree vertex',
      'Dequeue u, append to order, decrement each neighbor\'s indegree',
      'Enqueue neighbors that just hit zero',
      'If order < V, the graph has a cycle',
    ],
  },
  {
    id: 'q.s11.ord2',
    stageId: 's11',
    format: 'ordering',
    difficulty: 2,
    targets: 's11.t9 — Kruskal sequence',
    explanation: 'Kruskal: sort edges by weight, take each if its endpoints are unconnected (union succeeds), stop at V-1 edges — the MST.',
    prompt: 'Order Kruskal\'s MST.',
    steps: [
      'Sort all edges by weight',
      'For each edge: find both endpoints\' roots',
      'If roots differ, add the edge to the MST and union the sets',
      'Stop when V-1 edges are chosen',
    ],
  },

  /* mcq (extra) — directed cycles need the third color */
  {
    id: 'q.s11.mc6',
    stageId: 's11',
    format: 'mcq',
    difficulty: 3,
    targets: 's11.t4 — directed cycle detection needs 3 colors',
    explanation: 'Directed graphs: a back edge to a GRAY (in-progress) node is a cycle; reaching a BLACK (done) node is fine — its subtree was fully explored. Two colors confuse finished with in-progress.',
    prompt: 'Why does cycle detection in DIRECTED graphs need three colors (white/gray/black), not just visited/unvisited?',
    options: [
      'Black nodes are already sorted — the color orders them',
      'A back edge to an in-progress (gray) node is a cycle; reaching a finished (black) node is not — two colors cannot tell them apart',
      'Three colors make BFS faster',
      'Directed graphs have three edge types by definition',
    ],
    answer: 1,
  },

  /* fill-blank (extra) — island count marking */
  {
    id: 'q.s11.fb4',
    stageId: 's11',
    format: 'fill-blank',
    difficulty: 2,
    targets: 's11.t4 — flood-fill marking (island count)',
    explanation: 'Island counting: walk the grid; each unvisited land cell starts a flood fill that MARKS its whole component. The count of fill launches IS the component count.',
    prompt: 'Count components — mark the cell before expanding.',
    code: `void fill(int r, int c) {
    if (grid[r][c] != LAND || seen[r][c]) return;
    seen[r][c] = ___;
    fill(r+1, c); fill(r-1, c); fill(r, c+1); fill(r, c-1);
}`,
    answers: [['1', 'true']],
  },

  /* predict-output (extra) — components after unions */
  {
    id: 'q.s11.po5',
    stageId: 's11',
    format: 'predict-output',
    difficulty: 2,
    targets: 's11.t8 — union-find counts components',
    explanation: '5 singleton sets; each successful union merges two into one: 5 → 4 → 3 → 3 (a redundant union changes nothing). Components = 3 — Kruskal uses exactly this counter.',
    prompt: 'How many components remain? (started at 5 singletons)',
    code: `/* components = 5
   union(1,2) — merged
   union(3,4) — merged
   union(1,3) — merged
   union(2,4) — redundant, already same set */`,
    answer: '3',
  },

  /* match ×2 */
  {
    id: 'q.s11.match1',
    stageId: 's11',
    format: 'match',
    difficulty: 2,
    targets: 's11.t2/t3/t6/t7 — algorithm → its tool',
    explanation: 'BFS runs on a queue, DFS on a stack/recursion, Dijkstra on a priority queue, Bellman-Ford on plain edge loops. The data structure IS the algorithm.',
    prompt: 'Match each algorithm to its core structure.',
    pairs: [
      { left: 'BFS', right: 'queue — wavefront order' },
      { left: 'DFS', right: 'stack / call stack — dive and backtrack' },
      { left: 'Dijkstra', right: 'min-priority queue — closest unsettled first' },
      { left: 'Bellman-Ford', right: 'V-1 full edge sweeps, no PQ' },
    ],
  },
  {
    id: 'q.s11.match2',
    stageId: 's11',
    format: 'match',
    difficulty: 3,
    targets: 's11.t4/t5/t8/t9 — problem → algorithm',
    explanation: 'Build order → topo sort. Connectivity/components → union-find or BFS. Negative weights → Bellman-Ford. Cheapest wiring → MST (Kruskal/Prim).',
    prompt: 'Match each problem to its algorithm.',
    pairs: [
      { left: 'course prerequisites ordering', right: 'topological sort (Kahn)' },
      { left: 'count connected friend circles', right: 'union-find or BFS components' },
      { left: 'shortest path with negative edges', right: 'Bellman-Ford' },
      { left: 'cheapest way to wire all cities', right: 'minimum spanning tree' },
    ],
  },
];
