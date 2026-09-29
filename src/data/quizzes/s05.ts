import type { QuizItem } from './types';

/**
 * S05 — Preprocessor & Builds: 14-item set (BLUEPRINT: 14).
 * CURRICULUM.md TT-S05 (ftb×5 mcq×6 ord×2 po×2 = 15) folded to the Appendix A
 * cap of 14: ftb×4 · mcq×5 · ord×2 · po×2 · fill-blank×1 (the guard is too
 * central to skip).
 */

const R_GCC = { remedyUrl: 'https://gcc.gnu.org/onlinedocs/cpp/', remedyLabel: 'The C Preprocessor — gcc docs' };

export const s05Items: QuizItem[] = [
  /* ── find-the-bug ×4 ─────────────────────────────────────── */
  {
    id: 'q.s05.ftb1',
    stageId: 's05',
    format: 'find-bug',
    difficulty: 1,
    targets: 's05.tr1 — missing include guards',
    explanation: 'Every header needs guards (or #pragma once): two inclusion paths paste util.h twice, and the struct is defined twice at link time. Guards make headers idempotent.',
    prompt: 'This header breaks when included twice. Click the line whose absence is the crime.',
    code: `/* util.h */\n#ifndef UTIL_H\n#define UTIL_H\n\ntypedef struct { int x, y; } Vec;\n\n#endif`,
    answerLine: 2,
  },
  {
    id: 'q.s05.ftb2',
    stageId: 's05',
    format: 'find-bug',
    difficulty: 3,
    targets: 's05.tr2 — macro without parentheses',
    explanation: '#define SQUARE(x) x*x expands textually: SQUARE(a+1) becomes a+1*a+1 = 2a+1, NOT (a+1)². Parenthesize every parameter and the whole expression — textual expansion obeys nobody\'s precedence hopes.',
    ...R_GCC,
    prompt: 'SQUARE(a+1) computes the wrong thing. Click the expansion to blame.',
    code: `#include <stdio.h>\n\n#define SQUARE(x) x*x\n\nint main(void) {\n    int a = 2;\n    printf("%d\\n", SQUARE(a + 1));\n    return 0;\n}`,
    answerLine: 3,
  },
  {
    id: 'q.s05.ftb3',
    stageId: 's05',
    format: 'find-bug',
    difficulty: 2,
    targets: 's05.tr4 — defining functions in headers',
    explanation: 'A non-static function BODY in a header is pasted into every .c that includes it — the linker then sees two definitions of add. Headers declare; sources define.',
    prompt: 'Two .c files include mathutil.h — and the link fails with "multiple definition of add". Click the line at fault.',
    code: `/* mathutil.h */\n#ifndef MATHUTIL_H\n#define MATHUTIL_H\n\nint add(int a, int b) {\n    return a + b;\n}\n\n#endif`,
    answerLine: 5,
  },
  {
    id: 'q.s05.ftb4',
    stageId: 's05',
    format: 'find-bug',
    difficulty: 2,
    targets: 's05.t4 — unchecked argv bounds',
    explanation: 'argv[1] only exists if argc >= 2. Reading past argc is out-of-bounds — a NULL/garbage deref that valgrind flags and users trigger by simply forgetting the argument.',
    prompt: 'This CLI dies when run with no arguments. Click the line that trusts argv blindly.',
    code: `#include <stdio.h>\n#include <stdlib.h>\n\nint main(int argc, char **argv) {\n    int n = atoi(argv[1]);\n    printf("%d squared = %d\\n", n, n * n);\n    return 0;\n}`,
    answerLine: 5,
  },

  /* ── mcq ×5 ──────────────────────────────────────────────── */
  {
    id: 'q.s05.mc1',
    stageId: 's05',
    format: 'mcq',
    difficulty: 1,
    targets: 's05.t1 — the preprocessor is a text expander',
    explanation: 'gcc -E stops after preprocessing: 20 lines of source become thousands of pasted lines (every system header inlined). It is text, not compilation.',
    prompt: 'What does `gcc -E hello.c` show you?',
    options: [
      'The generated assembly',
      'The linker map',
      'Compiler warnings only',
      'The source after preprocessing — every #include pasted in full, macros expanded',
    ],
    answer: 3,
  },
  {
    id: 'q.s05.mc2',
    stageId: 's05',
    format: 'mcq',
    difficulty: 2,
    targets: 's05.t3 — static makes it private to the file',
    explanation: 'static gives a symbol internal linkage: invisible outside log.c, immune to name collisions. extern is the opposite — a promise that the definition lives elsewhere.',
    prompt: 'In log.c: `static int count;` — what does static do here?',
    options: [
      'Puts count on the heap',
      'Makes count visible to any file that includes log.h',
      'Makes count private to log.c — other files cannot link to it',
      'Makes count a constant',
    ],
    answer: 2,
  },
  {
    id: 'q.s05.mc3',
    stageId: 's05',
    format: 'mcq',
    difficulty: 2,
    targets: 's05.t3 — extern promises, linker delivers',
    explanation: 'extern declares without defining: "the variable exists, the linker will find it." Omit the extern and the header defines the array once per including file — multiply defined.',
    prompt: 'A header needs to share one global array across .c files. The correct declaration is:',
    options: [
      'int data[10]; — defined in the header',
      'extern int data[10]; — declared here, defined in exactly one .c',
      'static int data[10]; — so each file gets its own copy',
      'auto int data[10];',
    ],
    answer: 1,
  },
  {
    id: 'q.s05.mc4',
    stageId: 's05',
    format: 'mcq',
    difficulty: 2,
    targets: 's05.t6 — linker order: objects before libraries',
    explanation: 'The linker resolves left to right: main.o needs sqrt when scanned, so libm must come AFTER it on the command line. Undefined references from correct code are usually an order crime.',
    prompt: '`gcc main.o -lm` links; `gcc -lm main.o` fails with undefined reference to sqrt. Why?',
    options: [
      '-lm must come first so the math library loads before main',
      'The linker processes files left to right — main.o must be scanned before the library that resolves it',
      'gcc ignores libraries that appear before -o',
      'sqrt requires -O2 to link',
    ],
    answer: 1,
  },
  {
    id: 'q.s05.mc5',
    stageId: 's05',
    format: 'mcq',
    difficulty: 2,
    targets: 's05.t7 — the C error idiom: errno + perror',
    explanation: 'On failure, library functions record WHY in errno; perror("context") prints your string plus the system\'s reason. Fail loud, name the operation, exit nonzero.',
    prompt: 'fopen just returned NULL. The idiomatic next move is:',
    options: [
      'Retry fopen in a loop until it succeeds',
      'Call perror("fopen") and exit with a nonzero status',
      'Ignore it — the next operation will fail anyway',
      'Set errno to 0 and continue',
    ],
    answer: 1,
  },

  /* ── ordering ×2 ─────────────────────────────────────────── */
  {
    id: 'q.s05.ord1',
    stageId: 's05',
    format: 'ordering',
    difficulty: 2,
    targets: 's05.t5 — make rebuilds only what changed',
    explanation: 'make checks timestamps top-down: the goal needs app.o, app.o is newer than its sources, so no recipes run — "up to date". Dependencies, not order rules, drive the build.',
    prompt: 'You run `make` after editing ONLY main.c. Order what make does.',
    steps: [
      'Compare main.o\'s timestamp against main.c and app.h',
      'See main.c is newer — run the recipe: gcc -c main.c',
      'Relink: gcc main.o util.o -o app',
      'Report: app is up to date',
    ],
  },
  {
    id: 'q.s05.ord2',
    stageId: 's05',
    format: 'ordering',
    difficulty: 2,
    targets: 's05.t6 — building and linking a static library',
    explanation: 'The library workflow: compile units to .o, archive with ar rcs, then link the .a AFTER the objects that use it.',
    prompt: 'Order the static-library workflow.',
    steps: [
      'Compile each module: gcc -c vec.c',
      'Archive the objects: ar rcs libvec.a vec.o',
      'Compile the user of the library: gcc -c main.c',
      'Link with the library after the object: gcc main.o -L. -lvec -o app',
    ],
  },

  /* ── predict-output ×2 ───────────────────────────────────── */
  {
    id: 'q.s05.po1',
    stageId: 's05',
    format: 'predict-output',
    difficulty: 2,
    targets: 's05.tr2 — macro expansion is textual',
    explanation: 'MAX(a++, 2) expands to ((a++) > (2) ? (a++) : (2)): the condition runs a++ (5>2, a→6), then the true branch runs a++ again — the result is 6 and a lands on 7. One macro call, two increments.',
    ...R_GCC,
    prompt: 'What does this print?',
    code: `#define MAX(a, b) ((a) > (b) ? (a) : (b))\n\nint a = 5;\nprintf("%d\\n", MAX(a++, 2));\n/* and a is now: */ printf("%d\\n", a);`,
    answer: '6 7',
  },
  {
    id: 'q.s05.po2',
    stageId: 's05',
    format: 'predict-output',
    difficulty: 1,
    targets: 's05.t2 — object-like macros are paste',
    explanation: 'The preprocessor pastes "2+3" into the expression: 2+3*2+3 = 11, not 10. #define DOUBLE_IT (2+3) with parens would give 10.',
    prompt: 'What does this print?',
    code: `#define VAL 2+3\nprintf("%d\\n", VAL * 2);`,
    answer: '11',
  },

  /* ── fill-blank ×1 ───────────────────────────────────────── */
  {
    id: 'q.s05.fb1',
    stageId: 's05',
    format: 'fill-blank',
    difficulty: 1,
    targets: 's05.tr1 — the guard triplet',
    explanation: '#ifndef / #define / #endif — the three lines that make a header safe to include twice. #pragma once is the modern shorthand for the same deal.',
    prompt: 'Guard this header — fill the preprocessor conditional.',
    code: `___ UTIL_H\n#define UTIL_H\n\n/* declarations */\n\n#endif`,
    answers: [['#ifndef']],
  },
];
