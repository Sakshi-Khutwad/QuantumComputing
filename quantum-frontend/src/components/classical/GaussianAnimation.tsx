import { motion } from 'framer-motion'
import { usePipelineStore } from '../../store/usePipelineStore'

export function GaussianAnimation() {
  const gaussianPreview = usePipelineStore((state) => state.previews.gaussian)

  return (
    <div style={{ border: '1px solid rgba(255,189,89,0.4)', borderRadius: 12, padding: '1rem' }}>
      <div className="section-title" style={{ marginBottom: '0.65rem' }}>
        <h3 style={{ fontSize: '0.98rem' }}>Gaussian Blur Lens</h3>
        <span className="section-tag">Smoothing field</span>
      </div>
      <div style={{ position: 'relative', height: 184, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
        {gaussianPreview && (
          <img
            src={gaussianPreview}
            alt="Gaussian preview"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
        )}
        <motion.div
          animate={{ x: ['-10%', '100%'] }}
          transition={{ duration: 2.3, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: 14,
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,189,89,0.55), rgba(255,189,89,0.08))',
            filter: 'blur(3px)',
          }}
        />
      </div>
    </div>
  )
}