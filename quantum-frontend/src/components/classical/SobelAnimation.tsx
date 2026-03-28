import { motion } from 'framer-motion'
import { usePipelineStore } from '../../store/usePipelineStore'

export function SobelAnimation() {
  const sobelPreview = usePipelineStore((state) => state.previews.sobel)

  return (
    <div style={{ border: '1px solid rgba(255,189,89,0.4)', borderRadius: 12, padding: '1rem' }}>
      <div className="section-title" style={{ marginBottom: '0.65rem' }}>
        <h3 style={{ fontSize: '0.98rem' }}>Sobel Edge Sweep</h3>
        <span className="section-tag">Gradient detection</span>
      </div>
      <div style={{ position: 'relative', height: 184, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
        {sobelPreview && (
          <img
            src={sobelPreview}
            alt="Sobel preview"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
        )}
        <motion.div
          animate={{ x: ['-10%', '115%'] }}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 26,
            background: 'linear-gradient(90deg, rgba(255,189,89,0), rgba(255,189,89,0.75), rgba(255,189,89,0))',
          }}
        />
      </div>
    </div>
  )
}