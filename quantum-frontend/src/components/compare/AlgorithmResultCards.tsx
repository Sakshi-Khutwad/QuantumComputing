import { usePipelineStore } from '../../store/usePipelineStore'

interface AlgorithmResultCardsProps {
  onOpenPreview: (label: string, src: string) => void
}

export function AlgorithmResultCards({ onOpenPreview }: AlgorithmResultCardsProps) {
  const mseResults = usePipelineStore((state) => state.mseResults)
  const previews = usePipelineStore((state) => state.previews)

  const previewByKey: Record<string, string | null> = {
    qft: previews.qft,
    grover: previews.grover,
    vqe: previews.vqe,
    fft: previews.fft,
    sobel: previews.sobel,
    gaussian: previews.gaussian,
  }

  if (!mseResults.length) {
    return (
      <div
        style={{
          minHeight: 220,
          border: '1px dashed rgba(116,183,255,0.35)',
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          color: 'var(--text-300)',
        }}
      >
        Classical and quantum cards appear here
      </div>
    )
  }

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      {mseResults.map((item) => (
        <div
          key={item.key}
          style={{
            border: '1px solid rgba(116,183,255,0.35)',
            borderRadius: 12,
            padding: '0.65rem 0.75rem',
            display: 'grid',
            gridTemplateColumns: '96px 1fr auto',
            gap: 12,
            alignItems: 'center',
            background:
              item.family === 'quantum'
                ? 'linear-gradient(120deg, rgba(38,230,255,0.13), rgba(38,230,255,0.04))'
                : 'linear-gradient(120deg, rgba(255,189,89,0.16), rgba(255,189,89,0.05))',
            boxShadow: '0 10px 24px rgba(3, 10, 24, 0.32)',
          }}
        >
          <button
            type="button"
            style={{
              width: 96,
              height: 72,
              borderRadius: 10,
              border: '1px solid rgba(116,183,255,0.45)',
              overflow: 'hidden',
              background: 'linear-gradient(160deg, rgba(12,33,58,0.9), rgba(7,20,38,0.9))',
              padding: 0,
              cursor: previewByKey[item.key] ? 'zoom-in' : 'default',
              position: 'relative',
            }}
            disabled={!previewByKey[item.key]}
            onClick={() => {
              const src = previewByKey[item.key]
              if (src) onOpenPreview(item.label, src)
            }}
          >
            {previewByKey[item.key] && (
              <img
                src={previewByKey[item.key] ?? undefined}
                alt={`${item.label} preview`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
            {previewByKey[item.key] && (
              <span
                className="section-tag"
                style={{
                  position: 'absolute',
                  right: 4,
                  bottom: 4,
                  padding: '0.1rem 0.3rem',
                  borderRadius: 999,
                  background: 'rgba(5, 14, 30, 0.7)',
                  color: '#d8e8ff',
                }}
              >
                open
              </span>
            )}
          </button>
          <div style={{ display: 'grid', gap: 2 }}>
            <span style={{ fontWeight: 700 }}>{item.label}</span>
            <span className="section-tag">{item.family}</span>
          </div>
          <strong style={{ fontSize: '1rem' }}>{item.value.toFixed(6)}</strong>
        </div>
      ))}
    </div>
  )
}