import type { ReactNode } from 'react'

interface MainSplitLayoutProps {
  left: ReactNode
  right: ReactNode
  bottomDock: ReactNode
}

export function MainSplitLayout({ left, right, bottomDock }: MainSplitLayoutProps) {
  return (
    <>
      <div className="grid-main">
        {left}
        {right}
      </div>
      <div className="bottom-dock">{bottomDock}</div>
    </>
  )
}