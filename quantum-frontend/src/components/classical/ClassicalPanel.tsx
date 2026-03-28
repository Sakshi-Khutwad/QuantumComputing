import { usePipelineStore } from '../../store/usePipelineStore'
import { GlassPanel } from '../shared/GlassPanel.tsx'
import { ProgressRing } from '../shared/ProgressRing.tsx'
import { SectionTitle } from '../shared/SectionTitle.tsx'
import { FFTAnimation } from './FFTAnimation.tsx'
import { GaussianAnimation } from './GaussianAnimation.tsx'
import { SobelAnimation } from './SobelAnimation.tsx'

export function ClassicalPanel() {
  const progressClassical = usePipelineStore((state) => state.progressClassical)

  return (
    <GlassPanel>
      <SectionTitle
        title="Classical Algorithms"
        tag="FFT · Sobel · Gaussian"
        right={<ProgressRing progress={progressClassical} label="Classical" color="#ffbd59" />}
      />

      <div style={{ display: 'grid', gap: '1.1rem' }}>
        <FFTAnimation />
        <SobelAnimation />
        <GaussianAnimation />
      </div>
    </GlassPanel>
  )
}