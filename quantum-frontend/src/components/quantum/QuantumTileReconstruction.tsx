import { usePipelineStore } from '../../store/usePipelineStore'

export function QuantumTileReconstruction() {
  const progressQuantum = usePipelineStore((state) => state.progressQuantum)
  const selectedQuantumAlgorithm = usePipelineStore((state) => state.selectedQuantumAlgorithm)
  const previews = usePipelineStore((state) => state.previews)
  const filled = Math.floor((progressQuantum / 100) * 64)

  const activePreview =
    selectedQuantumAlgorithm === 'QFT'
      ? previews.qft
      : selectedQuantumAlgorithm === 'GROVER'
        ? previews.grover
        : previews.vqe

  return (
    <div>
      <div className="section-title" style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.88rem' }}>Tile Reconstruction</h3>
        <span className="section-tag">Processed tiles returning to image</span>
      </div>
      {activePreview && (
        <img
          src={activePreview}
          alt="Quantum output preview"
          style={{
            width: '100%',
            height: 122,
            objectFit: 'cover',
            borderRadius: 10,
            border: '1px solid rgba(116,183,255,0.25)',
            marginBottom: 8,
          }}
        />
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, minmax(0,1fr))',
          gap: 4,
          border: '1px solid rgba(116,183,255,0.2)',
          borderRadius: 12,
          padding: 6,
        }}
      >
        {Array.from({ length: 64 }).map((_, index) => {
          const isFilled = index < filled
          return (
            <div
              key={index}
              style={{
                aspectRatio: '1 / 1',
                borderRadius: 4,
                background: isFilled
                  ? 'linear-gradient(135deg, rgba(38,230,255,0.85), rgba(255,189,89,0.72))'
                  : 'rgba(255,255,255,0.08)',
                transition: 'background 140ms linear',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}