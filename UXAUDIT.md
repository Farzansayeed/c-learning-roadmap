# UXAUDIT.md — v2 (single-file app) · full UX/UI audit

**Method:** live app in a real browser at 1440×900, 650px, and 390×844; both themes; postpone flow exercised; a11y tree read; console watched. Plus a line-level code audit of the 3,358-line `index.html`.

**Overall verdict:** a genuinely well-crafted app with a strong personality — the claymorphic craft, verdict engine and tribunal are real design work. But it is a **single-page information avalanche** with desktop-shaped assumptions, and the redesign (v3) exists to fix the structural items below. Severity: 🔴 blocks daily use · 🟠 degrades · 🟡 polish.

---

## A. Information architecture

**A1 🔴 One endless page, everything always on.** Hero + toolbar + daily panel + 13 stage cards (default **all expanded** — ~90 checkboxes, 30+ notes textareas render at once) + resource hub + footer. The checklist is the star but the roadmap is 80% of the page's height; today's work is a needle in a stack of every future stage. *v3: routed pages (Today / Roadmap / Arena / Viz / Stats / Settings) — already in DESIGN.md.*
**A2 🔴 All stages expanded by default.** The a11y tree shows every stage open; the "expand/collapse" buttons exist but the default floods the user. *v3: journey map with collapsed stage detail pages.*
**A3 🟠 The daily panel is buried.** You must scroll past the hero to reach the only thing that matters on a study day. *v3: Today is the home route.*
**A4 🟠 Duplicate view logic.** The same 4 checkboxes appear twice (Today panel + Stage 00 card) — correct data, redundant UI; two places to look, two places to drift.
**A5 🟡 Footer claims "Stage 0 to Stage 11 — and the site is always watching" while the header says 13 (12 stages + milestones).** Counting confusion repeated in hero ("0/13 stages cleared").

## B. First-run & onboarding

