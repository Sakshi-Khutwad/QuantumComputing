import { motion } from 'framer-motion'
import { Atom, Play, Sparkles } from 'lucide-react'
import { usePipelineStore } from '../store/usePipelineStore'
import type { QuantumAlgorithm } from '../types/pipeline'

const quantumOptions: QuantumAlgorithm[] = ['QFT', 'GROVER', 'VQE']
const resizeOptions = [64, 128, 256, 512]

export function HeaderBar() {
  const running = usePipelineStore((state) => state.running)
  const status = usePipelineStore((state) => state.status)
  const errorMessage = usePipelineStore((state) => state.errorMessage)
  const reduceMotion = usePipelineStore((state) => state.reduceMotion)
  const imageId = usePipelineStore((state) => state.imageId)
  const targetSize = usePipelineStore((state) => state.targetSize)
  const selectedQuantumAlgorithm = usePipelineStore(
    (state) => state.selectedQuantumAlgorithm,
  )
  const setSelectedQuantumAlgorithm = usePipelineStore(
    (state) => state.setSelectedQuantumAlgorithm,
  )
  const setReduceMotion = usePipelineStore((state) => state.setReduceMotion)
  const setSelectedFile = usePipelineStore((state) => state.setSelectedFile)
  const setTargetSize = usePipelineStore((state) => state.setTargetSize)
  const uploadSelectedImage = usePipelineStore((state) => state.uploadSelectedImage)
  const startPreprocessing = usePipelineStore((state) => state.startPreprocessing)

  return (
    <motion.header
      className="glass-panel"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ padding: '0.85rem 1rem', display: 'grid', gap: '0.7rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <Atom size={20} color="#26e6ff" />
          <strong style={{ letterSpacing: '0.04em' }}>Quantum Vision Console</strong>
          <span className="pill">Interactive Preprocessing Lab</span>
        </div>
        <button className="btn-primary" onClick={() => void startPreprocessing()} disabled={running}>
          <Play size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {running ? 'Processing...' : 'Run Pipeline'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="file"
          accept="image/*"
          className="btn-ghost"
          style={{ padding: '0.46rem 0.55rem', maxWidth: 260 }}
          onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
        />
        <span className="section-tag">Resize</span>
        <div
          style={{
            display: 'inline-flex',
            gap: 4,
            padding: 4,
            borderRadius: 12,
            border: '1px solid rgba(116,183,255,0.35)',
            background: 'rgba(3, 20, 40, 0.65)',
          }}
        >
          {resizeOptions.map((size) => (
            <button
              key={size}
              className="btn-ghost"
              style={{
                padding: '0.36rem 0.56rem',
                borderColor: targetSize === size ? 'rgba(38,230,255,0.65)' : 'transparent',
                background:
                  targetSize === size
                    ? 'linear-gradient(120deg, rgba(38,230,255,0.25), rgba(255,189,89,0.2))'
                    : 'transparent',
                fontWeight: targetSize === size ? 700 : 500,
              }}
              onClick={() => setTargetSize(size)}
            >
              {size} x {size}
            </button>
          ))}
        </div>
        <button className="btn-ghost" onClick={() => void uploadSelectedImage()} disabled={running}>
          Upload Image
        </button>
        <span className="pill" style={{ borderColor: imageId ? 'rgba(57,217,138,0.7)' : undefined }}>
          {imageId ? 'Image ready' : 'No image uploaded'}
        </span>
        <span className="section-tag">Status: {status}</span>
      </div>

      <div style={{ display: 'flex', gap: '0.7rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span className="section-tag">Quantum mode</span>
        {quantumOptions.map((option) => (
          <button
            key={option}
            className="btn-ghost"
            style={{
              borderColor: option === selectedQuantumAlgorithm ? 'rgba(38,230,255,0.65)' : undefined,
              background:
                option === selectedQuantumAlgorithm
                  ? 'linear-gradient(120deg, rgba(38,230,255,0.18), rgba(255,189,89,0.15))'
                  : undefined,
            }}
            onClick={() => setSelectedQuantumAlgorithm(option)}
          >
            {option}
          </button>
        ))}
        <button className="btn-ghost" onClick={() => setReduceMotion(!reduceMotion)}>
          <Sparkles size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {reduceMotion ? 'Motion: Reduced' : 'Motion: Full'}
        </button>
      </div>

      {errorMessage && (
        <div
          style={{
            border: '1px solid rgba(255,92,124,0.55)',
            background: 'rgba(255,92,124,0.08)',
            borderRadius: 10,
            padding: '0.45rem 0.65rem',
            fontSize: '0.82rem',
          }}
        >
          {errorMessage}
        </div>
      )}
    </motion.header>
  )
}