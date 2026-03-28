import { usePipelineStore } from '../../store/usePipelineStore'

export function LiveCircuitTheater() {
  const progressQuantum = usePipelineStore((state) => state.progressQuantum)
  const optimizationTrace = usePipelineStore((state) => state.optimizationTrace)

  const points = optimizationTrace.length
    ? optimizationTrace
        .slice(-40)
        .map((value, index, arr) => {
          const x = (index / Math.max(1, arr.length - 1)) * 100
          const min = Math.min(...arr)
          const max = Math.max(...arr)
          const norm = max - min > 0 ? (value - min) / (max - min) : 0.5
          const y = 90 - norm * 75
          return `${x},${y}`
        })
        .join(' ')
    : ''

  return (
    <div
      style={{
        border: '1px solid rgba(116,183,255,0.25)',
        borderRadius: 12,
        padding: '0.7rem',
        background: 'rgba(255,255,255,0.02)',
      }}
    >
      <div className="section-title" style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.88rem' }}>Live Circuit Theater</h3>
        <span className="section-tag">Single tile replay track</span>
      </div>
      <div
        style={{
          position: 'relative',
          height: 12,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
          border: '1px solid rgba(116,183,255,0.28)',
        }}
      >
        <div
          style={{
            width: `${progressQuantum}%`,
            height: '100%',
            background: 'linear-gradient(90deg, rgba(38,230,255,0.92), rgba(255,189,89,0.92))',
            boxShadow: '0 0 14px rgba(38,230,255,0.65)',
            transition: 'width 180ms linear',
          }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <span className="section-tag">|psi&gt; init</span>
        <span className="section-tag">QFT</span>
        <span className="section-tag">Grover</span>
        <span className="section-tag">VQE</span>
        <span className="section-tag">output</span>
      </div>

      <div
        style={{
          marginTop: 10,
          border: '1px solid rgba(116,183,255,0.25)',
          borderRadius: 10,
          padding: '0.45rem',
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        <div className="section-title" style={{ marginBottom: '0.3rem' }}>
          <h3 style={{ fontSize: '0.82rem' }}>VQE Theta Optimization Curve</h3>
          <span className="section-tag">COBYLA variance trace</span>
        </div>
        <svg width="100%" height="96" viewBox="0 0 100 96" preserveAspectRatio="none">
          <polyline
            points={points}
            fill="none"
            stroke="rgba(255,189,89,0.95)"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line x1="0" y1="90" x2="100" y2="90" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
        </svg>
      </div>
    </div>
  )
}