import type { ReactNode } from 'react'

interface SectionTitleProps {
  title: string
  tag?: string
  right?: ReactNode
}

export function SectionTitle({ title, tag, right }: SectionTitleProps) {
  return (
    <div className="section-title">
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <h3>{title}</h3>
        {tag && <span className="section-tag">{tag}</span>}
      </div>
      {right}
    </div>
  )
}