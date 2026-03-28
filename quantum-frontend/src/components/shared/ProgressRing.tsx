interface ProgressRingProps {
  progress: number
  label: string
  color?: string
}

export function ProgressRing({ progress, label, color = '#26e6ff' }: ProgressRingProps) {
  const radius = 28
  const stroke = 5
  const normalizedRadius = radius - stroke * 0.5
  const circumference = normalizedRadius * 2 * Math.PI
  const dashOffset = circumference - (progress / 100) * circumference

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
      <svg height={radius * 2} width={radius * 2}>
        <circle
          stroke="rgba(255,255,255,0.12)"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset: dashOffset, transition: 'stroke-dashoffset 180ms linear' }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="white"
          fontSize="10"
          fontWeight="700"
        >
          {Math.round(progress)}%
        </text>
      </svg>
      <span className="section-tag">{label}</span>
    </div>
  )
}