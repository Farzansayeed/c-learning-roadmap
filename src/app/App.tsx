import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { TopBar } from './TopBar';
import { ErrorBoundary } from './ErrorBoundary';
import { useLenis } from './useLenis';
import { Modal } from '../components/ui/Modal';
import { PHASES, STAGES } from '../data/curriculum';
import { useState } from 'react';

const pageMotion = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.18, ease: [0.25, 0.9, 0.35, 1] as const },
};

function Stub({ title, note }: { title: string; note: string }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div {...pageMotion}>
      <div
        style={{
          border: '1px dashed var(--border-strong)',
          borderRadius: 16,
          padding: '48px 28px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.3px' }}>{title}</h1>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 8 }}>{note}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 20 }}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid var(--border-strong)',
              background: 'var(--panel2)',
              color: 'var(--text)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Test modal (U8)
          </button>
          <NavLink
            to="/"
            style={{ color: 'var(--info)', fontSize: 13, fontWeight: 600, alignSelf: 'center' }}
          >
            ← Today
          </NavLink>
        </div>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} label={`${title} demo modal`}>
        <h2 style={{ fontSize: 17, fontWeight: 700 }}>Focus trap live.</h2>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginTop: 8, lineHeight: 1.6 }}>
          Tab cycles inside this dialog, Esc closes it, and focus returns to the button
          that opened it. Every overlay in The Forge inherits this behavior.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <input
            aria-label="Demo input"
            placeholder="Tab reaches me…"
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--panel2)',
              color: 'var(--text)',
              font: 'inherit',
              fontSize: 13,
            }}
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              border: '1px solid var(--border-strong)',
              background: 'var(--good-dim)',
              color: 'var(--good)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            Close
          </button>
        </div>
      </Modal>
    </motion.div>
  );
}

export default function App() {
  useLenis();
  const location = useLocation();

  return (
    <ErrorBoundary>
      <div>
        <TopBar />
        <main style={{ maxWidth: 1160, margin: '0 auto', padding: '28px 20px 90px' }}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={<Stub title="Today" note="The daily contract lands in Phase 3." />}
              />
              <Route
                path="/roadmap"
                element={
                  <motion.div {...pageMotion}>
                    <div style={{ display: 'grid', gap: 28 }}>
                      {PHASES.map((ph) => (
                        <section key={ph.id}>
                          <h2 style={{ fontSize: 13, fontWeight: 800, letterSpacing: 2, textTransform: 'uppercase', color: `var(--${ph.id})` }}>
                            Phase {ph.num} · {ph.title}
                          </h2>
                          <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0 14px' }}>{ph.tagline}</p>
                          <div style={{ display: 'grid', gap: 10 }}>
                            {ph.stageIds.map((sid) => {
                              const st = STAGES.find((x) => x.id === sid)!;
                              return (
                                <div
                                  key={sid}
                                  style={{
                                    border: '1px solid var(--border)',
                                    borderRadius: 14,
                                    padding: '14px 18px',
                                    background: 'var(--panel)',
                                    display: 'flex',
                                    alignItems: 'baseline',
                                    gap: 14,
                                  }}
                                >
                                  <span className="mono" style={{ color: `var(--${ph.id})`, fontWeight: 600, fontSize: 13 }}>
                                    {sid.toUpperCase()}
                                  </span>
                                  <span style={{ fontWeight: 700, fontSize: 15 }}>{st.title}</span>
                                  <span style={{ marginLeft: 'auto', color: 'var(--muted)', fontSize: 12.5, whiteSpace: 'nowrap' }}>
                                    {st.days === 0 ? 'ongoing' : `${st.days}d`} · {st.topics.length} topics · {st.drills.length} drills
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                          {ph.bossGateId && (
                            <div
                              className="mono"
                              style={{
                                marginTop: 10,
                                fontSize: 11,
                                letterSpacing: 2,
                                color: 'var(--warn)',
                                border: '1px dashed var(--border-strong)',
                                borderRadius: 10,
                                padding: '8px 14px',
                                width: 'fit-content',
                              }}
                            >
                              ⚔ BOSS GATE · {ph.bossGateId.toUpperCase()} · ≥80%
                            </div>
                          )}
                        </section>
                      ))}
                    </div>
                  </motion.div>
                }
              />
              <Route
                path="/arena"
                element={<Stub title="Arena" note="Torture tests land in Phase 4." />}
              />
              <Route path="/viz" element={<Stub title="Viz Lab" note="Lands in Phase 7." />} />
              <Route path="/stats" element={<Stub title="Stats" note="Lands in Phase 7." />} />
              <Route
                path="/library"
                element={<Stub title="Library" note="Lands in Phase 7." />}
              />
              <Route
                path="/settings"
                element={<Stub title="Settings" note="Full surface lands in Phase 3." />}
              />
              <Route
                path="*"
                element={<Stub title="Lost?" note="That route doesn't exist — yet." />}
              />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </ErrorBoundary>
  );
}
