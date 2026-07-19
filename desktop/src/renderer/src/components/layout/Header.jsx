import { useLocation } from 'react-router-dom';

const pageTitles = {
  '/': 'Dashboard',
  '/history': 'Meeting History',
  '/settings': 'Settings',
};

const styles = {
  header: {
    height: 'var(--header-height)',
    borderBottom: '1px solid var(--color-border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 var(--spacing-xl)',
    backgroundColor: 'var(--color-bg-secondary)',
    flexShrink: 0,
    WebkitAppRegion: 'drag',
  },
  title: {
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
    WebkitAppRegion: 'no-drag',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-success)',
  },
};

export default function Header() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || 'MeetingPilot AI';

  return (
    <header style={styles.header}>
      <h1 style={styles.title}>{title}</h1>
      <div style={styles.status}>
        <div style={styles.statusDot} />
        <span>Ready</span>
      </div>
    </header>
  );
}
