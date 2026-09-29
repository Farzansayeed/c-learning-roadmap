import type { QuizItem } from './types';

/**
 * S00 — Toolchain & Workflow: 8-item set (BLUEPRINT: 8).
 * mcq ×4 · predict-output ×2 · tool-ordering ×2 (CURRICULUM.md TT-S00).
 * Ids follow the free-form q.sNN.* convention (same as s03.ts).
 */

const R_VAL = { remedyUrl: 'https://valgrind.org/docs/manual/quick-start.html', remedyLabel: 'valgrind quick start' };
const R_GDB = { remedyUrl: 'https://sourceware.org/gdb/', remedyLabel: 'gdb — the GNU debugger' };
const R_GCC = { remedyUrl: 'https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html', remedyLabel: 'gcc warning options' };

export const s00Items: QuizItem[] = [
  /* ── mcq ×4 ──────────────────────────────────────────────── */
  {
    id: 'q.s00.mc1',
    stageId: 's00',
    format: 'mcq',
    difficulty: 1,
    targets: 's00.t2 — the compile pipeline',
    explanation: '#include/#define/#ifdef are pure text expansion — that is the preprocessor writing hello.i. Compiling C to assembly (.s) is the next stage.',
    prompt: 'In the gcc pipeline, which stage turns hello.c into hello.i?',
    options: [
      'The compiler proper — C to assembly',
      'The preprocessor — it expands #include and #define',
      'The assembler — mnemonics to machine code',
      'The linker — it stitches libraries in',
    ],
    answer: 1,
  },
  {
    id: 'q.s00.mc2',
    stageId: 's00',
    format: 'mcq',
    difficulty: 2,
    targets: 's00.t2 — naming the failing stage',
    explanation: 'A declaration satisfies the compiler; only the LINKER needs the actual definition. "Undefined reference" is a link error — the fix is the right object/library (in the right order), not more #includes.',
    prompt: 'hello.c calls sqrt(). The build dies with: undefined reference to `sqrt`. Which stage failed?',
    options: [
      'Preprocessing — sqrt was never #included',
      'Compilation — the syntax of the call is wrong',
      'Assembly — sqrt is not a real instruction',
      'Linking — the declaration compiled fine, but no definition was stitched in',
    ],
    answer: 3,
  },
  {
    id: 'q.s00.mc3',
    stageId: 's00',
    format: 'mcq',
    difficulty: 1,
    targets: 's00.tr2 — ignoring warnings',
    explanation: '-Wall -Wextra surfaces the hundreds of ways C bites: unused variables, format mismatches, missing initializers. Free bug-finding — and -Werror promotes them to stoppers.',
    ...R_GCC,
    prompt: 'Why compile with -Wall -Wextra on every build?',
    options: [
      'It makes the program run faster',
      'It is required for valgrind to run',
      'Warnings are bugs the compiler found for free — the flags turn silent disasters into loud, fixable messages',
      'It hides third-party library warnings',
    ],
    answer: 2,
  },
  {
    id: 'q.s00.mc4',
    stageId: 's00',
    format: 'mcq',
    difficulty: 1,
    targets: 's00.t6 — reading valgrind output',
    explanation: '"Definitely lost" is the headline disease: allocated memory with no pointer left to reach it. The leak report names the allocation site — fix where it says, not where it crashes.',
    ...R_VAL,
    prompt: 'valgrind says: definitely lost: 10 bytes. What happened?',
    options: [
      '10 bytes were allocated and every pointer to them was lost — a leak',
      'The program read 10 bytes it should not have',
      'The stack grew by 10 bytes too many',
      'valgrind failed to attach — rerun with -v',
    ],
    answer: 0,
  },

  /* ── predict-output ×2 ───────────────────────────────────── */
  {
    id: 'q.s00.po1',
    stageId: 's00',
    format: 'predict-output',
    difficulty: 1,
    targets: 'printf escapes — %% prints one percent sign',
    explanation: 'Format strings are a mini-language: %% produces one literal %, \\n the newline. Read them closely — half of beginner printf bugs live here.',
    prompt: 'What does this print?',
    code: `#include <stdio.h>\n\nint main(void) {\n    printf("100%% done\\n");\n    return 0;\n}`,
    answer: '100% done',
  },
  {
    id: 'q.s00.po2',
    stageId: 's00',
    format: 'predict-output',
    difficulty: 1,
    targets: 's00.tr2 — warnings do not stop the build',
    explanation: 'With -Wall -Wextra but no -Werror, an unused variable is a warning: the program still builds and behaves normally. Warnings inform; -Werror is what makes them stop the build.',
    prompt: 'This is compiled with -Wall -Wextra (no -Werror). What does RUNNING it print?',
    code: `#include <stdio.h>\n\nint main(void) {\n    int unused;\n    printf("ok\\n");\n    return 0;\n}`,
    answer: 'ok',
  },

  /* ── ordering ×2 ─────────────────────────────────────────── */
  {
    id: 'q.s00.ord1',
    stageId: 's00',
    format: 'ordering',
    difficulty: 2,
    targets: 's00.t5 — gdb first contact (break BEFORE run)',
    explanation: 'The rookie mistake is typing run before break — the program blasts past. Break first, run second; the pause is where inspection (next/print) becomes possible.',
    ...R_GDB,
    prompt: 'Order the first gdb session.',
    steps: [
      'Compile with -g so the binary carries debug symbols',
      'Start gdb on the binary: gdb ./hello',
      'Set a breakpoint before anything runs: break main',
      'Run — execution stops at the breakpoint',
      'Step with next and inspect with print',
    ],
  },
  {
    id: 'q.s00.ord2',
    stageId: 's00',
    format: 'ordering',
    difficulty: 1,
    targets: 's00.t7 — the edit → build → verify → commit loop',
    explanation: 'This loop IS the workflow: small edits, clean builds, leak checks, tiny commits. Every later stage just deepens one of the steps.',
    prompt: 'Order the daily edit-compile-verify-commit loop.',
    steps: [
      'Edit the source',
      'Compile: gcc -Wall -Wextra -g hello.c -o hello',
      'Run: ./hello',
      'valgrind ./hello — read the leak report',
      'git add + commit + push — the checkpoint is safe',
    ],
  },
];
