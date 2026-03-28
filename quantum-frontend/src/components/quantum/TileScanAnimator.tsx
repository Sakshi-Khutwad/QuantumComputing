import { motion } from 'framer-motion'
import { usePipelineStore } from '../../store/usePipelineStore'

export function TileScanAnimator() {
  const progressQuantum = usePipelineStore((state) => state.progressQuantum)
  const selectedTile = usePipelineStore((state) => state.selectedTile)
  const previewInput = usePipelineStore((state) => state.previews.input)
  const tileSize = usePipelineStore((state) => state.tileSize)
  const targetSize = usePipelineStore((state) => state.targetSize)

  const tilePercent = (tileSize / targetSize) * 100
  const tileLeft = selectedTile ? (selectedTile.col / targetSize) * 100 : 0
  const tileTop = selectedTile ? (selectedTile.row / targetSize) * 100 : 0

  return (
    <div style={{ display: 'grid', gap: '0.45rem' }}>
      <div className="section-title" style={{ marginBottom: 0 }}>
        <h3 style={{ fontSize: '0.88rem' }}>Preprocessing: Tile Extraction</h3>
        <span className="section-tag">Tile size {tileSize}x{tileSize}</span>
      </div>

      <div
        style={{
          position: 'relative',
          minHeight: 132,
          borderRadius: 14,
          border: '1px solid rgba(116,183,255,0.25)',
          background: previewInput
            ? `linear-gradient(140deg, rgba(38,230,255,0.08), rgba(255,189,89,0.08)), url(${previewInput})`
            : 'linear-gradient(140deg, rgba(38,230,255,0.08), rgba(255,189,89,0.08)), repeating-linear-gradient(90deg, rgba(140,200,255,0.12) 0px, rgba(140,200,255,0.12) 1px, transparent 1px, transparent 25px), repeating-linear-gradient(180deg, rgba(140,200,255,0.12) 0px, rgba(140,200,255,0.12) 1px, transparent 1px, transparent 25px)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'repeating-linear-gradient(90deg, rgba(140,200,255,0.16) 0px, rgba(140,200,255,0.16) 1px, transparent 1px, transparent 16px), repeating-linear-gradient(180deg, rgba(140,200,255,0.16) 0px, rgba(140,200,255,0.16) 1px, transparent 1px, transparent 16px)',
            pointerEvents: 'none',
          }}
        />
        {selectedTile && (
          <motion.div
            animate={{ left: `${tileLeft}%`, top: `${tileTop}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: `${tilePercent}%`,
              height: `${tilePercent}%`,
              border: '2px solid rgba(255,189,89,0.95)',
              boxShadow: '0 0 14px rgba(255,189,89,0.6)',
            }}
          />
        )}
        <motion.div
          animate={{ left: `${Math.min(100, progressQuantum)}%` }}
          transition={{ duration: 0.18, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 18,
            left: 0,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, rgba(38,230,255,0), rgba(38,230,255,0.85), rgba(38,230,255,0))',
            boxShadow: '0 0 24px rgba(38,230,255,0.8)',
          }}
        />
      </div>
    </div>
  )
}