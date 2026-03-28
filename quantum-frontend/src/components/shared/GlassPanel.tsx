import type { CSSProperties, ReactNode } from 'react'

interface GlassPanelProps {
  children: ReactNode
  style?: CSSProperties
}

export function GlassPanel({ children, style }: GlassPanelProps) {
  return (
    <section className="glass-panel" style={{ padding: '0.95rem', ...style }}>
      {children}
    </section>
  )
}