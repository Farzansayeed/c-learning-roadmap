# C × DSA Roadmap v3 — Rebuild Plan

**Status:** Draft for Farza's review · nothing built yet
**Companion spec:** **`CURRICULUM.md`** — the definitive stage-by-stage content spec (objectives, ordered topic→resource→viz mapping, drills, flagship builds, quiz blueprints, beginner traps, day budgets, boss gates). This file is the architecture & strategy; that file is the curriculum itself.
**What this is:** A complete redesign of the roadmap tracker — new curriculum (deeper, reorganized, interview-focused), a quiz engine with find-the-bug / fix-the-code / predict-the-output drills per topic, a rebuilt accountability personality, a modern web stack, and a ground-up UI redesign.

---

## 0 · Audience — built for a total beginner

Confirmed: **very low C experience is the design target, not an edge case.**

- **Phase 0 assumes nothing** — never compiled anything, never touched a terminal? Covered step by step.
- **Every stage defines its own vocabulary.** No CS-degree prerequisites; the only math anywhere is logs and exponents, and S07 teaches those before using them.
- **Boss quizzes are placement tests, not assumptions.** Pass one cold at ≥80% and that phase unlocks instantly — experienced people skip; beginners ignore this and just follow the path. The path *is* the default.
- **Deliberate ramp:** Phases 0–1 are slow and repetitive on purpose (reps beat theory early); intensity climbs from Phase 3 onward. ~20 weeks at ~3 h/day from zero to interview-ready.

---

## 1 · Architecture (chosen: modern stack)

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18 + TypeScript + Vite** | Fast dev, type-safe curriculum data (typos in 180 quiz items become compile errors), trivial Vercel deploy — `vercel.json` already exists |
| State | **Zustand** (persist middleware) | localStorage persistence with migrations, no Redux ceremony |
| Styling | **Tailwind CSS v4 + CSS custom-property theme tokens** | The claymorphic look gets rebuilt as a token system so themes are data, not duplicated CSS |
| Animation | **Framer Motion** | Stage expansion, roast overlays, confetti — the current CSS keyframe tricks, done properly |
| Routing | **React Router** | Separate pages instead of one endless scroll |
| Testing | **Vitest + Testing Library** | The Guardian self-test suite (~80 checks) graduates into a real CI suite; an in-app diagnostics page remains |
| Offline | **PWA** (vite-plugin-pwa) | Keeps the v2 promise: works offline, installable |
| Deploy | Same Vercel project, `git push` → auto-deploy | Zero change to workflow |

**Repo shape:** the old single-file app is preserved at `legacy/index.html` (still works, still opens via `file://`), and the new app lives in `src/` + `public/`. Old v2 progress can be **imported** (best-effort mapping of checked items to the new curriculum; no auto-migration).

**Runnable C in the browser (spike, go/no-go day one):** the quiz "fix-the-code" drills are far better if code actually executes. Plan: lazy-load a WASM C toolchain (clang/wasi-sdk compiled to wasm, ~20–30 MB from CDN, only on demand). If the spike fails the bar, fallback is one-tap deep links that open the exercise **pre-filled** in an online compiler. Either way, quiz data is executor-agnostic.

---

## 2 · Curriculum v3 — the actual roadmap

### Structure: 6 Phases → 19 stages (was: flat 12 stages)

Phases gate on a **Boss Quiz** (≥80%). Stages are individually unlockable. Every topic inside every stage ends with a **Torture Test** (quiz). Every stage ships: goal · topics · classic drills · **one flagship build** · curated free/cheap resources (book chapters + videos + interactive).

