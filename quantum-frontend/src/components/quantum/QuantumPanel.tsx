import { Cpu } from 'lucide-react'
import { usePipelineStore } from '../../store/usePipelineStore'
import { GlassPanel } from '../shared/GlassPanel.tsx'
import { ProgressRing } from '../shared/ProgressRing.tsx'
import { SectionTitle } from '../shared/SectionTitle.tsx'
import { AmplitudeEncodingBars } from './AmplitudeEncodingBars.tsx'
import { GateCircuitCanvas } from './GateCircuitCanvas.tsx'
import { LiveCircuitTheater } from './LiveCircuitTheater.tsx'
import { QuantumPipelineTrack } from './QuantumPipelineTrack.tsx'
import { QuantumRuntimeHud } from './QuantumRuntimeHud.tsx'
import { QuantumTileReconstruction } from './QuantumTileReconstruction.tsx'
import { QubitStateViewer } from './QubitStateViewer.tsx'
import { TileScanAnimator } from './TileScanAnimator.tsx'

export function QuantumPanel() {
  const progressQuantum = usePipelineStore((state) => state.progressQuantum)

  return (
    <GlassPanel>
      <SectionTitle
        title="Quantum Algorithms"
        tag="QFT · Grover · VQE"
        right={<ProgressRing progress={progressQuantum} label="Quantum" color="#26e6ff" />}
      />

      <div style={{ display: 'grid', gap: '0.8rem' }}>
        <QuantumRuntimeHud />
        <QuantumPipelineTrack />
        <TileScanAnimator />
        <AmplitudeEncodingBars />
        <GateCircuitCanvas />
        <QubitStateViewer />
        <QuantumTileReconstruction />
        <LiveCircuitTheater />
      </div>

      <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
        <Cpu size={15} color="#26e6ff" />
        <span className="section-tag">Live gate pass + qubit state updates</span>
      </div>
    </GlassPanel>
  )
}