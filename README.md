# C × DSA Roadmap Tracker

A single-file, zero-dependency learning tracker for a C programming + Data Structures & Algorithms journey — with a personality that fights back.

**Live app:** open `index.html` in any modern browser — or hit **Live URL** below. No install, no server, works offline.

## Live

🔗 **https://c-learning-roadmap-farzan4.vercel.app**

Every `git push` auto-redeploys via Vercel.

## Features

### Core
- **12-stage roadmap** — Environment setup → pointers → dynamic memory → DSA fundamentals, with per-stage checklists and curated resources
- **Daily system** — hour targets (weekday/Sunday), stacked task lists, close-day verdicts
- **Debt-aware scheduling** — missed tasks stack onto tomorrow; two consecutive skipped days auto-insert a Catch-Up day
- **Streaks & heatmap** — 10-week activity grid with pass/fail/postponed/ghost states
- **Day Inspector** — click any past day to see exactly what was scheduled vs done

### Accountability systems
- **Dread Engine** — an escalating presence (CLEAN → ELDRITCH) that reacts to missed days: roasts get meaner, visuals corrupt
- **Roast system** — skip or postpone and face tiered, unhinged commentary; valid excuses exist but must be earned through interrogation
- **Pardon Tokens** — earned per 10 clean days; silently erase a failure's roast
- **Focus Timer** — wall-clock study sessions with strict mode (timer-only XP honesty)

### Mercy systems
- **Rest Days** — weekly tokens to protect streaks from one bad day
- **Catch-up days** — automatic debt-clearing slots after consecutive misses
- **Revert / Resume** — postpones can be taken back; today can be reopened (yesterday stays lost)

## Tech

| | |
|---|---|
| Runtime | Single HTML file · zero dependencies · works offline via `file://` |
| Persistence | `localStorage` (per-browser) + manual JSON export/import |
| Fonts | Fraunces (falls back to Georgia offline) |
| Self-tests | Built-in — open with `?selftest=1` or ⚙ → Self-test (~65 checks) |

## Usage

```bash
# clone
git clone https://github.com/Farzansayeed/c-learning-roadmap.git

# open
start index.html   # or double-click it
```

Set your start date in ⚙ Settings, tick boxes in Today's list, log hours, and **Close the Day** before bedtime.

> Skipping has consequences. The app keeps score.
