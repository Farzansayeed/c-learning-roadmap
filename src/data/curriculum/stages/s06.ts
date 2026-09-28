import { res } from '../resources';
import type { Stage } from '../types';

export const s06: Stage = {
  id: 's06',
  phase: 'p2',
  title: 'Bits & Low-Level Craft',
  goal: 'Bitwise mastery, two\u2019s complement, IEEE-754 first contact — the interview staple v2 never had.',
  days: 4,
  canStatements: [
    'Read and write any bit pattern confidently',
    "Explain two's complement and IEEE-754 at a beginner's depth",
    'Deploy the classic bit tricks from memory',
    'Compute with fixed-width types',
  ],
  topics: [
    {
      id: 's06.t1',
      order: 1,
      title: 'Binary/hex fluency & fixed-width ints',
      concept:
        'Hex is binary shorthand: one hex digit = four bits. uint32_t etc. promise exact widths — use them whenever representation matters. Endianness decides which end of a multi-byte value comes first in memory.',
      resources: [res('csapp', 'ch. 2 (selected)'), res('king', 'ch. 7 revisit')],
      viz: res('godbolt', 'inspect raw memory bytes'),
      quizRefs: ['q.s06.1', 'q.s06.2'],
    },
    {
      id: 's06.t2',
      order: 2,
      title: "Two's complement & overflow",
      concept:
        'Negative numbers are stored as "flip the bits, add one" — which makes addition hardware identical for signed and unsigned. Signed overflow is undefined behavior; unsigned wraps. Know which you are holding.',
      resources: [res('csapp', 'ch. 2'), res('mycodeschool', 'number systems')],
      quizRefs: ['q.s06.3', 'q.s06.4'],
    },
    {
      id: 's06.t3',
      order: 3,
      title: 'Masks: set, clear, toggle, check',
      concept:
        'One bit set apart is a mask: | sets, &~ clears, ^ toggles, & tests. (n >> k) & 1 reads bit k. These four idioms are the whole toolbox.',
      resources: [res('king', 'ch. 5 (bitwise)')],
      quizRefs: ['q.s06.5', 'q.s06.6'],
    },
    {
      id: 's06.t4',
      order: 4,
      title: 'Classic tricks deck',
      concept:
        'n & (n-1) clears the lowest set bit (power-of-two test, popcount loop). x ^ x = 0 (the dedup trick). XOR swap exists but do not use it. Each trick gets one viz card in the app.',
      resources: [res('cpAlgorithms', 'bit tricks')],
      quizRefs: ['q.s06.7', 'q.s06.8'],
    },
    {
      id: 's06.t5',
      order: 5,
      title: 'IEEE-754 first contact',
      concept:
        'floats = sign × mantissa × 2^exp. Most decimals have no exact binary form: 0.1+0.2 != 0.3. Compare with epsilon; know that precision, not randomness, causes the surprise.',
      resources: [res('csapp', 'ch. 2.4 (skim)')],
      viz: res('godbolt', 'float vs double output side by side'),
      quizRefs: ['q.s06.9'],
    },
    {
      id: 's06.t6',
      order: 6,
      title: 'Bit fields & flag sets',
      concept:
        'unsigned ok:1 inside a struct packs booleans bit-tight — useful, but layout is compiler-dependent; masks in plain ints stay portable.',
      resources: [res('king', 'ch. 16 (bit fields)')],
      quizRefs: [],
    },
  ],
  drills: [
    { id: 's06.d1', title: 'Bit API', detail: 'set/clear/toggle/test as functions with a test table.', difficulty: 1, platform: 'local' },
    { id: 's06.d2', title: 'Popcount three ways', detail: 'loop, Kernighan trick, builtin — compare.', difficulty: 2, platform: 'local' },
    { id: 's06.d3', title: 'Power-of-two check', detail: 'one line, no loops: n && !(n & (n-1)).', difficulty: 2, platform: 'local' },
    { id: 's06.d4', title: 'Swap nibbles', detail: 'byte in, nibbles exchanged, byte out.', difficulty: 2, platform: 'local' },
    { id: 's06.d5', title: '8×8 bitmap renderer', detail: '64 cells in 8 bytes; render as ASCII art.', difficulty: 2, platform: 'local' },
    { id: 's06.d6', title: 'Float precision lab', detail: 'predict-then-verify experiments: 0.1+0.2, 1/3*3, big + small.', difficulty: 2, platform: 'local' },
  ],
  build: {
    id: 's06.build',
    name: 'BitBoard',
    brief:
      'An 8×8 pixel board where every cell is one bit: full set/clear/flip/query API, ASCII renderer, pattern loader (Glider), flood-fill on bitmaps. Zero non-bit cell storage.',
    acceptance: [
      'All 64 cells stored in 8 bytes',
      'API: set/clear/flip/test/row/col + renderer + loader + flood fill',
      'Flood fill proven correct on a glider pattern',
      'Shift operations guarded (no shifts ≥ width — that is UB)',
    ],
  },
  traps: [
    { id: 's06.tr1', mistake: 'Shifting by ≥ the width', why: 'x << 32 on a 32-bit int is undefined behavior — not zero. Guard every shift width.', quizRefs: ['q.s06.6'] },
    { id: 's06.tr2', mistake: 'Signed right-shift assumptions', why: '>> on negatives is implementation-defined (usually arithmetic). Use unsigned for bit work.', quizRefs: ['q.s06.4'] },
    { id: 's06.tr3', mistake: '& vs &&', why: 'one is bitwise, the other logical — 1 & 2 is 0, 1 && 2 is true. Both compile; only one is right.', quizRefs: ['q.s06.5'] },
    { id: 's06.tr4', mistake: 'Mask off-by-one', why: 'bit "number 1" is usually index 0. Decide the convention and print the binary to check.', quizRefs: ['q.s06.6'] },
  ],
};
