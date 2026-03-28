import { useEffect, useMemo, useState } from 'react'
import { usePipelineStore } from '../../store/usePipelineStore'

function getStage(progress: number): string {
  if (progress < 15) return 'Tile extraction'
  if (progress < 32) return 'Amplitude encoding'
  if (progress < 47) return 'QFT transform'
  if (progress < 65) return 'Grover oracle + diffusion'
  if (progress < 84) return 'VQE optimization'
  if (progress < 100) return 'Tile reconstruction'
  return 'Completed'
}

function toEta(progress: number, elapsedMs: number): string {
  if (progress <= 1) return '--'
  const totalEstimate = elapsedMs / (progress / 100)
  const remainingMs = Math.max(0, totalEstimate - elapsedMs)
  const seconds = Math.round(remainingMs / 1000)
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const rem = seconds % 60
  return `${minutes}m ${rem}s`
}

export function QuantumRuntimeHud() {
  const running = usePipelineStore((state) => state.running)
  const progressQuantum = usePipelineStore((state) => state.progressQuantum)
  const progressClassical = usePipelineStore((state) => state.progressClassical)
  const selectedQuantumAlgorithm = usePipelineStore((state) => state.selectedQuantumAlgorithm)
  const selectedTile = usePipelineStore((state) => state.selectedTile)
  const tileSize = usePipelineStore((state) => state.tileSize)
  const targetSize = usePipelineStore((state) => state.targetSize)
  const processingStartedAt = usePipelineStore((state) => state.processingStartedAt)

  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const liveProgress = Math.round((progressQuantum + progressClassical) / 2)
  const currentStage = getStage(progressQuantum)

  const tileIndex = useMemo(() => {
    if (!selectedTile) return '--'
    const cols = Math.max(1, Math.floor(targetSize / tileSize))
    const rowIdx = Math.floor(selectedTile.row / tileSize)
    const colIdx = Math.floor(selectedTile.col / tileSize)
    return rowIdx * cols + colIdx + 1
  }, [selectedTile, targetSize, tileSize])

  const eta = useMemo(() => {
    if (!running || !processingStartedAt) return '--'
    return toEta(liveProgress, now - processingStartedAt)
  }, [running, processingStartedAt, liveProgress, now])

  return (
    <div
      style={{
        border: '1px solid rgba(116,183,255,0.28)',
        borderRadius: 12,
        padding: '0.65rem 0.75rem',
        background: 'linear-gradient(120deg, rgba(38,230,255,0.08), rgba(255,189,89,0.06))',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        gap: 8,
      }}
    >
      <div>
        <div className="section-tag">Current stage</div>
        <strong style={{ fontSize: '0.9rem' }}>{currentStage}</strong>
      </div>
      <div>
        <div className="section-tag">Current tile index</div>
        <strong style={{ fontSize: '0.9rem' }}>{tileIndex}</strong>
      </div>
      <div>
        <div className="section-tag">Active algorithm</div>
        <strong style={{ fontSize: '0.9rem' }}>{selectedQuantumAlgorithm}</strong>
      </div>
      <div>
        <div className="section-tag">Live progress</div>
        <strong style={{ fontSize: '0.9rem' }}>{liveProgress}%</strong>
      </div>
      <div>
        <div className="section-tag">ETA</div>
        <strong style={{ fontSize: '0.9rem' }}>{eta}</strong>
      </div>
    </div>
  )
}
