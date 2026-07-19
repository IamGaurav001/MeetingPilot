const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xl)',
    maxWidth: '600px',
  },
  section: {
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-lg)',
  },
  sectionTitle: {
    fontSize: 'var(--font-size-md)',
    fontWeight: 'var(--font-weight-semibold)',
    marginBottom: 'var(--spacing-md)',
  },
  settingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 'var(--spacing-sm) 0',
    borderBottom: '1px solid var(--color-border)',
  },
  settingLabel: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-secondary)',
  },
  settingValue: {
    fontSize: 'var(--font-size-sm)',
    color: 'var(--color-text-primary)',
  },
  version: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    marginTop: 'var(--spacing-lg)',
  },
};

export default function Settings() {
  return (
    <div style={styles.container}>
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>General</h3>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Theme</span>
          <span style={styles.settingValue}>Dark</span>
        </div>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Audio Input</span>
          <span style={styles.settingValue}>Default Microphone</span>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>AI</h3>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Model</span>
          <span style={styles.settingValue}>Gemini 1.5 Flash</span>
        </div>
        <div style={styles.settingRow}>
          <span style={styles.settingLabel}>Live Suggestions</span>
          <span style={styles.settingValue}>Enabled</span>
        </div>
      </div>

      <p style={styles.version}>MeetingPilot AI v0.1.0</p>
    </div>
  );
}
