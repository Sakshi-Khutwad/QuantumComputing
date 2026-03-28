import { motion } from 'framer-motion'
import { Minus, Plus, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'

interface ResultImageModalProps {
  label: string
  src: string
  onClose: () => void
}

export function ResultImageModal({ label, src, onClose }: ResultImageModalProps) {
  const [zoom, setZoom] = useState(1)

  const zoomIn = () => setZoom((value) => Math.min(4, Number((value + 0.2).toFixed(2))))
  const zoomOut = () => setZoom((value) => Math.max(1, Number((value - 0.2).toFixed(2))))
  const resetZoom = () => setZoom(1)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(2, 8, 18, 0.88)',
        backdropFilter: 'blur(8px)',
        display: 'grid',
        placeItems: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.22 }}
        style={{
          width: 'min(92vw, 980px)',
          borderRadius: 14,
          border: '1px solid rgba(116,183,255,0.35)',
          background: 'rgba(8, 21, 40, 0.95)',
          overflow: 'hidden',
          boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.8rem',
            borderBottom: '1px solid rgba(116,183,255,0.28)',
          }}
        >
          <strong>{label} Output Preview</strong>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button className="btn-ghost" onClick={zoomOut} style={{ padding: '0.3rem 0.45rem' }}>
              <Minus size={14} />
            </button>
            <span className="pill" style={{ minWidth: 70, textAlign: 'center' }}>
              {Math.round(zoom * 100)}%
            </span>
            <button className="btn-ghost" onClick={zoomIn} style={{ padding: '0.3rem 0.45rem' }}>
              <Plus size={14} />
            </button>
            <button className="btn-ghost" onClick={resetZoom} style={{ padding: '0.3rem 0.45rem' }}>
              <RotateCcw size={14} />
            </button>
            <button className="btn-ghost" onClick={onClose} style={{ padding: '0.35rem 0.55rem' }}>
              <X size={14} />
            </button>
          </div>
        </div>
        <div style={{ maxHeight: '80vh', overflow: 'auto' }}>
          <div
            onWheel={(event) => {
              event.preventDefault()
              if (event.deltaY < 0) {
                zoomIn()
              } else {
                zoomOut()
              }
            }}
            style={{
              minHeight: '50vh',
              display: 'grid',
              placeItems: 'center',
              padding: '1rem',
              background:
                'radial-gradient(circle at 50% 0%, rgba(38,230,255,0.08), rgba(4,12,24,0.95) 55%), repeating-linear-gradient(45deg, rgba(160,205,255,0.04) 0 6px, rgba(0,0,0,0) 6px 12px)',
            }}
          >
            <img
              src={src}
              alt={`${label} enlarged output`}
              style={{
                width: 'auto',
                maxWidth: '100%',
                maxHeight: '74vh',
                height: 'auto',
                transform: `scale(${zoom})`,
                transformOrigin: 'center center',
                transition: 'transform 120ms ease',
                borderRadius: 10,
                border: '1px solid rgba(116,183,255,0.45)',
                boxShadow: '0 20px 42px rgba(0,0,0,0.45)',
                imageRendering: 'auto',
              }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
