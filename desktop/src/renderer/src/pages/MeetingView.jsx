import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { socketService } from '../services/socketService.js';
import { useAppStore } from '../store/appStore.js';
import { useMeetingStore } from '../store/meetingStore.js';

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 360px',
    gap: 'var(--spacing-lg)',
    height: 'calc(100vh - var(--header-height) - var(--spacing-xl) * 2)',
    overflow: 'hidden',
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    height: '100%',
    overflow: 'hidden',
  },
  meetingHeader: {
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-md) var(--spacing-lg)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0,
  },
  titleArea: {
    display: 'flex',
    flexDirection: 'column',
  },
  meetingTitle: {
    fontSize: 'var(--font-size-lg)',
    fontWeight: 'var(--font-weight-semibold)',
  },
  meetingMeta: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    display: 'flex',
    gap: 'var(--spacing-md)',
    marginTop: 'var(--spacing-xs)',
  },
  observabilityBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    padding: '2px 8px',
    fontSize: '10px',
    color: 'var(--color-text-secondary)',
    fontFamily: 'monospace',
  },
  btnStop: {
    backgroundColor: 'var(--color-error)',
    color: '#fff',
    border: 'none',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    fontWeight: 'var(--font-weight-semibold)',
    cursor: 'pointer',
    fontSize: 'var(--font-size-sm)',
    transition: 'opacity var(--transition-fast)',
  },
  transcriptBox: {
    flex: 1,
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-lg)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
  },
  transcriptBubble: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  bubbleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--spacing-sm)',
    marginBottom: '2px',
  },
  speakerName: {
    fontSize: 'var(--font-size-xs)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-accent)',
  },
  bubbleTime: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
  },
  bubbleText: {
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: '0 var(--radius-md) var(--radius-md) var(--radius-md)',
    padding: 'var(--spacing-sm) var(--spacing-md)',
    fontSize: 'var(--font-size-sm)',
    lineHeight: '1.4',
  },
  rightPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-md)',
    height: '100%',
    overflowY: 'auto',
  },
  card: {
    backgroundColor: 'var(--color-bg-card)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    padding: 'var(--spacing-md)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-sm)',
  },
  cardTitle: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    color: 'var(--color-text-primary)',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: 'var(--spacing-xs)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--spacing-xs)',
    listStyle: 'none',
  },
  listItem: {
    fontSize: 'var(--font-size-sm)',
    padding: 'var(--spacing-sm)',
    backgroundColor: 'var(--color-bg-secondary)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-sm)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  itemMeta: {
    fontSize: '10px',
    color: 'var(--color-text-muted)',
  },
  aiStatus: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '11px',
    color: 'var(--color-text-secondary)',
  },
  pulseDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: 'var(--color-accent)',
    animation: 'pulse 1.5s infinite',
  },
};

