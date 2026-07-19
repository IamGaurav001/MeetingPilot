const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-lg)',
    height: '100%',
  },
  placeholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: 'var(--color-text-muted)',
    fontSize: 'var(--font-size-lg)',
  },
};

export default function MeetingView() {
  return (
    <div style={styles.container}>
      <div style={styles.placeholder}>Select or start a meeting to see the live view</div>
    </div>
  );
}
