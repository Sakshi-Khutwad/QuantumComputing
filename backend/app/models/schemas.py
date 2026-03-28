from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


class TileInfo(BaseModel):
    row: int
    col: int
    values: list[int]


class UploadResponse(BaseModel):
    image_id: str
    width: int
    height: int
    preview_base64: str
    initial_tile: TileInfo


class ProcessRequest(BaseModel):
    image_id: str
    tile_size: int = 4
    target_size: int = 128


class MseResult(BaseModel):
    key: str
    label: str
    value: float
    family: Literal["quantum", "classical"]


class QubitFrame(BaseModel):
    q0: float
    q1: float
    q2: float
    q3: float


class TimelineEvent(BaseModel):
    id: str
    label: str
    side: Literal["quantum", "classical", "shared"]
    progress_mark: int


class JobStatusResponse(BaseModel):
    job_id: str
    status: Literal["queued", "running", "completed", "failed"]
    progress_quantum: float
    progress_classical: float
    qubit_frame: QubitFrame
    timeline_events: list[TimelineEvent]
    mse_results: list[MseResult]
    selected_tile: TileInfo | None
    fft_preview_base64: str | None
    sobel_preview_base64: str | None
    gaussian_preview_base64: str | None
    quantum_qft_preview_base64: str | None
    quantum_grover_preview_base64: str | None
    quantum_vqe_preview_base64: str | None
    optimization_trace: list[float]
    error: str | None = None


class StartJobResponse(BaseModel):
    job_id: str
