import { res } from '../resources';
import type { Stage } from '../types';

export const s08: Stage = {
  id: 's08',
  phase: 'p3',
  title: 'Linear Data Structures I',
  goal: 'Dynamic arrays, linked lists, stacks and queues — every one implemented from scratch, twice.',
  days: 7,
  canStatements: [
    'Implement dynamic array, singly/doubly/circular linked lists, stack and queue from scratch',
    'Recite each operation\u2019s complexity from understanding, not memory',
    'Use fast & slow pointers as a named pattern',
  ],
  topics: [
    {
      id: 's08.t1',
      order: 1,
      title: 'Dynamic array (consciously rebuilt)',
      concept:
        'Your S03 vector, rebuilt deliberately: push, pop, insert, remove — with the shift costs that make insert-in-middle O(n).',
      resources: [res('weiss', 'ch. 3.1–3.4')],
      viz: res('galles', 'array animations'),
      quizRefs: ['q.s08.1'],
    },
    {
      id: 's08.t2',
      order: 2,
      title: 'Singly linked list',
      concept:
        'Nodes with pointers instead of positions: insert at head is O(1), random access is O(n). Delete requires the *previous* node — the classic pointer-rewiring exercise. mycodeschool teaches this best.',
      resources: [res('weiss', 'ch. 3.2'), res('mycodeschool', 'linked list series')],
      viz: res('pythonTutor', 'node-and-arrow diagrams live'),
      quizRefs: ['q.s08.2', 'q.s08.3'],
    },
    {
      id: 's08.t3',
      order: 3,
      title: 'Doubly & circular variants',
      concept:
        'A prev pointer makes delete O(1) given the node and makes deques natural. Circular lists end where they begin — the Josephus problem\u2019s favorite home.',
      resources: [res('weiss', 'ch. 3.2')],
      quizRefs: ['q.s08.4'],
    },
    {
      id: 's08.t4',
      order: 4,
      title: 'Stack',
      concept:
        'LIFO: push, pop, peek. Build it on an array (index as top) AND on a linked list (head as top) — same contract, two bodies. Applications run the interview circuit: parentheses, undo, DFS.',
      resources: [res('weiss', 'ch. 3.6')],
      viz: res('visualgo', 'stack viz'),
      quizRefs: ['q.s08.5'],
    },
    {
      id: 's08.t5',
      order: 5,
      title: 'Queue, circular queue, deque',
      concept:
        'FIFO with head and tail. The circular queue reuses freed cells with (i+1) % capacity — and its full-vs-empty ambiguity is a famous interview trap (keep one slot free, or keep a count).',
      resources: [res('weiss', 'ch. 3.4')],
      viz: res('visualgo', 'queue viz'),
      quizRefs: ['q.s08.6', 'q.s08.7'],
    },
    {
      id: 's08.t6',
      order: 6,
      title: 'Fast & slow pointers',
      concept:
        'Two pointers, one moving twice as fast: find the middle in one pass, detect cycles (Floyd), find happy numbers. A named pattern you will reuse for years.',
      resources: [res('neetcode', 'fast & slow pointers')],
      quizRefs: ['q.s08.8'],
    },
    {
      id: 's08.t7',
      order: 7,
      title: 'Applications: parentheses & postfix',
      concept:
        'Balanced brackets: push opens, pop-and-match closes. Infix→postfix: operators wait on a stack until precedence says go. Both are pure stack choreography.',
      resources: [],
      quizRefs: ['q.s08.9'],
    },
  ],
  drills: [
    { id: 's08.d1', title: 'Reverse a linked list', detail: 'iteratively AND recursively — both, from memory.', difficulty: 2, platform: 'local' },
    { id: 's08.d2', title: 'Cycle detection', detail: "Floyd's tortoise & hare on a list you deliberately looped.", difficulty: 2, platform: 'local' },
    { id: 's08.d3', title: 'Middle in one pass', detail: 'fast & slow pointers, no counter.', difficulty: 2, platform: 'local' },
    { id: 's08.d4', title: 'Parentheses checker', detail: 'all three bracket types, nesting, graceful rejects.', difficulty: 2, platform: 'local' },
    { id: 's08.d5', title: 'Infix → postfix converter', detail: 'precedence-aware stack algorithm + evaluation of the result.', difficulty: 3, platform: 'local' },
    { id: 's08.d6', title: 'Circular-queue wraparound tests', detail: 'fill, drain, refill — prove the modulo arithmetic.', difficulty: 2, platform: 'local' },
    { id: 's08.d7', title: 'Implement everything twice', detail: 'array AND linked versions of stack & queue, one test suite.', difficulty: 3, platform: 'local' },
  ],
  build: {
    id: 's08.build',
    name: 'ListForge',
    brief:
      'A linear-DS library: vector, slist, dlist, stack, queue, deque — every operation unit-tested, valgrind-clean, complexities documented in the headers.',
    acceptance: [
      'Six structures, one consistent API style',
      'Per-operation test coverage including empty/full/one-element edges',
      'valgrind-clean under stress',
      'Complexity table shipped in the header comments',
    ],
  },
  traps: [
    { id: 's08.tr1', mistake: 'Losing the head on delete-first', why: 'rewire before you free; keep a temp pointer. Draw the arrows before you type.', quizRefs: ['q.s08.3'] },
    { id: 's08.tr2', mistake: 'Leaking every deleted node', why: 'free the node, not just unlink it — valgrind counts.', quizRefs: ['q.s08.3'] },
    { id: 's08.tr3', mistake: 'Circular queue full-vs-empty ambiguity', why: 'both look identical without a rule. Keep one slot free or maintain a count.', quizRefs: ['q.s08.6'] },
    { id: 's08.tr4', mistake: 'Reversing with recursion and losing nodes', why: 'the recursive reverse returns the new head — ignore it and the rest of the list vanishes.', quizRefs: ['q.s08.2'] },
  ],
};
