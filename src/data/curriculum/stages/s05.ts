import { res } from '../resources';
import type { Stage } from '../types';

export const s05: Stage = {
  id: 's05',
  phase: 'p2',
  title: 'Preprocessor & Builds',
  goal: 'Multi-file projects, the preprocessor\u2019s true nature, Makefiles, and the C error-handling idiom.',
  days: 5,
  canStatements: [
    'Structure a multi-file C project with proper headers and include guards',
    "Explain what #define/#include/#ifdef actually do to the text",
    'Write a Makefile with correct targets and dependencies',
    'Parse argv and write programs that fail loudly with useful messages',
    'Write and run your own assert-based tests',
  ],
  topics: [
    {
      id: 's05.t1',
      order: 1,
      title: 'What the preprocessor really does',
      concept:
        'It is a text expander, not a compiler. #include pastes files; #define pastes tokens. Compile with -E and read the thousands of lines your 20-line program becomes.',
      resources: [res('king', 'ch. 14')],
      viz: res('godbolt', 'compile with -E and read the expansion'),
      quizRefs: ['q.s05.1'],
    },
    {
      id: 's05.t2',
      order: 2,
      title: 'Macros & their footguns',
      concept:
        '#define SQUARE(x) x*x expands textually: SQUARE(1+2) becomes 1+2*1+2. Parenthesize every parameter and the whole expression — or use the debugger instead.',
      resources: [res('king', 'ch. 14')],
      quizRefs: ['q.s05.2', 'q.s05.3'],
    },
    {
      id: 's05.t3',
      order: 3,
      title: 'Headers, guards, extern, static',
      concept:
        'Headers declare; sources define. Guards stop double-inclusion. static makes a function/variable private to its file; extern promises "defined elsewhere, linker will find it".',
      resources: [res('king', 'ch. 15'), res('jacobSorber', 'multi-file projects')],
      quizRefs: ['q.s05.4', 'q.s05.5'],
    },
    {
      id: 's05.t4',
      order: 4,
      title: 'Command-line programs: argc/argv',
      concept:
        'main(int argc, char **argv) receives your arguments. argc counts, argv[0] is the program name — validate bounds before touching argv[i], return nonzero exit codes on failure.',
      resources: [res('knr', '§5.10'), res('king', 'ch. 13.6')],
      quizRefs: ['q.s05.6'],
    },
    {
      id: 's05.t5',
      order: 5,
      title: 'Make',
      concept:
        'Targets, prerequisites, recipes: make rebuilds only what changed, in the right order. A debug target and a release target take ten lines and save hours.',
      resources: [res('make')],
      quizRefs: ['q.s05.7'],
    },
    {
      id: 's05.t6',
      order: 6,
      title: 'Static libraries & linking order',
      concept:
        'ar rcs bundles .o files into a .a the linker consumes. Linker order matters: objects before libraries, or undefined references everywhere.',
      resources: [res('jacobSorber', 'libraries video')],
      quizRefs: ['q.s05.8'],
    },
    {
      id: 's05.t7',
      order: 7,
      title: 'The C error-handling idiom',
      concept:
        'Functions return -1/NULL and set errno; you check immediately and report with perror/strerror. Fail loud, fail early, clean up what you opened. This idiom runs through every drill from here on.',
      resources: [res('cppreference', 'errno.h')],
      quizRefs: ['q.s05.9'],
    },
    {
      id: 's05.t8',
      order: 8,
      title: 'Testing in C',
      concept:
        'assert for invariants, a tiny harness for tests: one test file per module, a make test target, red/green on exit codes. Real CI discipline, zero framework.',
      resources: [],
      quizRefs: ['q.s05.10'],
    },
  ],
  drills: [
    { id: 's05.d1', title: 'Split Text Lab into modules', detail: 'stringops.c/h + main.c; build with a Makefile.', difficulty: 2, platform: 'local' },
    { id: 's05.d2', title: 'argv-ify your builds', detail: 'Text Lab and Library System take filenames and flags via argc/argv.', difficulty: 2, platform: 'local' },
    { id: 's05.d3', title: 'Macro side-effect bug', detail: 'MAX(a++, b) — watch the double increment, fix with parens + statement exprs.', difficulty: 3, platform: 'local' },
    { id: 's05.d4', title: 'Makefile for Library System', detail: 'debug/release targets, clean, test target.', difficulty: 2, platform: 'local' },
    { id: 's05.d5', title: '10 assert-tests for the S03 vector', detail: 'push/pop/resize/grow behavior pinned by asserts.', difficulty: 2, platform: 'local' },
    { id: 's05.d6', title: 'errno handling pass', detail: 'add fopen/fread/perror discipline to every file op in S04 builds.', difficulty: 2, platform: 'local' },
    { id: 's05.d7', title: 'Break the build on purpose ×3', detail: 'missing guard, wrong link order, undefined reference — diagnose each from the error alone.', difficulty: 3, platform: 'local' },
  ],
  build: {
    id: 's05.build',
    name: 'Contacts CLI',
    brief:
      'add/search/delete/list contacts. Files: contact.c/h, store.c/h, main.c, tests. Makefile with debug/release; persists to disk; zero-warning build; argv-driven interface with proper exit codes.',
    acceptance: [
      'Four compile units + Makefile with clean/debug/release/test targets',
      'argv parsing with bounds checks and usage message on bad args',
      'errno/perror on every file operation',
      'Assert-based tests green via make test',
    ],
  },
  traps: [
    { id: 's05.tr1', mistake: 'Missing include guards', why: 'double inclusion = duplicate definitions. Every header gets guards, day one.', quizRefs: ['q.s05.4'] },
    { id: 's05.tr2', mistake: 'Unparenthesized macro parameters', why: 'textual expansion + operator precedence = silent math errors.', quizRefs: ['q.s05.2'] },
    { id: 's05.tr3', mistake: 'Stale .o files', why: 'edit a header, forget make: old objects link against new promises. Correct dependencies fix it; make clean is the bandage.', quizRefs: ['q.s05.7'] },
    { id: 's05.tr4', mistake: 'Defining functions in headers', why: 'every including .c gets its own copy — multiple definition at link. Headers declare; sources define.', quizRefs: ['q.s05.5'] },
  ],
};
