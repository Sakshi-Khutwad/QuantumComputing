import { useMemo, useState } from 'react'
import { usePipelineStore } from '../../store/usePipelineStore'
import { GlassPanel } from '../shared/GlassPanel.tsx'
import { SectionTitle } from '../shared/SectionTitle.tsx'
import { AlgorithmResultCards } from './AlgorithmResultCards.tsx'
import { MSEBarChart } from './MSEBarChart.tsx'
import { ResultImageModal } from './ResultImageModal.tsx'

interface PreviewState {
  label: string
  src: string
}

export function ComparisonDock() {
  const mseResults = usePipelineStore((state) => state.mseResults)
  const [preview, setPreview] = useState<PreviewState | null>(null)

  const best = useMemo(() => {
    if (!mseResults.length) return null
    return [...mseResults].sort((a, b) => a.value - b.value)[0]
  }, [mseResults])

  return (
    <GlassPanel>
      <SectionTitle
        title="Performance Dock"
        tag="Lower MSE is better"
        right={
          best ? (
            <span className="pill" style={{ borderColor: 'rgba(57,217,138,0.7)' }}>
              Best: {best.label} ({best.value.toFixed(5)})
            </span>
          ) : (
            <span className="pill">Run pipeline to populate results</span>
          )
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '0.9rem' }}>
        <MSEBarChart />
        <AlgorithmResultCards onOpenPreview={(label: string, src: string) => setPreview({ label, src })} />
      </div>

      {preview && (
        <ResultImageModal
          label={preview.label}
          src={preview.src}
          onClose={() => setPreview(null)}
        />
      )}
    </GlassPanel>
  )
}