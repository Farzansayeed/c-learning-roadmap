import { res } from '../resources';
import type { Stage } from '../types';

export const s11: Stage = {
  id: 's11',
  phase: 'p3',
  title: 'Graphs',
  goal: 'Model networks and master the two traversals everything else builds on — plus shortest paths, topo sort, union-find, MST, A*.',
  days: 6,
  canStatements: [
    'Represent graphs both ways and pick per scenario',
    'Implement BFS and DFS from memory in three variants (queue/stack/recursion)',
    'Run topo sort and cycle detection',
    'Implement Dijkstra; explain Bellman-Ford\u2019s niche',
    'Explain union-find and MST conceptually',
  ],
  topics: [
    {
      id: 's11.t1',
      order: 1,
      title: 'Representations: matrix vs list',
      concept:
        'Matrix: O(1) edge lookup, O(V²) memory — dense graphs. List: O(degree) lookup, O(V+E) memory — sparse graphs (the real world). Know both; build both.',
      resources: [res('weiss', 'ch. 9.1')],
      viz: res('visualgo', 'graph viz'),
      quizRefs: ['q.s11.1'],
    },
    {
      id: 's11.t2',
      order: 2,
      title: 'BFS',
      concept:
        'Queue-driven wavefront: mark visited when ENQUEUED (not dequeued — the duplicate bug). BFS finds shortest paths in unweighted graphs as a side effect.',
      resources: [res('weiss', 'ch. 9.3'), res('williamFiset', 'BFS')],
      viz: res('visualgo', 'BFS animation'),
      quizRefs: ['q.s11.2'],
    },
    {
      id: 's11.t3',
      order: 3,
      title: 'DFS (stack + recursion)',
      concept:
        'Dive deep, backtrack. Explicit stack or the call stack — same order, different failure modes (recursion depth!). DFS powers cycle detection and topo sort.',
      resources: [res('weiss', 'ch. 9.3'), res('williamFiset', 'DFS')],
      quizRefs: ['q.s11.3'],
    },
    {
      id: 's11.t4',
      order: 4,
      title: 'Components & cycle detection',
      concept:
        'Unvisited after a BFS/DFS? New component. A back edge to an in-progress node = cycle (track 3 colors: white/gray/black for directed).',
      resources: [res('williamFiset', 'cycle detection')],
      quizRefs: ['q.s11.4'],
    },
    {
      id: 's11.t5',
      order: 5,
      title: "Topological sort (Kahn's)",
      concept:
        'Repeatedly remove zero-indegree nodes; the removal order is a valid schedule. If you cannot remove everything, a cycle exists — sort-as-detector.',
      resources: [res('weiss', 'ch. 9.5'), res('williamFiset', 'topo sort')],
      quizRefs: ['q.s11.5'],
    },
    {
      id: 's11.t6',
      order: 6,
      title: 'Dijkstra with your heap',
      concept:
        'BFS + weights: repeatedly settle the closest unsettled node, relax its edges. Uses your S10 heap. No decrease-key needed — re-push lazily; stale entries skipped on pop.',
      resources: [res('weiss', 'ch. 9.3'), res('abdulBari', 'Dijkstra')],
      viz: res('visualgo', 'Dijkstra step-through'),
      quizRefs: ['q.s11.6', 'q.s11.7'],
    },
    {
      id: 's11.t7',
      order: 7,
      title: 'Bellman-Ford (concept)',
      concept:
        'Relax every edge V-1 times: handles negative weights Dijkstra cannot, and a still-improving round proves a negative cycle. Slower, more general.',
      resources: [res('weiss', 'ch. 9.3 (concept)'), res('abdulBari', 'Bellman-Ford')],
      quizRefs: ['q.s11.8'],
    },
    {
      id: 's11.t8',
      order: 8,
      title: 'Union-Find',
      concept:
        'Disjoint sets with find + union; path compression + union by rank make it near-O(1) amortized. Kruskal\u2019s skeleton and connectivity queries in one structure.',
      resources: [res('weiss', 'ch. 9'), res('williamFiset', 'union-find')],
      quizRefs: ['q.s11.9'],
    },
    {
      id: 's11.t9',
      order: 9,
      title: 'MST: Kruskal & Prim',
      concept:
        'Kruskal: sort edges, add if union succeeds. Prim: grow one tree via your heap. Both provably minimal — implement Kruskal (easier with your union-find), sketch Prim.',
      resources: [res('weiss', 'ch. 9.5'), res('abdulBari', 'MST')],
      quizRefs: ['q.s11.10'],
    },
    {
      id: 's11.t10',
      order: 10,
      title: 'A* (optional stretch)',
      concept:
        'Dijkstra + an admissible heuristic (never overestimate) — the pathfinder upgrade. Measure nodes-explored vs Dijkstra on the same maze and see the heuristic pay rent.',
      resources: [res('skiena', 'A* section')],
      quizRefs: [],
    },
  ],
  drills: [
    { id: 's11.d1', title: 'Both representations', detail: 'same graph as matrix and list; same traversals from each.', difficulty: 2, platform: 'local' },
    { id: 's11.d2', title: 'BFS + DFS printouts', detail: 'identical graph, two orders, explained.', difficulty: 2, platform: 'local' },
    { id: 's11.d3', title: 'Course-scheduler topo sort', detail: 'prerequisites in, valid order (or "cycle!") out.', difficulty: 2, platform: 'local' },
    { id: 's11.d4', title: 'Island count', detail: 'binary grid, count connected components — the classic interview opener.', difficulty: 2, platform: 'local' },
    { id: 's11.d5', title: 'Maze pathfinder prototype', detail: 'BFS shortest path on a text maze.', difficulty: 2, platform: 'local' },
    { id: 's11.d6', title: 'Dijkstra on a weighted grid', detail: 'terrain costs; compare path vs BFS\u2019s.', difficulty: 3, platform: 'local' },
    { id: 's11.d7', title: 'Kruskal MST', detail: 'edges sorted + your union-find; verify total weight.', difficulty: 3, platform: 'local' },
    { id: 's11.d8', title: 'A* stretch', detail: 'heuristic upgrade; nodes-explored comparison vs Dijkstra.', difficulty: 3, platform: 'local' },
  ],
  build: {
    id: 's11.build',
    name: 'Pathfinder',
    brief:
      'Grid-maze loader → adjacency structure → BFS shortest path + Dijkstra weighted variant → animated ASCII output of visited order and final path; BFS-vs-Dijkstra comparison on weighted mazes.',
    acceptance: [
      'BFS correct on unweighted mazes (shortest = fewest steps)',
      'Dijkstra correct on weighted mazes (shortest = least cost)',
      'Visited-order visualization renders step by step',
      'Your own queue + heap drive the algorithms',
    ],
  },
  traps: [
    { id: 's11.tr1', mistake: 'Forgetting the visited set', why: 'cycles send BFS/DFS into infinite loops. Mark on enqueue/discover, never on nothing.', quizRefs: ['q.s11.2'] },
    { id: 's11.tr2', mistake: 'Marking visited at dequeue', why: 'a node can be enqueued twice before processing — duplicates explode the queue. Mark when discovered.', quizRefs: ['q.s11.2'] },
    { id: 's11.tr3', mistake: 'Stale Dijkstra distances', why: 'lazy re-insertion leaves old heap entries; skip popped nodes already settled.', quizRefs: ['q.s11.7'] },
    { id: 's11.tr4', mistake: 'Directed vs undirected confusion', why: 'undirected edges go both ways — forget the reverse edge and half the graph vanishes.', quizRefs: ['q.s11.1'] },
  ],
};
