import { useMemo } from 'react'
import { usePipelineStore } from '../../store/usePipelineStore'

export function AmplitudeEncodingBars() {
  const selectedTile = usePipelineStore((state) => state.selectedTile)

  const bars = useMemo(() => {
    const values = selectedTile?.values ?? Array.from({ length: 16 }, (_, idx) => 80 + idx * 9)
    const magnitude = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0)) || 1
    return values.map((value) => value / magnitude)
  }, [selectedTile])

  return (
    <div>
      <div className="section-title" style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.88rem' }}>Amplitude Encoding</h3>
        <span className="section-tag">a_i = x_i / ||x||</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(16, minmax(0, 1fr))',
          alignItems: 'end',
          minHeight: 94,
          gap: 5,
          border: '1px solid rgba(116,183,255,0.2)',
          borderRadius: 12,
          padding: 8,
          background: 'rgba(255,255,255,0.02)',
        }}
      >
        {bars.map((value, index) => (
          <div key={index} style={{ display: 'grid', justifyItems: 'center', gap: 4 }}>
            <div
              style={{
                height: `${Math.max(6, value * 72)}px`,
                width: 8,
                borderRadius: 99,
                background: 'linear-gradient(180deg, #26e6ff, #ffbd59)',
              }}
            />
            <span className="section-tag" style={{ fontSize: '0.6rem' }}>
              a{index}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}