import { motion } from 'framer-motion'
import { usePipelineStore } from '../../store/usePipelineStore'

export function ProcessingTimeline() {
  const timelineEvents = usePipelineStore((state) => state.timelineEvents)
  const progressQuantum = usePipelineStore((state) => state.progressQuantum)
  const progressClassical = usePipelineStore((state) => state.progressClassical)
  const blendedProgress = Math.round((progressQuantum + progressClassical) / 2)

  return (
    <section className="glass-panel" style={{ marginTop: '1rem', padding: '0.75rem 0.95rem' }}>
      <div className="section-title" style={{ marginBottom: '0.7rem' }}>
        <h3>Shared Timeline</h3>
        <span className="section-tag">Quantum and Classical in sync</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '0.8rem',
          alignItems: 'start',
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
        {timelineEvents.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pill"
            style={{
              whiteSpace: 'nowrap',
              borderColor:
                event.side === 'quantum'
                  ? 'rgba(38,230,255,0.55)'
                  : event.side === 'classical'
                    ? 'rgba(255,189,89,0.45)'
                    : 'rgba(124,241,165,0.55)',
            }}
          >
            {event.label}
          </motion.div>
        ))}
        </div>

        <div style={{ minWidth: 120, display: 'grid', gap: 4 }}>
          <span className="section-tag" style={{ textAlign: 'right' }}>
            {blendedProgress}% complete
          </span>
          <div
            style={{
              width: 120,
              height: 8,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.14)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${blendedProgress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, rgba(38,230,255,0.95), rgba(255,189,89,0.9))',
                transition: 'width 200ms linear',
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}