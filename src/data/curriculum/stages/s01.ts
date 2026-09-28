import { res } from '../resources';
import type { Stage } from '../types';

export const s01: Stage = {
  id: 's01',
  phase: 'p1',
  title: 'C Fundamentals I',
  goal: 'Learn the grammar of the language: data, input/output, decisions and repetition.',
  days: 6,
  canStatements: [
    'Declare and initialize every basic type',
    "Predict printf/scanf behavior including format-specifier mismatches",
    'Write branches and all three loop forms without syntax slips',
    "Trace any small program's output by hand",
  ],
  topics: [
    {
      id: 's01.t1',
      order: 1,
      title: 'Variables, types, overflow',
      concept:
        'int, float, double, char — each is a fixed box of bytes with a range. Exceed the range and an int wraps around silently. C trusts you completely; that is its power and its danger.',
      resources: [res('king', 'ch. 7'), res('cs50', 'Week 1')],
      viz: res('pythonTutor', 'run a variables snippet step by step'),
      quizRefs: ['q.s01.1', 'q.s01.2'],
    },
    {
      id: 's01.t2',
      order: 2,
      title: 'printf & scanf',
      concept:
        'printf writes formatted text; scanf reads it back. The format specifier is a contract: %d promises "pointer to int". Break the contract and C compiles anyway — then misbehaves.',
      resources: [res('king', 'ch. 3')],
      quizRefs: ['q.s01.3', 'q.s01.4'],
    },
    {
      id: 's01.t3',
      order: 3,
      title: 'Operators',
      concept:
        'Arithmetic, relational, logical — and one trap that defines C: = assigns, == compares. if (x = 5) is always true. Bitwise operators get recognized here; mastered in Stage 06.',
      resources: [res('king', 'ch. 4–5')],
      quizRefs: ['q.s01.5'],
    },
    {
      id: 's01.t4',
      order: 4,
      title: 'Control flow',
      concept:
        'if/else picks, switch picks among many, break/continue redirect loops. Every switch needs a default and every case needs a break — fallthrough is rarely what you meant.',
      resources: [res('king', 'ch. 5')],
      quizRefs: ['q.s01.6', 'q.s01.7'],
    },
    {
      id: 's01.t5',
      order: 5,
      title: 'Loops & off-by-one discipline',
      concept:
        'for knows its count, while checks first, do-while runs once. The classic bug: i <= n instead of i < n. Trace loops on paper before running them.',
      resources: [res('king', 'ch. 6')],
      viz: res('visualgo', 'loop-trace animations'),
      quizRefs: ['q.s01.8', 'q.s01.9'],
    },
    {
      id: 's01.t6',
      order: 6,
      title: 'Conversions & casts',
      concept:
        '5/2 is 2 in C — integer division truncates. Mixing signed and unsigned, or float and int, triggers silent conversions. Cast deliberately, never accidentally.',
      resources: [res('king', 'ch. 7')],
      quizRefs: ['q.s01.10'],
    },
  ],
  drills: [
    { id: 's01.d1', title: 'Menu-driven calculator', detail: 'add/sub/mul/div behind a switch, rejecting bad input.', difficulty: 1, platform: 'local' },
    { id: 's01.d2', title: 'Multiplication table', detail: 'n×1..n×12, formatted columns.', difficulty: 1, platform: 'local' },
    { id: 's01.d3', title: 'Number guessing game', detail: 'random target, attempt counter, higher/lower hints.', difficulty: 2, platform: 'local' },
    { id: 's01.d4', title: 'Sum & reverse digits', detail: 'two loops, no strings: pure arithmetic.', difficulty: 2, platform: 'local' },
    { id: 's01.d5', title: 'HackerRank C: first 10', detail: 'the "Hello World" through "Sum of Digits" band.', difficulty: 1, platform: 'hackerrank' },
    { id: 's01.d6', title: 'Exercism: first 3 easy', detail: 'submit for mentoring — real feedback from real humans.', difficulty: 2, platform: 'exercism' },
  ],
  build: {
    id: 's01.build',
    name: 'Number Forge',
    brief:
      'A console toolkit: primes, factorial, digit sums, tables — behind one menu loop, input-validated (rejects garbage via scanf checks).',
    acceptance: [
      'Menu loop with switch dispatch',
      'scanf return values checked; garbage input rejected, never crashes',
      'Every operation correct for edge inputs (0, negatives, huge)',
      'Zero warnings under -Wall -Wextra',
    ],
  },
  traps: [
    { id: 's01.tr1', mistake: '= inside a condition', why: 'assignment returns the value, so if (x = 0) is false forever and if (x = 5) always true. Compiler warns; you listen.', quizRefs: ['q.s01.5'] },
    { id: 's01.tr2', mistake: 'Uninitialized variables', why: 'C hands you garbage memory without complaint. Initialize at declaration, always.', quizRefs: ['q.s01.2'] },
    { id: 's01.tr3', mistake: 'scanf("%d", x) without &', why: 'scanf needs the address to write to. Passing the value instead is undefined behavior.', quizRefs: ['q.s01.4'] },
    { id: 's01.tr4', mistake: 'Float equality (0.1+0.2 == 0.3)', why: 'binary floats cannot represent most decimals exactly; compare with an epsilon.', quizRefs: ['q.s01.1'] },
  ],
};
