import { create } from 'zustand'
import { getJob, startProcess, toDataUrl, uploadImage } from '../api/client'
import type {
  ClassicalAlgorithm,
  MseResult,
  PipelineJobStatus,
  PreviewMap,
  QuantumAlgorithm,
  QubitFrame,
  TileInfo,
  TimelineEvent,
} from '../types/pipeline'

interface PipelineState {
  running: boolean
  status: PipelineJobStatus
  errorMessage: string | null
  reduceMotion: boolean
  progressQuantum: number
  progressClassical: number
  selectedQuantumAlgorithm: QuantumAlgorithm
  selectedClassicalAlgorithms: ClassicalAlgorithm[]
  timelineEvents: TimelineEvent[]
  mseResults: MseResult[]
  selectedTile: TileInfo | null
  qubitFrame: QubitFrame
  optimizationTrace: number[]
  previews: PreviewMap
  imageId: string | null
  selectedFile: File | null
  targetSize: number
  tileSize: number
  processingStartedAt: number | null
  setReduceMotion: (reduce: boolean) => void
  setSelectedTile: (tile: TileInfo | null) => void
  setSelectedQuantumAlgorithm: (value: QuantumAlgorithm) => void
  setSelectedFile: (file: File | null) => void
  setTargetSize: (size: number) => void
  uploadSelectedImage: () => Promise<void>
  startPreprocessing: () => Promise<void>
}

let pollTimer: ReturnType<typeof setInterval> | null = null

const emptyPreviews: PreviewMap = {
  input: null,
  qft: null,
  grover: null,
  vqe: null,
  fft: null,
  sobel: null,
  gaussian: null,
}

const stopPolling = () => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
}

export const usePipelineStore = create<PipelineState>((set, get) => ({
  running: false,
  status: 'idle',
  errorMessage: null,
  reduceMotion: false,
  progressQuantum: 0,
  progressClassical: 0,
  selectedQuantumAlgorithm: 'VQE',
  selectedClassicalAlgorithms: ['FFT', 'SOBEL', 'GAUSSIAN'],
  timelineEvents: [],
  mseResults: [],
  selectedTile: null,
  qubitFrame: { q0: 0.5, q1: 0.5, q2: 0.5, q3: 0.5 },
  optimizationTrace: [],
  previews: emptyPreviews,
  imageId: null,
  selectedFile: null,
  targetSize: 128,
  tileSize: 4,
  processingStartedAt: null,

  setReduceMotion: (reduce) => set({ reduceMotion: reduce }),

  setSelectedTile: (tile) => set({ selectedTile: tile }),

  setSelectedQuantumAlgorithm: (value) => set({ selectedQuantumAlgorithm: value }),

  setSelectedFile: (file) => set({ selectedFile: file, errorMessage: null }),

  setTargetSize: (size) => set({ targetSize: size }),

  uploadSelectedImage: async () => {
    const { selectedFile } = get()
    if (!selectedFile) {
      set({ errorMessage: 'Please choose an image file first.' })
      return
    }

    set({ status: 'queued', errorMessage: null })
    try {
      const response = await uploadImage(selectedFile)
      set({
        imageId: response.image_id,
        selectedTile: response.initial_tile,
        previews: {
          ...emptyPreviews,
          input: toDataUrl(response.preview_base64),
        },
        timelineEvents: [{ id: 'shared-upload', label: 'Image uploaded', side: 'shared', progressMark: 0 }],
        status: 'idle',
      })
    } catch (error) {
      set({
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Failed to upload image',
      })
    }
  },

  startPreprocessing: async () => {
    stopPolling()
    const snapshot = get()
    if (!snapshot.imageId) {
      await snapshot.uploadSelectedImage()
    }

    const stateAfterUpload = get()
    if (!stateAfterUpload.imageId) {
      return
    }

    set({
      running: true,
      status: 'running',
      errorMessage: null,
      progressQuantum: 0,
      progressClassical: 0,
      mseResults: [],
      optimizationTrace: [],
      processingStartedAt: Date.now(),
    })

    try {
      const start = await startProcess(stateAfterUpload.imageId, stateAfterUpload.tileSize, stateAfterUpload.targetSize)

      const poll = async () => {
        try {
          const job = await getJob(start.job_id)
          set({
            status: job.status,
            running: job.status === 'queued' || job.status === 'running',
            progressQuantum: job.progress_quantum,
            progressClassical: job.progress_classical,
            qubitFrame: job.qubit_frame,
            timelineEvents: job.timeline_events.map((event) => ({
              id: event.id,
              label: event.label,
              side: event.side,
              progressMark: event.progress_mark,
            })),
            mseResults: job.mse_results,
            selectedTile: job.selected_tile,
            optimizationTrace: job.optimization_trace,
            previews: {
              input: get().previews.input,
              qft: toDataUrl(job.quantum_qft_preview_base64),
              grover: toDataUrl(job.quantum_grover_preview_base64),
              vqe: toDataUrl(job.quantum_vqe_preview_base64),
              fft: toDataUrl(job.fft_preview_base64),
              sobel: toDataUrl(job.sobel_preview_base64),
              gaussian: toDataUrl(job.gaussian_preview_base64),
            },
            errorMessage: job.error,
          })

          if (job.status === 'completed' || job.status === 'failed') {
            stopPolling()
          }
        } catch (error) {
          set({
            running: false,
            status: 'failed',
            errorMessage: error instanceof Error ? error.message : 'Failed to poll processing job',
          })
          stopPolling()
        }
      }

      await poll()
      pollTimer = setInterval(poll, 900)
    } catch (error) {
      set({
        running: false,
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Failed to start processing',
      })
      stopPolling()
    }
  },
}))