export default function MeetingView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const transcriptEndRef = useRef(null);

  const { isRecording, connectionStatus, setRecording, setConnectionStatus } = useAppStore();
  const { activeMeeting, setActiveMeeting, clearActiveMeeting } = useMeetingStore();

  const [transcript, setTranscript] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [actionItems, setActionItems] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [aiStatus, setAiStatus] = useState('Idle');
  const [metrics, setMetrics] = useState({ llmLatency: 0, embedLatency: 0, pipeLatency: 0 });

  // Connect socket on load
  useEffect(() => {
    // If not recording or no meeting, pull info first
    if (!activeMeeting) {
      window.meetingPilot.meeting.get(id).then((res) => {
        if (res.success) {
          setActiveMeeting(res.data);
        }
      });
    }

    socketService.connect(id, (status) => {
      setConnectionStatus(status);
    });

    // Subscribe to pipeline updates
    socketService.subscribe('transcript:chunk', (event) => {
      setTranscript((prev) => [...prev, event.payload]);
      setAiStatus('Indexing Chunk...');
    });

    socketService.subscribe('ai:suggestion', (event) => {
      setSuggestions((prev) => [event.payload, ...prev]);
      setAiStatus('Idle');
    });

    socketService.subscribe('ai:action-items', (event) => {
      setActionItems((prev) => [...event.payload, ...prev]);
      setAiStatus('Idle');
    });

    socketService.subscribe('ai:decisions', (event) => {
      setDecisions((prev) => [...event.payload, ...prev]);
      setAiStatus('Idle');
    });

    socketService.subscribe('ai:summary', (event) => {
      setSummary(event.payload);
      setAiStatus('Summary Generated');
    });

    // Handle metrics broadcast
    socketService.subscribe('observability:metrics', (event) => {
      setMetrics(event.payload);
    });

    return () => {
      socketService.disconnect();
    };
  }, [id, activeMeeting, setActiveMeeting, setConnectionStatus]);

  // Scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  const handleStopMeeting = async () => {
    setAiStatus('Generating Summary...');
    const res = await window.meetingPilot.meeting.stop(id);
    if (res.success) {
      setRecording(false);
      setActiveMeeting(res.data);
      // Wait for socket summary event, then go to history
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <div style={styles.meetingHeader}>
          <div style={styles.titleArea}>
            <div style={styles.meetingTitle}>{activeMeeting?.title || 'Active Meeting'}</div>
            <div style={styles.meetingMeta}>
              <span>Status: {activeMeeting?.status || 'Active'}</span>
              <span>Connection: {connectionStatus}</span>
              <span style={styles.observabilityBadge}>Pipe: {metrics.pipeLatency}ms</span>
            </div>
          </div>
          <button style={styles.btnStop} onClick={handleStopMeeting}>
            ■ Stop Meeting
          </button>
        </div>

        <div style={styles.transcriptBox}>
          {transcript.length === 0 ? (
            <div
              style={{
                color: 'var(--color-text-muted)',
                textAlign: 'center',
                marginTop: 'var(--spacing-2xl)',
              }}
            >
              Transcript stream starting... Speak into your microphone.
            </div>
          ) : (
            transcript.map((chunk, idx) => (
              <div key={idx} style={styles.transcriptBubble}>
                <div style={styles.bubbleHeader}>
                  <span style={styles.speakerName}>{chunk.speaker}</span>
                  <span style={styles.bubbleTime}>
                    {new Date(chunk.startTime * 1000).toLocaleTimeString()}
                  </span>
                </div>
                <div style={styles.bubbleText}>{chunk.text}</div>
              </div>
            ))
          )}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            <span>AI Copilot Status</span>
            <div style={styles.aiStatus}>
              {aiStatus !== 'Idle' && <div style={styles.pulseDot} />}
              <span>{aiStatus}</span>
            </div>
          </div>
          <div
            style={{
              fontSize: 'var(--font-size-xs)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>LLM Latency:</span>
              <span>{metrics.llmLatency}ms</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Embed Latency:</span>
              <span>{metrics.embedLatency}ms</span>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Live Suggestions</div>
          <ul style={styles.list}>
            {suggestions.length === 0 ? (
              <li style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                Waiting for suggestions...
              </li>
            ) : (
              suggestions.map((sug, idx) => (
                <li key={idx} style={styles.listItem}>
                  <div>{sug.content}</div>
                </li>
              ))
            )}
          </ul>
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Action Items</div>
          <ul style={styles.list}>
            {actionItems.length === 0 ? (
              <li style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                No action items detected yet.
              </li>
            ) : (
              actionItems.map((item, idx) => (
                <li key={idx} style={styles.listItem}>
                  <div style={{ textDecoration: item.isCompleted ? 'line-through' : 'none' }}>
                    {item.text}
                  </div>
                  <div style={styles.itemMeta}>Assignee: {item.assignee || 'Unassigned'}</div>
                </li>
              ))
            )}
          </ul>
        </div>

        {summary && (
          <div style={styles.card}>
            <div style={styles.cardTitle}>Draft Summary</div>
            <div style={{ fontSize: 'var(--font-size-sm)', lineHeight: '1.4' }}>
              {summary.content}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
