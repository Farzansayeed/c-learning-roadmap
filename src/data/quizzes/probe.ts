import type { QuizItem, QuizSet } from './types';

/**
 * Format probe — one hand-authored item per remaining format so every
 * renderer is exercised end-to-end in Phase 4 (per PHASES.md), plus a
 * fix-code deep-link exercise (the WASM-spike fallback mode).
 */
export const probeItems: QuizItem[] = [
  {
    id: 'q.probe.match1',
    stageId: 's01',
    format: 'match',
    difficulty: 1,
    targets: 's01.t1 — types and their ranges',
    explanation: 'Match each declaration to what it actually holds — the boxes differ in size and meaning.',
    prompt: 'Match each declaration to its meaning.',
    pairs: [
      { left: 'char', right: 'one byte, usually a character' },
      { left: 'int', right: 'the machine\'s natural integer' },
      { left: 'double', right: 'double-precision floating point' },
      { left: 'unsigned int', right: 'integer, no negatives, doubled range' },
    ],
  },
  {
    id: 'q.probe.ord1',
    stageId: 's05',
    format: 'ordering',
    difficulty: 1,
    targets: 's05.t1 — the build pipeline',
    explanation: 'The compile pipeline: preprocessor expands #lines, compiler emits assembly, assembler makes object code, linker stitches it into a runnable.',
    prompt: 'Order the build pipeline stages.',
    steps: [
      'Preprocessor (expand #include/#define)',
      'Compiler (C → assembly)',
      'Assembler (assembly → object code)',
      'Linker (objects → executable)',
    ],
  },
  {
    id: 'q.probe.fix1',
    stageId: 's01',
    format: 'fix-code',
    difficulty: 2,
    targets: 's01.tr3 — scanf without &',
    explanation: 'scanf needs the ADDRESS of n to write into. Passing n itself misreads an int as a pointer — the classic stage-1 crash.',
    remedyUrl: 'https://www.programiz.com/c-programming/online-compiler/',
    remedyLabel: 'Programiz',
    prompt:
      'This program crashes when you enter a number. Fix it, run it in the online compiler, confirm it works.',
    code: `#include <stdio.h>\n\nint main(void) {\n    int n;\n    printf("enter a number: ");\n    scanf("%d", n);   /* bug lives here */\n    printf("you typed %d\\n", n);\n    return 0;\n}`,
    runnerUrl: 'https://www.programiz.com/c-programming/online-compiler/',
    runnerName: 'Programiz online compiler',
    solutionNote: 'scanf("%d", &n) — pass the address of n, not its value.',
  },
];

export const formatProbeSet: QuizSet = {
  id: 'q.probe',
  kind: 'torture',
  title: 'Format Probe — one of every renderer',
  stageIds: ['s01', 's05'],
  passMark: 1, // demo set: every renderer must be exercised
  items: probeItems,
};