**B1 🔴 Zero onboarding.** First launch shows "check something off first", "—" projection, 0 XP, all stages expanded — a wall of empty states with no "set your start date / hour targets / bedtime" guidance. The settings gear that holds all of this is a small icon in the daily header. *v3: 5-step wizard (locked decision #10/§5).*
**B2 🟠 Start date defaults to "today" silently.** The single most important schedule input is set invisibly; new users don't know it exists.
**B3 🟡 Roast intensity / pardon economy / dread rules are undiscoverable.** Personality systems the user can't see until they trigger one.

## C. Layout & responsive (observed, not guessed)

**C1 🔴 Mobile hours control breaks.** At 390px the hours row fragments: `+½` floats alone right of the progress bar, `+1`, timer and Start focus wrap onto a second ragged row (screenshot). The single most-used control cluster is visually broken on the device you'd use while coding.
**C2 🟠 Mobile topbar wraps to 3 lines** and eats ~110px of a 844px viewport; brand text doesn't truncate.
**C3 🟠 Desktop hero wastes ~45% width** (ring + empty right third) at 1440px; stat tiles wrap into a ragged 2-row grid ("check something off first" wraps to 3 lines).
**C4 🟠 Heatmap is a fixed 7-row grid** — 70 cells are ~2px-wide dust on mobile; no horizontal-scroll affordance visible.
**C5 🟡 Stage card two-column split leaves dead space** whenever Practice is shorter than Topics (screenshot: Stage 00 Practice column 70% empty).
**C6 🟡 No sticky "today" affordance** while scrolling stages; the only way back is manual scroll (Jump-to-today exists but only inside the hidden timeline).

## D. Visual design

**D1 🟠 Dark theme panel separation is weak** — card vs background differ by one subtle step (`#2b313d` on `#22262f`); cards float uncertainly. Accent colors (pMint/pSky/pPeach) keep light-theme hue identities in dark mode, giving a pastel-washed feel.
**D2 🟡 Typography hierarchy is carried almost entirely by weight** (800 vs 600) in small caps labels — everything shouts.
**D3 🟡 Empty-stat states use placeholder punctuation** ("—") and instruction text ("check something off first") where a designed empty state would do.
**D4 🟡 Reset button shares the toolbar row with Export/Import** — a destructive action with same visual weight as safe ones (confirm modal exists, still).
**D5 🟡 Noise overlay + `mix-blend-mode` over the whole page** costs GPU on low-end mobile for near-zero perceptual gain.

## E. Interaction & flows

**E1 🔴 Close-the-Day risk.** The ritual is good, but hours can be logged only via +½/+1 clicks — no keyboard entry; and after closing, reopening is possible for today but the affordance (reopen button placement) differs by verdict path. *v3: unified Close Day sheet.*
**E2 🟠 Postpone modal is a wall of 12+ excuse chips with no grouping** (valid vs invalid are mixed in one grid, screenshot) — the joke lands but the decision cost is real; "Keep studying instead" is the *last* item after a custom-input section, easy to lose.
**E3 🟠 Duplicate IDs in shipped markup** (`#nagBanner` ×2, `#lnFlavor`/`#lnAckBtn` ×3, duplicate `updateNag`) — v2 survives via first-match DOM rules, but it's drift landmine territory; `getElementById` silently binds to the first copy.
**E4 🟡 Focus timer has no persistence cue** — switching theme mid-session is fine, but a refresh during a session silently loses it (state not journaled per-second).
**E5 🟡 No undo for checkbox mis-clicks on closed days** (Revert/Resume exists only for postpones).

## F. Accessibility (tree + code)

**F1 🟠 Stage header buttons are fine, but expanded panels lack `aria-controls`** relationships; heatmap cells are buttons with date-only labels but no state text ("failed, 1.5h logged").
**F2 🟠 `:focus-visible` outline exists (good) but dark-theme focus color on mint chips fails contrast** against card backgrounds in places.
**F3 🟡 Modals don't trap focus or restore it on close**; Esc doesn't close the postpone overlay.
**F4 🟡 Icon-only buttons (theme, tribunal, gear) rely on `title`** for their accessible name — screen-reader names come from `aria-label` (present on theme only).
**F5 🟡 Reduced-motion is entirely unhandled** — glitch/pulse animations run regardless of `prefers-reduced-motion`.

## G. Performance & engineering

**G1 🟠 Whole app renders synchronously on load** — ~90 checkboxes + 30 textareas + SVG ring + heatmap in one first paint; fine on desktop, measurable on low-end mobile.
**G2 🟡 localStorage writes are stringified on every mutation** with no debounce.
**G3 🟡 Zero code organization** — 2,566-line script, one scope, no modules (v3's engines/ fix this by design).
**G4 ✅ Console is clean through interactions; self-test suite (~80 checks) is a genuinely good practice** — carried forward as CI + diagnostics.

## H. Copy & personality

**H1 ✅ The roast engine, tribunal stamps, and dread levels are excellent** — specific, funny, escalating. Keep the voice wholesale.
**H2 🟡 Copy occasionally over-explains** ("Pick your poison" + "it will be judged" + sub-paragraph all say the same thing).
**H3 🟡 Instructions drift** between playful and procedural; v3 formalizes two registers: system copy (crisp) and personality copy (roasts, stamps, dread).

---

## What v3 keeps (explicitly — the audit's "do not lose" list)

1. The close-the-day verdict ritual and its gravity
2. Tribunal stamps + weekly court
3. Dread Engine escalation (with the intensity dial)
4. Streak insurance + pardon economy
5. The claymorphic craft *spirit* — but rebuilt on a token system
6. Guardian-style self-testing → CI + in-app diagnostics
7. The excuse-roast interrogation flow (regrouped, see E2)

## v3 requirements generated by this audit (beyond DESIGN.md as written)

| # | Requirement | Source |
|---|---|---|
| U1 | Today is the home route; daily panel never buried | A1, A3 |
| U2 | Stages collapsed by default; stage detail is its own view | A1, A2 |
| U3 | Hours control: single-row on mobile, direct numeric entry allowed | C1, E1 |
| U4 | Topbar: 56px on mobile, brand truncates, streak + theme fit one row | C2 |
| U5 | Heatmap horizontally scrollable with week labels; ≥30px cells on touch | C4 |
| U6 | Postpone excuses grouped Valid / Invalid / Custom; "Keep studying" pinned primary | E2 |
| U7 | Focus timer state journaled; survives refresh | E4 |
| U8 | Focus trap + Esc-to-close + focus restore on all overlays | F3 |
| U9 | `prefers-reduced-motion` respected globally (React Bits animations included) | F5 |
| U10 | Dark theme: raise panel/bg contrast step; accents re-tuned for dark first | D1 |
| U11 | Destructive actions (Reset) isolated from safe actions | D4 |
| U12 | Designed empty states (no "—"/instruction strings) | D3 |
| U13 | One checkbox instance per item (Today panel links to stage, doesn't duplicate) | A4 |
| U14 | aria-controls/state text on interactive structures; aria-labels on all icon buttons | F1, F4 |
| U15 | Debounced persistence (150ms) + per-second timer journaling | G2, E4 |
