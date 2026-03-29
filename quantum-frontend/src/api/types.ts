import type { MseResult, QubitFrame, TileInfo } from '../types/pipeline'

export interface ApiTimelineEvent {
  id: string
  label: string
  side: 'quantum' | 'classical' | 'shared'
  progress_mark: number
}

export interface UploadResponse {
  image_id: string
  width: number
  height: number
  preview_base64: string
  initial_tile: TileInfo
}

export interface StartJobResponse {
  job_id: string
}

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed'

export interface JobStatusResponse {
  job_id: string
  status: JobStatus
  progress_quantum: number
  progress_classical: number
  qubit_frame: QubitFrame
  timeline_events: ApiTimelineEvent[]
  mse_results: MseResult[]
  selected_tile: TileInfo | null
  fft_preview_url: string | null
  sobel_preview_url: string | null
  gaussian_preview_url: string | null
  quantum_qft_preview_url: string | null
  quantum_grover_preview_url: string | null
  quantum_vqe_preview_url: string | null
  optimization_trace: number[]
  error: string | null
}
