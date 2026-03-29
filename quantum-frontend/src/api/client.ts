import type { JobStatusResponse, StartJobResponse, UploadResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000'

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, init)
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const form = new FormData()
  form.append('file', file)
  return fetchJson<UploadResponse>('/api/upload', {
    method: 'POST',
    body: form,
  })
}

export async function startProcess(imageId: string, tileSize = 4, targetSize = 128): Promise<StartJobResponse> {
  return fetchJson<StartJobResponse>('/api/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_id: imageId, tile_size: tileSize, target_size: targetSize }),
  })
}

export async function getJob(jobId: string): Promise<JobStatusResponse> {
  return fetchJson<JobStatusResponse>(`/api/jobs/${jobId}`)
}

export function toDataUrl(base64Png: string | null): string | null {
  if (!base64Png) return null
  return `data:image/png;base64,${base64Png}`
}

export function getImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return null
  // If it's already a full URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  // Otherwise, prepend the base URL
  return `${BASE_URL}${imageUrl}`
}
