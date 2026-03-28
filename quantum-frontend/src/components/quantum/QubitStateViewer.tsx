import { usePipelineStore } from '../../store/usePipelineStore'

export function QubitStateViewer() {
  const qubitFrame = usePipelineStore((state) => state.qubitFrame)
  const values = [qubitFrame.q0, qubitFrame.q1, qubitFrame.q2, qubitFrame.q3]

  return (
    <div>
      <div className="section-title" style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.88rem' }}>Qubit Probabilities</h3>
        <span className="section-tag">|0&gt; and |1&gt; amplitudes in motion</span>
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        {values.map((value, idx) => (
          <div key={idx} style={{ display: 'grid', gridTemplateColumns: '42px 1fr 52px', gap: 8, alignItems: 'center' }}>
            <span className="section-tag">q{idx}</span>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.12)', overflow: 'hidden' }}>
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, value * 100))}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg, #26e6ff, #85fbbe)',
                }}
              />
            </div>
            <span className="section-tag">{value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}