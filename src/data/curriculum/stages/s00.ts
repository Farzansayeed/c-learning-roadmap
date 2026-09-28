import { res } from '../resources';
import type { Stage } from '../types';

export const s00: Stage = {
  id: 's00',
  phase: 'p0',
  title: 'Toolchain & Workflow',
  goal: 'Get a working toolchain so every later stage is pure learning, no fighting the compiler.',
  days: 3,
  canStatements: [
    'Compile and run a C program entirely from the terminal',
    'Explain what preprocessing, compiling, assembling and linking each did',
    'Set a compiler breakpoint and step through code',
    'Run valgrind on a program and read its output',
    'Make and push a git commit',
  ],
  topics: [
    {
      id: 's00.t1',
      order: 1,
      title: 'Toolchain install & verification',
      concept:
        'Your compiler turns text into machine instructions. gcc is the one used everywhere. Installing MSYS2 (Windows) or build-essential (Linux) gives you gcc; `gcc --version` proving it works is your first victory.',
      resources: [res('msys2'), res('vscodeCpp')],
      viz: undefined,
      quizRefs: ['q.s00.1', 'q.s00.2'],
    },
    {
      id: 's00.t2',
      order: 2,
      title: 'The compile pipeline',
      concept:
        'One command, four stages: preprocessor expands #lines (.i), compiler produces assembly (.s), assembler makes object code (.o), linker stitches libraries into a runnable. Knowing which stage failed tells you what kind of error you have.',
      resources: [res('cs50', 'Week 1 notes'), res('jacobSorber', 'compiling videos')],
      viz: res('godbolt', 'watch hello.c become x86-64; compare -O0 vs -O2'),
      quizRefs: ['q.s00.3', 'q.s00.4', 'q.s00.5'],
    },
    {
      id: 's00.t3',
      order: 3,
      title: 'Warnings are truth',
      concept:
        'Compilers know hundreds of ways C will bite you and tell you for free. Compiling with -Wall -Wextra (and eventually -Werror) turns silent disasters into loud, fixable messages. Always.',
      resources: [res('jacobSorber', 'warning hygiene')],
      quizRefs: ['q.s00.6'],
    },
    {
      id: 's00.t4',
      order: 4,
      title: 'Terminal survival',
      concept:
        'cd moves you, ls shows what is there, Tab completes names, ↑ replays history. You will live here for the next 20 weeks.',
      resources: [],
      quizRefs: [],
    },
    {
      id: 's00.t5',
      order: 5,
      title: 'gdb first contact',
      concept:
        'A debugger pauses your program mid-run so you can look inside. Break, run, next, print: four commands that replace an hour of staring at code.',
      resources: [res('gdb'), res('jacobSorber', 'gdb videos')],
      quizRefs: ['q.s00.7', 'q.s00.8'],
    },
    {
      id: 's00.t6',
      order: 6,
      title: 'valgrind first contact',
      concept:
        'valgrind runs your program in a machine that watches every byte. "definitely lost: 10 bytes" means your program allocated memory and forgot about it — the first disease valgrind teaches you to see.',
      resources: [res('valgrind')],
      quizRefs: [],
    },
    {
      id: 's00.t7',
      order: 7,
      title: 'git + Make first contact',
      concept:
        'git init / add / commit / push is your undo button and time machine. A 5-line Makefile lets `make` rebuild everything; the full treatment comes in Stage 05.',
      resources: [],
      quizRefs: [],
    },
  ],
  drills: [
    {
      id: 's00.d1',
      title: 'Hello World from the terminal',
      detail: 'Write, compile and run hello.c without any IDE button. Use gcc hello.c -o hello && ./hello.',
      difficulty: 1,
      platform: 'local',
    },
    {
      id: 's00.d2',
      title: 'Optimization diff',
      detail: 'Compile the same file at -O0 and -O2 and diff the godbolt output. See the compiler get smarter.',
      difficulty: 2,
      platform: 'local',
    },
    {
      id: 's00.d3',
      title: 'Warning hunt',
      detail: 'Introduce a deliberate warning (unused variable, bad format specifier), read the compiler message, fix it.',
      difficulty: 1,
      platform: 'local',
    },
    {
      id: 's00.d4',
      title: 'gdb walkthrough',
      detail: 'Set a breakpoint, run, inspect one variable with print, step over three lines with next.',
      difficulty: 2,
      platform: 'local',
    },
    {
      id: 's00.d5',
      title: 'Leak on purpose',
      detail: 'malloc 10 bytes without freeing. Confirm with valgrind ("definitely lost"). Fix. Confirm clean.',
      difficulty: 2,
      platform: 'local',
    },
  ],
  build: {
    id: 's00.build',
    name: 'First Blood',
    brief:
      'A greeting program: asks name + age, prints a formatted banner. Trivial output — the discipline is the point: Makefile-built, zero warnings, gdb-walked once, valgrind-clean, committed to git.',
    acceptance: [
      'Builds via `make` with zero warnings (-Wall -Wextra)',
      'gdb breakpoint set and one variable inspected during development',
      'valgrind reports zero leaks',
      'Committed and pushed to a git repository',
    ],
  },
  traps: [
    {
      id: 's00.tr1',
      mistake: 'IDE-button dependence',
      why: 'IDEs hide the pipeline; the terminal shows it. Errors stop being scary once you can name the stage that produced them.',
      quizRefs: ['q.s00.3'],
    },
    {
      id: 's00.tr2',
      mistake: 'Ignoring warnings because "it ran anyway"',
      why: 'A warning is a bug the compiler found for free. -Wall -Wextra makes them impossible to miss.',
      quizRefs: ['q.s00.6'],
    },
    {
      id: 's00.tr3',
      mistake: 'Committing only when "finished"',
      why: 'Small commits are undo points. One giant commit is a time machine with one stop.',
      quizRefs: [],
    },
  ],
};
