import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMeetingStore } from '../store/meetingStore.js';
import { useAppStore } from '../store/appStore.js';

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
  const navigate = useNavigate();
  const { setActiveMeeting } = useMeetingStore();
  const { setRecording } = useAppStore();

  const handleStartMeeting = async () => {
    console.log('[Dashboard] Start meeting button clicked');
    console.log('[Dashboard] Checking window.meetingPilot:', window.meetingPilot);

    try {
      if (!window.meetingPilot || !window.meetingPilot.meeting) {
        throw new Error(
          'Electron preload bridge (window.meetingPilot) is not available. Ensure you are running inside Electron, not a standard web browser.',
        );
      }

      console.log('[Dashboard] Invoking window.meetingPilot.meeting.create');
      // 1. Create a new meeting via Electron bridge
      const createRes = await window.meetingPilot.meeting.create({
        title: `Quick Sync — ${new Date().toLocaleDateString()}`,
        description: 'AI meeting copilot session.',
      });
      console.log('[Dashboard] createRes response:', createRes);

      if (createRes.success && createRes.data) {
        const meetingId = createRes.data.id;
        console.log('[Dashboard] Invoking window.meetingPilot.meeting.start for id:', meetingId);

        // 2. Start the meeting
        const startRes = await window.meetingPilot.meeting.start(meetingId);
        console.log('[Dashboard] startRes response:', startRes);

        if (startRes.success) {
          // 3. Update active states
          console.log('[Dashboard] Updating Zustand store values');
          setActiveMeeting(startRes.data);
          setRecording(true);

          // 4. Navigate to live MeetingView panel
          console.log('[Dashboard] Navigating to /meeting/', meetingId);
          navigate(`/meeting/${meetingId}`);
        } else {
          console.warn('[Dashboard] startRes failed:', startRes);
        }
      } else {
        console.warn('[Dashboard] createRes failed:', createRes);
      }
    } catch (error) {
      console.error('[Dashboard] Failed to start new meeting:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.welcomeCard}>
        <h2 style={styles.welcomeTitle}>Welcome to MeetingPilot AI</h2>
        <p style={styles.welcomeSubtitle}>
          Your AI meeting copilot is ready. Start a meeting to get live suggestions, action items,
          and intelligent summaries.
        </p>
        <button
          style={styles.startButton}
          onClick={handleStartMeeting}
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
