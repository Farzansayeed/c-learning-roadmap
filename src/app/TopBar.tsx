import { NavLink } from 'react-router-dom';
import { AnvilMark } from './AnvilMark';
import { useSettings } from '../stores/settings';

const NAV = [
  { to: '/', label: 'Today' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/arena', label: 'Arena' },
  { to: '/viz', label: 'Viz' },
  { to: '/stats', label: 'Stats' },
  { to: '/library', label: 'Library' },
  { to: '/settings', label: 'Settings' },
] as const;

/**
 * App shell topbar. U4: 56px on mobile, brand truncates, one row.
 * Streak slot is a placeholder until Phase 3 wires the live counter.
 */
export function TopBar() {
  const theme = useSettings((s) => s.theme);
  const toggleTheme = useSettings((s) => s.toggleTheme);

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: '0 20px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            display: 'grid',
            placeItems: 'center',
            flex: 'none',
            background: 'var(--panel2)',
            border: '1px solid var(--border)',
            color: 'var(--p1)',
          }}
        >
          <AnvilMark size={20} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              letterSpacing: '-0.2px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            The Forge
          </div>
          <div
            className="mono"
            style={{
              fontSize: 10,
              color: 'var(--muted)',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            C × DSA · the tracker fights back
          </div>
        </div>

        <div
          style={{
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flex: 'none',
          }}
        >
          <div
            className="mono"
            title="Streak — live in Phase 3"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--muted)',
              border: '1px solid var(--border)',
              borderRadius: 99,
              padding: '4px 12px',
            }}
          >
            🔥 —
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'terminal' ? 'Blueprint' : 'Terminal'} theme`}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--panel)',
              color: 'var(--muted)',
              cursor: 'pointer',
              fontSize: 15,
            }}
          >
            {theme === 'terminal' ? '☀' : '☾'}
          </button>
        </div>
      </div>

      <nav
        aria-label="Primary"
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {NAV.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.to === '/'}
            style={({ isActive }) => ({
              padding: '7px 12px',
              fontSize: 13,
              fontWeight: 600,
              color: isActive ? 'var(--text)' : 'var(--muted)',
              borderBottom: isActive ? '2px solid var(--p1)' : '2px solid transparent',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
            })}
          >
            {n.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
