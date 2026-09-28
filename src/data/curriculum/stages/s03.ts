import { res } from '../resources';
import type { Stage } from '../types';

export const s03: Stage = {
  id: 's03',
  phase: 'p1',
  title: 'The Memory Model',
  goal: 'The stage the whole roadmap bends around. Pointers, the heap, and the bugs that define C — slow down here on purpose.',
  days: 8,
  canStatements: [
    'Draw the memory diagram (stack/heap/data/text) for any small program',
    'Explain exactly what int *p = &x; *p = 5; does at the machine level',
    'Do pointer arithmetic with confidence',
    'Allocate, resize and free heap memory with zero leaks',
    'Recognize and name the four UB families that bite beginners',
  ],
  topics: [
    {
      id: 's03.t1',
      order: 1,
      title: 'Memory layout: text, data, stack, heap',
      concept:
        'Your program lives in segments: code (text), globals (data), the call stack growing down, the heap growing up. Every variable has an address; a pointer is just a variable that stores one.',
      resources: [res('csapp', 'ch. 3 (selected)'), res('king', 'ch. 11')],
      viz: res('pythonTutor', 'C memory diagrams — run every snippet here'),
      quizRefs: ['q.s03.1'],
    },
    {
      id: 's03.t2',
      order: 2,
      title: '& and * — address-of and dereference',
      concept:
        '&x is where x lives; *p follows a pointer to what it points at. int *p = &x; *p = 5; writes 5 straight into x through the pointer. NULL is a pointer that points nowhere — dereference it and die.',
      resources: [res('king', 'ch. 11'), res('mycodeschool', 'pointers series')],
      viz: res('galles', 'pointer animation'),
      quizRefs: ['q.s03.2', 'q.s03.3'],
    },
    {
      id: 's03.t3',
      order: 3,
      title: 'Pointer arithmetic & decay',
      concept:
        'p+1 moves by sizeof(*p) bytes — one int, not one byte. Arrays decay to pointers to their first element; a[i] is literally *(a+i). Watch godbolt confirm it in assembly.',
      resources: [res('king', 'ch. 11–12')],
      viz: res('godbolt', 'a[i] compiles to *(a+i)'),
      quizRefs: ['q.s03.4', 'q.s03.5'],
    },
    {
      id: 's03.t4',
      order: 4,
      title: 'Pointers & functions',
      concept:
        'Pass &x and the function can reach back and change x — that is pass-by-reference, C-style. It is also how functions return multiple values. Returning a pointer to a local variable is the classic beginner time bomb.',
      resources: [res('king', 'ch. 11'), res('mycodeschool', 'pointers with functions')],
      quizRefs: ['q.s03.6'],
    },
    {
      id: 's03.t5',
      order: 5,
      title: 'Pointer-to-pointer & const with pointers',
      concept:
        'char **argv is a pointer to pointers — the shape of every main(). const int *p (pointee frozen), int *const p (pointer frozen): say them out loud until they are obvious.',
      resources: [res('king', 'ch. 11, 17')],
      quizRefs: ['q.s03.7'],
    },
    {
      id: 's03.t6',
      order: 6,
      title: 'Function pointers',
      concept:
        'Code has addresses too. A function pointer lets you pass behavior as data — callbacks, qsort comparators, state machines. Syntax is ugly; one typedef heals it.',
      resources: [res('king', 'ch. 17')],
      quizRefs: ['q.s03.8'],
    },
    {
      id: 's03.t7',
      order: 7,
      title: 'Stack vs heap; malloc & friends',
      concept:
        'Stack: fast, automatic, dies with the function. Heap: yours until you free it. malloc asks for bytes, calloc zeroes them, realloc resizes, free returns them. Every malloc is a contract: exactly one free, eventually.',
      resources: [res('king', 'ch. 16'), res('csapp', 'ch. 9.9')],
      viz: res('pythonTutor', 'heap boxes appear and vanish'),
      quizRefs: ['q.s03.9', 'q.s03.10'],
    },
    {
      id: 's03.t8',
      order: 8,
      title: 'Leaks, dangling pointers, use-after-free',
      concept:
        'Lose the last pointer to heap memory and it leaks. Free it and keep using the pointer — use-after-free — and the heap serves you recycled garbage. valgrind names these diseases; ASan catches them in the act.',
      resources: [res('jacobSorber', 'memory management'), res('valgrind'), res('asan')],
      quizRefs: ['q.s03.11', 'q.s03.12', 'q.s03.13'],
    },
    {
      id: 's03.t9',
      order: 9,
      title: 'Undefined behavior taxonomy',
      concept:
        'Out-of-bounds access, uninitialized reads, bad dereferences, signed overflow: C promises nothing — the compiler may assume they never happen and optimize accordingly. -fsanitize=address makes them visible during development.',
      resources: [res('seacord', 'UB chapters')],
      quizRefs: ['q.s03.14'],
    },
    {
      id: 's03.t10',
      order: 10,
      title: 'Dynamic arrays: the grow-by-double pattern',
      concept:
        'When full, allocate double, copy, free the old. Amortized O(1) push — the pattern behind every vector you will ever build, and the seed of Stage 08.',
      resources: [res('king', 'ch. 17')],
      quizRefs: ['q.s03.15'],
    },
  ],
  drills: [
    { id: 's03.d1', title: 'Swap via pointers', detail: 'the canonical pass-by-reference proof.', difficulty: 1, platform: 'local' },
    { id: 's03.d2', title: 'Max via pointer walk', detail: 'no indices — move a pointer across the array.', difficulty: 2, platform: 'local' },
    { id: 's03.d3', title: 'Hand-rolled strlen/strcpy', detail: 'pointer-only versions, no [] allowed.', difficulty: 2, platform: 'local' },
    { id: 's03.d4', title: 'Growable int array', detail: 'doubling growth, 10^6-element stress test, valgrind-clean.', difficulty: 3, platform: 'local' },
    { id: 's03.d5', title: 'Dynamic N×M matrix', detail: 'malloc of pointers + the contiguous single-block variant; free both cleanly.', difficulty: 3, platform: 'local' },
    { id: 's03.d6', title: 'Function-pointer calculator', detail: 'dispatch table: operation name → function pointer.', difficulty: 2, platform: 'local' },
  ],
  build: {
    id: 's03.build',
    name: 'Arena & Vector',
    brief:
      'A growable generic vector (void* + element size, memcpy) and a bump allocator (arena) with reset; a stress harness proving correctness under load.',
    acceptance: [
      'Vector: O(1) amortized push, random access, pop; generic element size',
      'Arena: bump-allocate, reset in O(1), no per-object free needed',
      'Stress test: 10^6 operations, zero leaks (valgrind), zero UB (ASan)',
      'Zero warnings under -Wall -Wextra',
    ],
  },
  traps: [
    { id: 's03.tr1', mistake: 'int* p, q;', why: 'only p is a pointer — q is a plain int. One declaration per line ends the ambiguity.', quizRefs: ['q.s03.3'] },
    { id: 's03.tr2', mistake: 'sizeof on pointers vs arrays', why: 'sizeof(arr)/sizeof(arr[0]) works only where the array is declared; decayed to a parameter, sizeof is pointer-sized.', quizRefs: ['q.s03.5'] },
    { id: 's03.tr3', mistake: 'Use after free', why: 'the pointer still holds the old address; the memory is recycled. ASan catches it; valgrind names it.', quizRefs: ['q.s03.12'] },
    { id: 's03.tr4', mistake: 'Forgetting free on the realloc failure path', why: 'realloc returning NULL leaves the original block alive — overwrite the only pointer and you leak it.', quizRefs: ['q.s03.10'] },
    { id: 's03.tr5', mistake: 'Returning &local', why: 'the stack frame dies at return; the pointer outlives its target. Return heap or copies.', quizRefs: ['q.s03.6'] },
    { id: 's03.tr6', mistake: 'Thinking p++ moves one byte', why: 'it moves sizeof(*p) bytes — pointer arithmetic is typed.', quizRefs: ['q.s03.4'] },
  ],
};