```
PHASE 0 — LAUNCHPAD (Week 0)
  S00  Toolchain & Workflow        gcc/clang, VS Code, the compile pipeline, Make first contact,
                                   gdb first contact, -Wall -Wextra, valgrind intro, git

PHASE 1 — C FLUENCY (Weeks 1–3)
  S01  Fundamentals I              types, printf/scanf, operators, control flow
  S02  Fundamentals II             functions, scope, recursion, arrays, strings, 2D arrays
  S03  The Memory Model ★          pointers in full (arith, void*, fn ptrs, ptr-to-ptr),
                                   stack vs heap, malloc family, leaks, UB taxonomy,
                                   debugging: gdb + valgrind + sanitizers

PHASE 2 — SYSTEMS C (Weeks 4–6)
  S04  Structs & ADTs in C         structs, unions, enums, bit fields, header/impl pattern,
                                   opaque pointers, designing C APIs
  S05  Preprocessor & Builds       headers, macros, #ifdef, multi-file projects, Makefiles,
                                   static libs, writing tests in C, warning mastery
  S06  Bits & Low-Level Craft      bitwise ops & masks, endianness, fixed-width ints,
                                   two's complement, IEEE-754 intro, classic bit tricks
                                   (interview staple, currently missing entirely)

PHASE 3 — DATA STRUCTURES (Weeks 7–11)
  S07  Complexity Toolkit          Big-O/Θ/Ω, amortized analysis, logs & series math,
                                   recursion↔iteration, tracing loops on paper
  S08  Linear DS I                 dynamic array, linked lists (S/D/circular), stack,
                                   queue, deque — every one from scratch, twice
  S09  Linear DS II                hash tables in depth (functions, collisions, load factor),
                                   strings & pattern matching, matrices
  S10  Non-Linear DS               binary trees, traversals, BST, heaps/priority queues,
                                   AVL concept + rotations, tries
  S11  Graphs                      representations, BFS/DFS, topo sort, cycle detection,
                                   Dijkstra, Bellman-Ford concept, MST, union-find

PHASE 4 — ALGORITHMS & INTERVIEW CORE (Weeks 12–16)
  S12  Sorting & Searching         all classic sorts by hand, binary search family
                                   (bounds, rotated arrays), two pointers, sliding window
  S13  Recursion & Backtracking    subsets, permutations, N-Queens, Sudoku, pruning
  S14  Dynamic Programming         memoization → tabulation, knapsack family, LIS, LCS,
                                   grid paths
  S15  Greedy & Heaps in Anger     intervals, greedy proofs intuition, PQ patterns

PHASE 5 — INTERVIEW ENDGAME (Weeks 17–20)
  S16  Interview Patterns Sprint   NeetCode-150 patterns mapped in C-where-possible,
                                   LeetCode/HackerRank cadence, mock-interview scripts,
                                   thinking-out-loud practice
  S17  Capstone Portfolio Build    one substantial system (arena allocator, mini key-value
                                   store with BST index, or graph pathfinder) — tested,
                                   README'd, portfolio-grade
  S18  Maintain the Blade          ongoing: spaced review, CodeChef Starters weekly cadence,
                                   habit systems
```

**Milestones become flagship builds** (7, mapped to phases): memory-safe arena + valgrind-clean stress test · contacts CLI (multi-file, Makefile, tests) · expression evaluator/tokenizer · file indexer (trie/BST) · maze pathfinder with visual output · DP problem-set gauntlet · portfolio capstone.

**What changed vs v2 (the honest gaps this fixes):** preprocessor/build tooling didn't exist (real C jobs and interviews assume it) · bit manipulation was missing (a top-5 interview topic) · DP was a 4-line "optional" footnote — now a full stage · interview prep was one line of "solve 10 LeetCode problems" — now a 3-stage endgame · strings/hash tables were underweight · nothing was gated, so a weak Stage 3 leaked into everything after (now: boss quizzes).

### Quiz engine — "Torture Tests"

Every topic ends with a quiz mixing these formats (per your spec):

| Format | What it looks like |
|---|---|
| **Find the bug** | Code shown with numbered lines → identify the faulty line (off-by-one, missing `free`, `=` vs `==`, format-string mismatch…) |
| **Fix the code** | Editable code block → make the tests pass (runs in-browser if the WASM spike succeeds) |
| **Predict the output** | Trace execution incl. pointer arithmetic, undefined behavior gotchas |
| **Why does this crash?** | Segfault/leak diagnosis → pick the cause |
| **MCQ / match** | Complexity matching, concept checks, "which free() call leaks?" |
| **Fill the blank** | Complete the loop invariant / the base case |

Rules: instant feedback with the *why* explained · fail → linked micro-resource + retry with re-rolled variants · quiz XP feeds ranks · missed quizzes auto-enter a **spaced-review queue** (SM-2-lite) that resurfaces them in future dailies.

**Three quiz classes** (full spec in CURRICULUM.md):
1. **Torture Tests** — per-topic checks inside a stage (find-the-bug, fix-the-code, predict-output, why-crash, MCQ/match, fill-blank)
2. **Boss Gates** — 4 phase-exit exams, 20–25 items each, ≥80% to unlock the next phase; double as placement tests (pass cold at ≥80% → phase unlocks instantly; beginners just follow the path)
3. **Spaced Review** — dynamic weekly quizzes composed from your personal mistake history (SM-2-lite)

**Volume:** ≈282 authored quiz items across 19 stages + 90 boss-gate items — blueprints per stage are in CURRICULUM.md Appendix A. Authored phase-by-phase so each phase ships complete rather than all-at-once.

### Resource canon — "the best, period" (cost is not a filter; per Farza)

**Books — the best available, full stop:**

