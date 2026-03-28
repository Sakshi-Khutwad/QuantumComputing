export type QuantumAlgorithm = 'QFT' | 'GROVER' | 'VQE'
export type ClassicalAlgorithm = 'FFT' | 'SOBEL' | 'GAUSSIAN'

export interface MseResult {
  key: string
  label: string
  value: number
  family: 'quantum' | 'classical'
}

export interface TimelineEvent {
  id: string
  label: string
  side: 'quantum' | 'classical' | 'shared'
  progressMark: number
}

export interface TileInfo {
  row: number
  col: number
  values: number[]
}

export interface QubitFrame {
  q0: number
  q1: number
  q2: number
  q3: number
}

export interface PreviewMap {
  input: string | null
  qft: string | null
  grover: string | null
  vqe: string | null
  fft: string | null
  sobel: string | null
  gaussian: string | null
}

export type PipelineJobStatus = 'idle' | 'queued' | 'running' | 'completed' | 'failed'