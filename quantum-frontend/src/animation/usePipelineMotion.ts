import { useMemo } from 'react'
import { usePipelineStore } from '../store/usePipelineStore'

export function usePipelineMotion() {
  const reduceMotion = usePipelineStore((state) => state.reduceMotion)

  return useMemo(
    () => ({
      shouldAnimate: !reduceMotion,
      durationScale: reduceMotion ? 0.25 : 1,
    }),
    [reduceMotion],
  )
}
