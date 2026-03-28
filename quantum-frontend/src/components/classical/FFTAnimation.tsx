import { motion } from 'framer-motion'
import { usePipelineStore } from '../../store/usePipelineStore'

export function FFTAnimation() {
  const progressClassical = usePipelineStore((state) => state.progressClassical)
  const fftPreview = usePipelineStore((state) => state.previews.fft)

  return (
    <div style={{ border: '1px solid rgba(255,189,89,0.4)', borderRadius: 12, padding: '1rem' }}>
      <div className="section-title" style={{ marginBottom: '0.65rem' }}>
        <h3 style={{ fontSize: '0.98rem' }}>FFT Spectrum</h3>
        <span className="section-tag">Frequency space</span>
      </div>
      <div style={{ position: 'relative', height: 184, borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
        {fftPreview && (
          <img
            src={fftPreview}
            alt="FFT preview"
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
        )}
        {[0, 1, 2].map((ring) => (
          <motion.div
            key={ring}
            animate={{ scale: [0.6, 1.35], opacity: [0.7, 0] }}
            transition={{ duration: 1.6, repeat: Number.POSITIVE_INFINITY, delay: ring * 0.35 }}
            style={{
              position: 'absolute',
              inset: 0,
              margin: 'auto',
              width: 26,
              height: 26,
              borderRadius: '50%',
              border: '2px solid rgba(255,189,89,0.8)',
            }}
          />
        ))}
        <div style={{ position: 'absolute', bottom: 8, left: 8 }} className="section-tag">
          {Math.round(progressClassical)}% complete
        </div>
      </div>
    </div>
  )
}