const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xl)',
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(162, 155, 254, 0.08))',
    border: '1px solid rgba(108, 92, 231, 0.25)',
    borderRadius: 'var(--radius-lg)',
    padding: 'var(--spacing-2xl)',
  },
  welcomeTitle: {
    fontSize: 'var(--font-size-2xl)',
    fontWeight: 'var(--font-weight-bold)',
    marginBottom: 'var(--spacing-sm)',
  },
  welcomeSubtitle: {
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-md)',
    maxWidth: '600px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 'var(--spacing-md)',
  },
  statCard: {
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-lg)',
  },
  statLabel: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-muted)',
    marginBottom: 'var(--spacing-xs)',
  },
  statValue: {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 'var(--font-weight-bold)',
  },
  startButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    padding: 'var(--spacing-sm) var(--spacing-lg)',
    backgroundColor: 'var(--color-accent)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    marginTop: 'var(--spacing-lg)',
    transition: 'background-color var(--transition-fast)',
    cursor: 'pointer',
  },
};

export default function Dashboard() {
  return (
    <div style={styles.container}>
      <div style={styles.welcomeCard}>
        <h2 style={styles.welcomeTitle}>Welcome to MeetingPilot AI</h2>
        <p style={styles.welcomeSubtitle}>
          Your AI meeting copilot is ready. Start a meeting to get live suggestions,
          action items, and intelligent summaries.
        </p>
        <button
          style={styles.startButton}
          onMouseEnter={(e) => (e.target.style.backgroundColor = 'var(--color-accent-hover)')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = 'var(--color-accent)')}
        >
          ● Start New Meeting
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Meetings</div>
          <div style={styles.statValue}>0</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Action Items</div>
          <div style={styles.statValue}>0</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Decisions Tracked</div>
          <div style={styles.statValue}>0</div>
        </div>
      </div>
    </div>
  );
}
