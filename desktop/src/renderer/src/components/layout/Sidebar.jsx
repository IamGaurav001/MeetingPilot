import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '⬡' },
  { path: '/history', label: 'History', icon: '◷' },
  { path: '/settings', label: 'Settings', icon: '⚙' },
];

const styles = {
  sidebar: {
    width: 'var(--sidebar-width)',
    height: '100vh',
    backgroundColor: 'var(--color-bg-secondary)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: 'var(--spacing-md)',
    gap: 'var(--spacing-sm)',
    flexShrink: 0,
  },
  logo: {
    padding: 'var(--spacing-md)',
    marginBottom: 'var(--spacing-lg)',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
  },
  logoText: {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-bold)',
    background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-medium)',
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
  },
  navLinkActive: {
    backgroundColor: 'var(--color-accent-subtle)',
    color: 'var(--color-accent)',
  },
  navIcon: {
    fontSize: 'var(--font-size-lg)',
    width: '24px',
    textAlign: 'center',
  },
};

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={{ fontSize: '1.5rem' }}>◈</span>
        <span style={styles.logoText}>MeetingPilot</span>
      </div>

      <nav>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={{
                ...styles.navLink,
                ...(isActive ? styles.navLinkActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
