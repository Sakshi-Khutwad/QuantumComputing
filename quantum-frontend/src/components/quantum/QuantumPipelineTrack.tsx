import { usePipelineStore } from '../../store/usePipelineStore'

const stages = [
  { label: 'Tile Scan', mark: 12 },
  { label: 'Encoding', mark: 30 },
  { label: 'QFT', mark: 48 },
  { label: 'Grover', mark: 65 },
  { label: 'VQE', mark: 82 },
  { label: 'Reconstruct', mark: 95 },
]

export function QuantumPipelineTrack() {
  const progressQuantum = usePipelineStore((state) => state.progressQuantum)

  return (
    <div style={{ display: 'grid', gap: '0.5rem' }}>
      <div
        style={{
          height: 7,
          borderRadius: 999,
          background: 'rgba(255,255,255,0.12)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${progressQuantum}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #26e6ff, #ffbd59)',
            transition: 'width 160ms linear',
          }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0,1fr))', gap: 6 }}>
        {stages.map((stage) => {
          const active = progressQuantum >= stage.mark
          return (
            <div
              key={stage.label}
              className="pill"
              style={{
                textAlign: 'center',
                background: active ? 'rgba(38,230,255,0.18)' : 'rgba(38,230,255,0.05)',
                borderColor: active ? 'rgba(38,230,255,0.6)' : 'rgba(116,183,255,0.25)',
              }}
            >
              {stage.label}
            </div>
          )
        })}
      </div>
    </div>
  )
}