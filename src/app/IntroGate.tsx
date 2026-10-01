import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import ElectricLogo from '../components/ElectricLogo/ElectricLogo';
import './IntroGate.css';

/**
 * IntroGate — the Forge ignition. Every open/reload: the electric logo
 * crackles to life (~1.1s), fires its blast ripple, the veil tears open
 * and the site burns through. Skippable by click/key; skipped entirely
 * for prefers-reduced-motion.
 *
 * Robustness notes (learned the hard way in preview):
 * - The unmount is pure setTimeout, never animation-end: rAF can be frozen
 *   indefinitely in an occluded/backgrounded tab, which wedges any
 *   animation-driven gate.
 * - The veil burst + overlay fade are CSS keyframe/compositor animations,
 *   not rAF-driven JS springs, for the same reason.
 * - The site renders underneath from t=0; the intro merely covers it.
 */

const CRACKLE_MS = 1100; // logo forms and charges
const SPREAD_MS = 850; // blast → veil tears open
const TOTAL_MS = CRACKLE_MS + SPREAD_MS + 600; // + overlay fade

/** Isolate WebGL crashes (some drivers throw on `new Renderer`): the intro
 * degrades to a plain cover + tag instead of nuking the whole site through
 * the app-wide ErrorBoundary. */
class LogoBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError(): { failed: boolean } {
    return { failed: true };
  }
  render(): ReactNode {
    return this.state.failed ? null : this.props.children;
  }
}

export function IntroGate({ children }: { children: ReactNode }) {
  const reduced =
    typeof window !== 'undefined' &&
    (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false);

  const [phase, setPhase] = useState<'hold' | 'open' | 'done'>(reduced ? 'done' : 'hold');
  const logoWrapRef = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  const fireBlast = useCallback(() => {
    const wrap = logoWrapRef.current;
    if (!wrap || firedRef.current) return;
    // Dispatch on the logo's canvas (inside the .electric-logo container):
    // events bubble UP, so targeting the wrapper would never reach the
    // component's own pointerdown listener. With bubbles:true the canvas
    // events surface on the container and trigger its shockwave + arc burst.
    const canvas = wrap.querySelector('canvas');
    if (!canvas) return;
    firedRef.current = true;
    const rect = wrap.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    for (const type of ['pointermove', 'pointerdown'] as const) {
      canvas.dispatchEvent(
        new PointerEvent(type, {
          clientX: x,
          clientY: y,
          bubbles: true,
          pointerId: 1,
          isPrimary: true,
        }),
      );
    }
  }, []);

  // Mount-only timeline: every timer lives for the component's whole life.
  useEffect(() => {
    if (reduced) return undefined;
    document.documentElement.setAttribute('data-intro', 'hold');
    const blast = window.setTimeout(fireBlast, CRACKLE_MS);
    const open = window.setTimeout(() => setPhase('open'), CRACKLE_MS + 100);
    const done = window.setTimeout(() => {
      document.documentElement.removeAttribute('data-intro');
      setPhase('done');
    }, TOTAL_MS);
    const skip = (): void => {
      fireBlast();
      setPhase('open');
    };
    window.addEventListener('keydown', skip);
    return () => {
      document.documentElement.removeAttribute('data-intro');
      window.clearTimeout(blast);
      window.clearTimeout(open);
      window.clearTimeout(done);
      window.removeEventListener('keydown', skip);
    };
  }, [reduced, fireBlast]);

  const skipNow = (): void => {
    if (phase !== 'hold') return;
    fireBlast();
    setPhase('open');
  };

  return (
    <>
      {phase !== 'done' && (
        <div
          className="forge-intro"
          data-phase={phase}
          role="button"
          aria-label="The Forge ignites — click to skip"
          onClick={skipNow}
        >
          <div className="forge-intro-cover" />
          <div ref={logoWrapRef} className="forge-intro-logo" aria-hidden>
            <LogoBoundary>
              <ElectricLogo
              src="/logo.png"
              color="#7ee2a8"
              glowColor="#39d98a"
              scale={0.34}
              intensity={1.35}
              glow={1.25}
              thickness={1.6}
              strands={5}
              bend={0.75}
              crackle={1.8}
              arcs={2}
              speed={3}
              fill={0.35}
              interactive
            />
            </LogoBoundary>
          </div>
          <div className="forge-intro-veil" aria-hidden />
          <div className="forge-intro-tag mono">the forge ignites — click to skip</div>
        </div>
      )}
      {children}
    </>
  );
}
