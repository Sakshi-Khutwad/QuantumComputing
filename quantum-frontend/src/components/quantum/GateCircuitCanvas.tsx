import { motion } from 'framer-motion'
import { usePipelineStore } from '../../store/usePipelineStore'

interface GateDef {
  key: string
  left: number
  mark: number
  color: string
  wires: number[]
  depth: number
  link?: [number, number]
  swap?: [number, number]
}

interface PositionedLabel {
  left: number
  top: number
}

const gates = [
  { key: 'H', left: 12, mark: 34, color: '#26e6ff', wires: [0], depth: 1 },
  { key: 'CP', left: 30, mark: 46, color: '#ff6b86', wires: [0, 1], depth: 2, link: [0, 1] },
  { key: 'SWAP', left: 48, mark: 54, color: '#26e6ff', wires: [2, 3], depth: 2, swap: [2, 3] },
  { key: 'ORACLE', left: 68, mark: 66, color: '#ff6b86', wires: [0, 1, 2, 3], depth: 3 },
  { key: 'DIFF', left: 82, mark: 72, color: '#ffbd59', wires: [0, 1, 2, 3], depth: 3 },
  { key: 'RY(theta)', left: 92, mark: 84, color: '#ffbd59', wires: [0, 1, 2, 3], depth: 4 },
] satisfies GateDef[]

const wireY = [28, 60, 92, 124]

function getVisibleGates(mode: 'QFT' | 'GROVER' | 'VQE'): GateDef[] {
  if (mode === 'QFT') return gates.filter((gate) => ['H', 'CP', 'SWAP'].includes(gate.key))
  if (mode === 'GROVER') return gates.filter((gate) => gate.key !== 'RY(theta)')
  return gates
}

function buildLabelLayout(visibleGates: GateDef[]): Record<string, PositionedLabel> {
  const laneRightMost = [-100, -100, -100]
  const labels: Record<string, PositionedLabel> = {}

  const sorted = [...visibleGates].sort((a, b) => a.left - b.left)
  sorted.forEach((gate) => {
    let lane = laneRightMost.findIndex((right) => gate.left - right >= 16)
    if (lane === -1) {
      lane = laneRightMost.indexOf(Math.min(...laneRightMost))
    }

    laneRightMost[lane] = gate.left
    labels[gate.key] = {
      left: Math.max(9, Math.min(91, gate.left)),
      top: 12 + lane * 34,
    }
  })

  return labels
}

export function GateCircuitCanvas() {
  const progressQuantum = usePipelineStore((state) => state.progressQuantum)
  const selectedQuantumAlgorithm = usePipelineStore((state) => state.selectedQuantumAlgorithm)
  const xRunner = Math.min(100, progressQuantum)

  const visibleGates = getVisibleGates(selectedQuantumAlgorithm)
  const labelByKey = buildLabelLayout(visibleGates)

  const activeGates = visibleGates.filter((gate) => progressQuantum >= gate.mark)
  const activeCount = activeGates.length
  const totalCount = visibleGates.length
  const activeDepth = activeGates.reduce((acc, gate) => acc + gate.depth, 0)
  const totalDepth = visibleGates.reduce((acc, gate) => acc + gate.depth, 0)

  return (
    <div>
      <div className="section-title" style={{ marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '0.88rem' }}>Gate Theater</h3>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <span className="pill">Gates {activeCount}/{totalCount}</span>
          <span className="pill">Depth {activeDepth}/{totalDepth}</span>
          <span className="section-tag">Active mode: {selectedQuantumAlgorithm}</span>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          height: 158,
          borderRadius: 14,
          border: '1px solid rgba(116,183,255,0.25)',
          background: 'linear-gradient(180deg, rgba(38,230,255,0.04), rgba(255,189,89,0.05))',
          overflow: 'hidden',
        }}
      >
        {wireY.map((y, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
              left: 10,
              right: 10,
              top: y,
              height: 1,
              background: 'rgba(173,220,255,0.35)',
            }}
          />
        ))}

        {wireY.map((y, idx) => (
          <motion.div
            key={`runner-${idx}`}
            animate={{ left: `${xRunner}%` }}
            transition={{ duration: 0.25, ease: 'linear' }}
            style={{
              position: 'absolute',
              left: 0,
              top: y - 5,
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'rgba(38,230,255,0.95)',
              boxShadow: '0 0 14px rgba(38,230,255,0.95)',
              transform: 'translateX(-50%)',
              zIndex: 3,
              opacity: idx % 2 === 0 ? 1 : 0.75,
            }}
          />
        ))}

        {visibleGates.map((gate) => {
          const active = progressQuantum >= gate.mark
          const label = labelByKey[gate.key]
          return (
            <div key={gate.key}>
              {gate.wires.map((wire) => (
                <motion.div
                  key={`${gate.key}-${wire}`}
                  animate={{ opacity: active ? [0.25, 1, 0.25] : 0.08 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  style={{
                    position: 'absolute',
                    left: `calc(${gate.left}% - 24px)`,
                    top: wireY[wire] - 2,
                    width: 48,
                    height: 4,
                    borderRadius: 999,
                    background: gate.color,
                    boxShadow: active ? `0 0 10px ${gate.color}` : 'none',
                    zIndex: 2,
                  }}
                />
              ))}

              {gate.link && (
                <motion.div
                  animate={{ opacity: active ? [0.2, 1, 0.2] : 0.1 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
                  style={{
                    position: 'absolute',
                    left: `${gate.left}%`,
                    top: wireY[gate.link[0]],
                    width: 2,
                    height: wireY[gate.link[1]] - wireY[gate.link[0]],
                    background: 'rgba(255,107,134,0.95)',
                    boxShadow: active ? '0 0 12px rgba(255,107,134,0.9)' : 'none',
                    zIndex: 3,
                  }}
                />
              )}

              {gate.swap && (
                <svg
                  width="60"
                  height="44"
                  style={{
                    position: 'absolute',
                    left: `calc(${gate.left}% - 30px)`,
                    top: wireY[gate.swap[0]] - 8,
                    zIndex: 3,
                    pointerEvents: 'none',
                  }}
                >
                  <motion.line
                    x1="12"
                    y1="6"
                    x2="48"
                    y2="38"
                    stroke="rgba(38,230,255,0.95)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{ opacity: active ? [0.2, 1, 0.2] : 0.08 }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                  />
                  <motion.line
                    x1="48"
                    y1="6"
                    x2="12"
                    y2="38"
                    stroke="rgba(38,230,255,0.95)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    animate={{ opacity: active ? [1, 0.2, 1] : 0.08 }}
                    transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
                  />
                </svg>
              )}

              <motion.div
                initial={{ scale: 0.84, opacity: 0 }}
                animate={{
                  scale: active ? [1, 1.08, 1] : 0.92,
                  opacity: active ? 1 : 0.26,
                }}
                transition={{ duration: 1.1, repeat: active ? Number.POSITIVE_INFINITY : 0 }}
                style={{
                  position: 'absolute',
                  top: label.top,
                  left: `${label.left}%`,
                  transform: 'translateX(-50%)',
                  minWidth: 58,
                  textAlign: 'center',
                  padding: '0.22rem 0.4rem',
                  borderRadius: 8,
                  fontSize: '0.69rem',
                  fontWeight: 700,
                  color: '#041124',
                  background: gate.color,
                  boxShadow: active ? `0 0 16px ${gate.color}` : 'none',
                  zIndex: 4,
                }}
              >
                {gate.key}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
