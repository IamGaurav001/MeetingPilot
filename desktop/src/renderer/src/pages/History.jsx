const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
  },
  empty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--spacing-2xl)',
    color: 'var(--color-text-muted)',
    gap: 'var(--spacing-sm)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: 'var(--spacing-sm)',
  },
};

export default function History() {
  return (
    <div style={styles.container}>
      <div style={styles.empty}>
        <span style={styles.emptyIcon}>◷</span>
        <p>No meetings yet</p>
        <p style={{ fontSize: 'var(--font-size-sm)' }}>
          Your completed meetings will appear here
        </p>
      </div>
    </div>
  );
}