| Role | Book | Why it earns its slot |
|---|---|---|
| Primary C book | **K.N. King — *C Programming: A Modern Approach*, 2e** | The best C pedagogy book ever written; graded exercises; complete C99 |
| C mastery set | **K&R, 2e** · **CS:APP, 3e** · **Effective C (Seacord)** · **Modern C (Gustedt)** · **Beej's Guide to C** | K&R for idiom · CS:APP for what the machine actually does (mandatory for the memory stage) · Seacord for modern secure C · Gustedt/Beej as free-current companions |
| DSA in C | **Weiss — *Data Structures and Algorithm Analysis in C*, 2e** | The serious DSA book that actually teaches in C — maps 1:1 to Phases 3–4 |
| Algorithms (learning) | **Skiena — *The Algorithm Design Manual*, 3e** | The best "how to actually design and solve" book; war stories make patterns stick |
| Algorithms (reference) | **CLRS, 4th ed** | The canonical reference — a consultation tool, not cover-to-cover reading |
| Algorithms (free spine) | **Jeff Erickson — *Algorithms*** (official free PDF) · **cp-algorithms.com** · **Open Data Structures (C edition)** | Rigorous free layer that stays open in a browser tab |
| Interview | **Cracking the Coding Interview, 6e** · **Tech Interview Handbook** (free) | CTCI is still the interview bible; TIH covers process/CV/negotiation |
| Interview drills | **Elements of Programming Interviews (C++ variant)** | C-close, structured difficulty ladder, method transfers directly |
| Optional depth | *Algorithms Illuminated* (Roughgarden) · *Linkers & Loaders* (Levine) | For Phase 2 build tooling and Phase 4 intuition, if wanted |

**Visualization-first learning — its own pillar, linked inside every stage:**

| Tool | Best for |
|---|---|
| **Python Tutor** (pythontutor.com) | **The pointer teacher.** Step-by-step C execution with live stack frames, heap boxes and pointer arrows. Mandatory companion for Stage S03 |
| **VisuAlgo** (visualgo.net) | The most complete DSA visualization suite — sorting, trees, graphs, hashing, with built-in quiz questions |
| **USF Galles / csvistool.com** | David Galles' hands-on interactive DS animations (lists, trees, heaps, hash tables, B-trees) |
| **Algorithm Visualizer** (algorithm-visualizer.org) | Code + animation side-by-side, executable walkthroughs |
| **Compiler Explorer** (godbolt.org) | See the assembly your C compiles to — pointer arithmetic, calls, optimization; deepens S03/S06 |
| **UBC Okanagan DS visualizations** | A second polished suite for lists/stacks/queues/trees |
| **CS50 IDE / Sandbox** | Runnable environment paired with the CS50 video spine |

Each stage's resource list gets a **"Watch it move"** entry (the right viz tool for that topic) alongside book chapters and videos — e.g. S03 pointers → Python Tutor pre-loaded snippets, S10 trees → VisuAlgo BST + Galles AVL rotations, S12 sorting → VisuAlgo race view.

### Visualization Lab (new app section)

A first-class **`/viz` page** in the app: per-topic cards pairing the topic with its best visualization, one-tap deep links (e.g. Python Tutor with that stage's sample code pre-filled), guided "trace this on the viz, then predict, then run" exercises, and a personal **visual-notes canvas** (sketch the pointer diagram before you code it).

**Video spine** (verified): CS50x (weeks 1–5) · mycodeschool (pointers/linked lists/sorting) · Abdul Bari (algorithms) · William Fiset (DSA + graph theory) · Jacob Sorber (systems C) · NeetCode (pattern walkthroughs).

**Practice platforms — exactly which one, and when:**

| Platform | Use it | How |
|---|---|---|
| **HackerRank** | Phases 1–2 | The C skills track — low-stakes syntax reps while the language is still unfamiliar |
| **Exercism** | Phases 1–3 | C track with **human mentoring** — real feedback on correctness and style, free |
| **CodeChef** | Phase 1 (optional) → Phase 5 (core) | Free guided C course as an interactive alternative for S01–S02; then **Starters** (weekly rated contests, Div 3/4 for beginners) become the contest cadence in S16–S18 |
| **LeetCode** | Phases 4–5 (from S12 on) | THE interview platform — S16's pattern sets are drilled here; done in C by default, and the plan flags the rare problems where C fights the judge and C++ is pragmatic |
| **Codédex** | Not core — deliberately skipped | No C course (C++ only); a C++ course inside a C roadmap breeds syntax confusion. Revisit only if you ever want gamified warm-ups |

Rule of thumb: **learn on HackerRank/Exercism/CodeChef, compete on CodeChef, interview-prep on LeetCode.**

Every URL is re-verified during the build; dead links in v2 (e.g. the Dr. Memory pointer) get replaced.

---

## 3 · UI/UX — redesign from scratch

**Recommended direction: "Terminal Apprentice"** — dark-first, ink-on-charcoal with a single phosphor accent per phase, JetBrains Mono for code/numbers and Space Grotesk for display. It suits C/DSA, makes the Dread Engine's corruption effects land harder, and code reads beautifully. A light "Blueprint" theme ships as a second theme built from the same tokens (so you're not married to dark mode).

