import { res } from '../resources';
import type { Stage } from '../types';

export const s10: Stage = {
  id: 's10',
  phase: 'p3',
  title: 'Non-Linear Data Structures',
  goal: 'Binary trees, BSTs, heaps, tries — where recursion starts earning its keep.',
  days: 7,
  canStatements: [
    'Implement binary tree traversals, a complete BST with delete, a binary heap with both heapify directions, and a trie',
    'Explain when a heap beats a hash',
    'Sketch AVL rotations conceptually',
  ],
  topics: [
    {
      id: 's10.t1',
      order: 1,
      title: 'Binary trees & the three DFS traversals',
      concept:
        'Each node has ≤2 children. In/pre/post-order are the same recursion with the "visit" moved. Then re-do each iteratively with your own stack — recursion is optional once you own the stack.',
      resources: [res('weiss', 'ch. 4.1'), res('mycodeschool', 'trees')],
      viz: res('visualgo', 'tree animations + galles trees'),
      quizRefs: ['q.s10.1'],
    },
    {
      id: 's10.t2',
      order: 2,
      title: 'Level-order (BFS shape)',
      concept:
        'Process the tree wave by wave using your S08 queue. Printing "per line" teaches the two-counter trick (nodes-at-this-level vs next).',
      resources: [res('weiss', 'ch. 4.1')],
      quizRefs: ['q.s10.2'],
    },
    {
      id: 's10.t3',
      order: 3,
      title: 'BST: insert, search, min/max, successor',
      concept:
        'Left < node < right turns comparison into navigation: every step discards half the tree — O(log n) when balanced. Successor = next in sorted order (right subtree\u2019s leftmost, or ascend).',
      resources: [res('weiss', 'ch. 4.3')],
      viz: res('visualgo', 'BST viz with your own inputs'),
      quizRefs: ['q.s10.3', 'q.s10.4'],
    },
    {
      id: 's10.t4',
      order: 4,
      title: 'BST delete (the three cases)',
      concept:
        'Leaf: unlink. One child: splice. Two children: swap with successor, delete that. The two-children case is the interview minefield — drill it three separate days.',
      resources: [res('weiss', 'ch. 4.3')],
      quizRefs: ['q.s10.5', 'q.s10.6'],
    },
    {
      id: 's10.t5',
      order: 5,
      title: 'Heaps & priority queues',
      concept:
        'A complete binary tree in an array: children of i are 2i+1, 2i+2. Heapify-up on insert, heapify-down on extract — the array IS the tree. Heaps answer "best next thing" queries; hashes answer "is this present".',
      resources: [res('weiss', 'ch. 6')],
      viz: res('galles', 'heap animations'),
      quizRefs: ['q.s10.7', 'q.s10.8'],
    },
    {
      id: 's10.t6',
      order: 6,
      title: 'Heapsort',
      concept:
        'Build a heap in O(n), extract n times in O(n log n): in-place, worst-case-optimal, cache-unfriendly — sort theory in one paragraph.',
      resources: [res('weiss', 'ch. 6.4')],
      quizRefs: [],
    },
    {
      id: 's10.t7',
      order: 7,
      title: 'Tries',
      concept:
        'Prefix trees: one node per character-step. Autocomplete falls out of the structure — walk the prefix, collect the subtree. Memory-hungry, prefix-magical.',
      resources: [res('skiena', 'trie war stories')],
      viz: res('galles', 'trie animation'),
      quizRefs: ['q.s10.9'],
    },
    {
      id: 's10.t8',
      order: 8,
      title: 'Balance concept: AVL rotations',
      concept:
        'Degenerate BST = linked list. AVL keeps heights within 1 via rotations — single and double, sketched and animated. Implementing insert-rebalance is an optional stretch; concept is mandatory.',
      resources: [res('weiss', 'ch. 4.4 (concept)')],
      viz: res('visualgo', 'AVL rotation animations'),
      quizRefs: ['q.s10.10'],
    },
  ],
  drills: [
    { id: 's10.d1', title: 'All traversals, both ways', detail: 'recursive + iterative for in/pre/post; level-order with your queue.', difficulty: 2, platform: 'local' },
    { id: 's10.d2', title: 'Validate BST', detail: 'the min/max bounds recursion — a famous interview opener.', difficulty: 2, platform: 'local' },
    { id: 's10.d3', title: 'kth smallest in BST', detail: 'in-order counter — O(h) extra space.', difficulty: 2, platform: 'local' },
    { id: 's10.d4', title: 'Heapify + heapsort', detail: 'build heap from array, sort, verify against qsort.', difficulty: 2, platform: 'local' },
    { id: 's10.d5', title: 'Level lines', detail: 'print the tree level by level on separate lines.', difficulty: 2, platform: 'local' },
    { id: 's10.d6', title: 'Trie autocomplete', detail: 'insert a wordlist; prefix query returns completions.', difficulty: 3, platform: 'local' },
    { id: 's10.d7', title: 'BST delete every case ×3', detail: 'leaf, one-child, two-children — three separate sessions.', difficulty: 3, platform: 'local' },
  ],
  build: {
    id: 's10.build',
    name: 'WordIndex',
    brief:
      'A file indexer: reads text files, builds a BST keyed by word with occurrence lists, answers top-K frequent via your heap, completes prefixes via your trie. Stress-tested on a big text.',
    acceptance: [
      'BST + heap + trie all from your own implementations',
      'Top-K correct against a brute-force check',
      'Prefix completion interactive at the CLI',
      'valgrind-clean on a multi-megabyte corpus',
    ],
  },
  traps: [
    { id: 's10.tr1', mistake: 'Wrong BST delete case', why: 'two-children deletion must swap with the successor (or predecessor) — deleting the node outright loses a subtree.', quizRefs: ['q.s10.5'] },
    { id: 's10.tr2', mistake: 'Heapify loop index errors', why: 'children of i are 2i+1/2i+2 in 0-based arrays — off-by-one turns the heap into a random tree.', quizRefs: ['q.s10.7'] },
    { id: 's10.tr3', mistake: 'Iterating while mutating a tree', why: 'in-order pointers go stale the moment you delete. Collect, then mutate.', quizRefs: [] },
    { id: 's10.tr4', mistake: 'Forgetting recursive subtree frees', why: 'freeing the root leaks the forest. Post-order: children first, then self.', quizRefs: [] },
  ],
};
