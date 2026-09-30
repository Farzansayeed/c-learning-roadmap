import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { IntroGate } from './IntroGate';

/**
 * IntroGate lifecycle — the intro overlay must ALWAYS clean itself up on a
 * pure timer (never on rAF/animation-end, which freeze in occluded tabs),
 * fire the blast on schedule, and never block the site underneath.
 */

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  // act()-wrapped: pending timers update state, and those updates must land
  // inside act or React logs a spurious "not wrapped in act" warning.
  act(() => {
    vi.runOnlyPendingTimers();
  });
  vi.useRealTimers();
  document.documentElement.removeAttribute('data-intro');
});

// jsdom has no matchMedia; IntroGate treats "no reduced motion" as play.
vi.stubGlobal(
  'matchMedia',
  Object.assign(vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }), {
    matches: false,
  }),
);

// jsdom lacks ResizeObserver / pointer events the logo component touches.
class RO {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}
vi.stubGlobal('ResizeObserver', RO);
vi.stubGlobal(
  'PointerEvent',
  class PointerEvent extends Event {
    clientX: number;
    clientY: number;
    constructor(type: string, init: { clientX?: number; clientY?: number } = {}) {
      super(type);
      this.clientX = init.clientX ?? 0;
      this.clientY = init.clientY ?? 0;
    }
  },
);

// The ElectricLogo effect needs WebGL; stub the module out via its container.
vi.mock('../components/ElectricLogo/ElectricLogo', () => ({
  default: () => <div data-testid="electric-logo-stub" />,
}));

describe('IntroGate', () => {
  it('renders children immediately underneath the intro', () => {
    render(
      <IntroGate>
        <div>site-content</div>
      </IntroGate>,
    );
    expect(screen.getByText('site-content')).toBeTruthy();
    expect(document.querySelector('.forge-intro')).toBeTruthy();
    expect(document.querySelector('.forge-intro')?.getAttribute('data-phase')).toBe('hold');
    expect(document.documentElement.hasAttribute('data-intro')).toBe(true);
  });

  it('plays hold → open → done on the timers, then unmounts', () => {
    render(
      <IntroGate>
        <div>site-content</div>
      </IntroGate>,
    );
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(document.querySelector('.forge-intro')?.getAttribute('data-phase')).toBe('hold');
    act(() => {
      vi.advanceTimersByTime(300); // 1300ms: blast fired, open
    });
    expect(document.querySelector('.forge-intro')?.getAttribute('data-phase')).toBe('open');
    act(() => {
      vi.advanceTimersByTime(1400); // ~2700ms: total elapsed
    });
    expect(document.querySelector('.forge-intro')).toBeNull();
    expect(document.documentElement.hasAttribute('data-intro')).toBe(false);
    expect(screen.getByText('site-content')).toBeTruthy();
  });

  it('clicking the overlay skips straight to open and it still unmounts', () => {
    render(
      <IntroGate>
        <div>site-content</div>
      </IntroGate>,
    );
    act(() => {
      fireEvent.click(document.querySelector('.forge-intro') as HTMLElement);
    });
    expect(document.querySelector('.forge-intro')?.getAttribute('data-phase')).toBe('open');
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    expect(document.querySelector('.forge-intro')).toBeNull();
  });

  it('pressing any key skips the intro', () => {
    render(
      <IntroGate>
        <div>site-content</div>
      </IntroGate>,
    );
    act(() => {
      fireEvent.keyDown(window, { key: 'Enter' });
    });
    expect(document.querySelector('.forge-intro')?.getAttribute('data-phase')).toBe('open');
  });

  it('reduced motion: no overlay ever, children shown', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
    );
    render(
      <IntroGate>
        <div>site-content</div>
      </IntroGate>,
    );
    expect(document.querySelector('.forge-intro')).toBeNull();
    expect(screen.getByText('site-content')).toBeTruthy();
    expect(document.documentElement.hasAttribute('data-intro')).toBe(false);
  });
});