### Information architecture (was: one endless page)

| Route | Purpose |
|---|---|
| `/` **Today** | The daily contract: target hours, task stack, focus timer, close-day — unchanged soul, new body |
| `/roadmap` | **Journey map**: vertical path with phase gates, boss-quiz locks, per-node progress ring |
| `/arena` | Quiz hub: spaced-review queue, boss quizzes, stage torture tests |
| `/viz` | **Visualization Lab**: per-topic viz cards, deep-linked Python Tutor/VisuAlgo sessions, visual-notes canvas |
| `/stats` | GitHub-style year heatmap, streak economy, dread ledger, tribunal archive, projections |
| `/library` | The resource canon, searchable, tagged by format/stage — books, video spine, and viz tools in one place |
| `/settings` | Profile, hour targets, bedtime, roast intensity, themes, data export/import, diagnostics |

### UX upgrades over v2

- **First-run onboarding wizard** (v2 drops you into an empty app): start date, hour targets, bedtime, theme, roast intensity — 60 seconds, sets everything.
- **Roast intensity slider** (Mild / Spicy / Nuclear): the Dread Engine stays, but you own the dial. Nuclear = current behavior.
- **Command palette (Ctrl+K)** + keyboard shortcuts (`t` today, `r` roadmap, `j/k` navigate stages).
- **Mobile-first** throughout (v2 was desktop-shaped); reduced-motion support; WCAG AA contrast on every token pair; proper focus management in modals.
- **Micro-interactions**: checkboxes with spring physics, progress rings that count up, phase-gate unlock ceremony, redesigned confetti, roast overlay with glitch-in entrance.
- **Copy**: same personality, rewritten sharper; all v2 roasts migrated + new tiers.

## 4 · Systems ported from v2 (kept, refined)

Daily engine · debt/catch-up scheduling · streaks + insurance tokens · Sunday tribunal with stamps · Day Inspector · Focus Timer (adds Pomodoro mode) · XP/ranks (rebalanced to the new content volume) · Dread Engine (intensity slider, bug-free) · Bedtime lockout · export/import (new v3 schema + **v2 importer**) · Guardian → real test suite.

## 5 · Build order (each phase ships something usable)

| # | Phase | Delivers | Gate |
|---|---|---|---|
| A | Scaffold | Vite/React/TS app, design tokens + both themes, router, storage layer w/ tests, CI | `npm test` green |
| B | Curriculum data | v3 curriculum as typed TS data, all 19 stages + milestones | Content review by you |
| C | Roadmap UI | Journey map, stage pages, progress, notes | You can track stages |
| D | Daily engine | Schedule builder ported w/ unit tests, Today page, timer, close-day | Full daily loop works |
| E | Quiz engine | All 6 formats, scoring, boss gates, spaced review · quizzes for Phases 0–2 | First boss quiz passable |
| F | Accountability | Dread/roast/tribunal/insurance/bedtime ported + intensity slider | Full v2 parity + |
| G | Stats & polish | Dashboard, library, Visualization Lab, onboarding wizard, command palette, a11y pass | Design QA |
| H | Endgame | Phase 3–5 quizzes, capstone page, PWA, v2 importer, deploy, README rewrite | Production |

**Honest estimate:** 6–8 focused sessions. The curriculum + quiz authoring is the long pole, not the code.

## 6 · Risks & decisions

- **WASM C execution** — spike day one; deep-link fallback is already designed in. Either way ships.
- **v2 data** — import offered, never auto-migrated; legacy app stays runnable at `/legacy`.
- **Quiz volume** — shipped phase-by-phase (E → H), never blocking the tracker core.
- **Deploy** — recommend replacing the current Vercel project in place (same URL); the old app stays at `/legacy/index.html` so nothing is lost.

## 7 · Your calls before I scaffold

1. Curriculum structure above — right shape? (phases, gating, DP/interview weight)
2. UI direction: **Terminal Apprentice** as proposed, or a different vibe?
3. Roast intensity default: Spicy (recommended) or keep Nuclear?
4. Deploy: replace the existing Vercel app in place, or new project alongside?
