import { motion } from 'framer-motion'
import { usePipelineStore } from '../../store/usePipelineStore'

export function TileInspectorDrawer() {
  const selectedTile = usePipelineStore((state) => state.selectedTile)
  const setSelectedTile = usePipelineStore((state) => state.setSelectedTile)

  if (!selectedTile) return null

  const norm = Math.sqrt(selectedTile.values.reduce((sum, value) => sum + value * value, 0)) || 1

  return (
    <motion.aside
      initial={{ x: 380, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 380, opacity: 0 }}
      style={{
        position: 'fixed',
        right: 16,
        top: 16,
        width: Math.min(360, window.innerWidth - 24),
        maxHeight: '92vh',
        overflow: 'auto',
        zIndex: 20,
        borderRadius: 14,
        border: '1px solid rgba(116,183,255,0.4)',
        background: 'rgba(5,20,40,0.92)',
        backdropFilter: 'blur(8px)',
        padding: '0.85rem',
      }}
    >
      <div className="section-title">
        <h3>Tile Inspector</h3>
        <button className="btn-ghost" onClick={() => setSelectedTile(null)}>
          Close
        </button>
      </div>

      <p className="section-tag" style={{ margin: 0 }}>
        Tile position: row {selectedTile.row}, col {selectedTile.col}
      </p>

      <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
        {selectedTile.values.map((value, idx) => (
          <div
            key={idx}
            style={{
              borderRadius: 6,
              height: 34,
              display: 'grid',
              placeItems: 'center',
              background: `rgba(38,230,255,${Math.max(0.08, value / 320)})`,
              fontSize: 11,
            }}
          >
            {value}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10 }} className="section-tag">
        Encoded amplitudes (first 8)
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginTop: 6 }}>
        {selectedTile.values.slice(0, 8).map((value, idx) => (
          <div key={idx} className="pill" style={{ textAlign: 'center' }}>
            {(value / norm).toFixed(3)}
          </div>
        ))}
      </div>
    </motion.aside>
  )
}