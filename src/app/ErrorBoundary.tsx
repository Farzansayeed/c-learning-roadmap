import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
interface State {
  error: Error | null;
}

/** Last-resort crash screen — The Forge degrades, it never white-screens. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'grid',
            placeItems: 'center',
            padding: 24,
          }}
        >
          <div
            style={{
              border: '1px solid var(--border)',
              background: 'var(--panel)',
              borderRadius: 14,
              padding: '28px 32px',
              maxWidth: 480,
            }}
          >
            <p className="mono" style={{ color: 'var(--danger)', fontSize: 12, letterSpacing: 2 }}>
              SEGFAULT (RECOVERABLE)
            </p>
            <h1 style={{ margin: '10px 0 8px', fontSize: 20 }}>Something broke.</h1>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, lineHeight: 1.6 }}>
              The error was caught and your data is safe on disk. Reload to continue —
              if it keeps happening, export your data from Settings.
            </p>
            <pre
              className="mono"
              style={{
                marginTop: 14,
                fontSize: 11,
                color: 'var(--faint)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {this.state.error.message}
            </pre>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                marginTop: 18,
                padding: '8px 16px',
                borderRadius: 10,
                border: '1px solid var(--border-strong)',
                background: 'var(--panel2)',
                color: 'var(--text)',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
