import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { usePipelineStore } from '../../store/usePipelineStore'

export function MSEBarChart() {
  const mseResults = usePipelineStore((state) => state.mseResults)

  if (!mseResults.length) {
    return (
      <div
        style={{
          minHeight: 220,
          border: '1px dashed rgba(116,183,255,0.35)',
          borderRadius: 12,
          display: 'grid',
          placeItems: 'center',
          color: 'var(--text-300)',
        }}
      >
        Waiting for results...
      </div>
    )
  }

  return (
    <div style={{ minHeight: 220 }}>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={mseResults} margin={{ left: 0, right: 8, top: 6, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.12)" />
          <XAxis dataKey="label" tick={{ fill: '#b9d6f7', fontSize: 11 }} interval={0} angle={-12} height={50} />
          <YAxis tick={{ fill: '#b9d6f7', fontSize: 11 }} domain={[0, 'dataMax + 0.01']} />
          <Tooltip
            formatter={(value) => [Number(value ?? 0).toFixed(6), 'MSE']}
            contentStyle={{
              background: 'rgba(9, 24, 42, 0.95)',
              border: '1px solid rgba(116,183,255,0.3)',
              borderRadius: 8,
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {mseResults.map((entry) => (
              <Cell key={entry.key} fill={entry.family === 'quantum' ? '#26e6ff' : '#ffbd59'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}