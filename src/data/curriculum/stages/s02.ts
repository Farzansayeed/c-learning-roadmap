import { res } from '../resources';
import type { Stage } from '../types';

export const s02: Stage = {
  id: 's02',
  phase: 'p1',
  title: 'C Fundamentals II',
  goal: 'Break problems into functions; own arrays, strings and your first recursion.',
  days: 6,
  canStatements: [
    'Decompose any small problem into functions',
    'Write recursive functions with correct base cases',
    'Manipulate 1D/2D arrays and strings with loops, no library calls',
  ],
  topics: [
    {
      id: 's02.t1',
      order: 1,
      title: 'Functions, scope, prototypes',
      concept:
        'Functions take copies of their arguments — changing a parameter changes nothing outside. Prototypes let the compiler check every call before the function body exists.',
      resources: [res('king', 'ch. 9')],
      quizRefs: ['q.s02.1'],
    },
    {
      id: 's02.t2',
      order: 2,
      title: 'Recursion I & the call stack',
      concept:
        'A function that calls itself needs a base case — the exit that stops the spiral. Every call gets its own stack frame; watch them stack up in Python Tutor and recursion stops being magic.',
      resources: [res('king', 'ch. 9'), res('mycodeschool', 'recursion')],
      viz: res('pythonTutor', 'factorial(5) — watch the frames stack'),
      quizRefs: ['q.s02.2', 'q.s02.3'],
    },
    {
      id: 's02.t3',
      order: 3,
      title: '1D arrays',
      concept:
        'Arrays are fixed-size blocks of same-typed values. C never checks bounds for you: index 10 of a 10-array silently reads past the end. Passing an array to a function passes a pointer — size must travel separately.',
      resources: [res('king', 'ch. 8')],
      quizRefs: ['q.s02.4'],
    },
    {
      id: 's02.t4',
      order: 4,
      title: '2D arrays',
      concept:
        'A matrix is an array of arrays, stored row after row in one block. Nested loops walk it: rows outside, columns inside.',
      resources: [res('king', 'ch. 8')],
      quizRefs: ['q.s02.5'],
    },
    {
      id: 's02.t5',
      order: 5,
      title: 'Strings as char[]',
      concept:
        'A C string is just bytes with a \'\\0\' terminator. Forget the terminator and functions walk off the end into random memory. strlen, strcpy, strcmp — build them by hand once, understand them forever.',
      resources: [res('king', 'ch. 13')],
      quizRefs: ['q.s02.6', 'q.s02.7'],
    },
    {
      id: 's02.t6',
      order: 6,
      title: 'Recursion II: power & palindrome',
      concept:
        'power(x,n) both ways shows recursion vs iteration trading clarity for speed. Palindromes show recursion shrinking a problem: compare ends, recurse into the middle.',
      resources: [res('mycodeschool', 'recursion playlist')],
      quizRefs: ['q.s02.8'],
    },
  ],
  drills: [
    { id: 's02.d1', title: 'Reverse array & string by hand', detail: 'no library calls, in place.', difficulty: 1, platform: 'local' },
    { id: 's02.d2', title: 'Min & max in one pass', detail: 'single loop, two trackers.', difficulty: 1, platform: 'local' },
    { id: 's02.d3', title: 'Matrix add & multiply', detail: 'the multiply triple-loop, indices straight.', difficulty: 2, platform: 'local' },
    { id: 's02.d4', title: 'Palindrome checker', detail: 'strings, case-insensitive, punctuation-ignoring.', difficulty: 2, platform: 'local' },
    { id: 's02.d5', title: 'Binary search, first contact', detail: 'sorted array, halving search — you will meet it again in S12.', difficulty: 2, platform: 'local' },
    { id: 's02.d6', title: 'Exercism: next 3', detail: 'keep the mentoring streak alive.', difficulty: 2, platform: 'exercism' },
  ],
  build: {
    id: 's02.build',
    name: 'Text Lab',
    brief:
      'A string-analysis tool: word count, palindrome detection, case conversion, vowel census, custom replace — every string op hand-rolled (string.h only in test asserts).',
    acceptance: [
      'All operations hand-implemented on char[]',
      'Handles empty strings, single chars, no-terminator hazards (by construction)',
      'Modest test list in main() proving each operation',
      'Zero warnings, valgrind-clean',
    ],
  },
  traps: [
    { id: 's02.tr1', mistake: 'Forgetting the null terminator', why: "char s[5] = \"hello\" has no room for '\\0' — every string function then reads past the end.", quizRefs: ['q.s02.6'] },
    { id: 's02.tr2', mistake: 'Recursion without a base case', why: 'infinite descent, stack overflow, segfault. Write the exit before the spiral.', quizRefs: ['q.s02.3'] },
    { id: 's02.tr3', mistake: 'Expecting array copies', why: 'arrays decay to pointers at the function door — the callee edits your original.', quizRefs: ['q.s02.4'] },
    { id: 's02.tr4', mistake: 'Off-by-one in matrix loops', why: 'row < n and col < m — mixing them reads garbage or crashes.', quizRefs: ['q.s02.5'] },
  ],
};
