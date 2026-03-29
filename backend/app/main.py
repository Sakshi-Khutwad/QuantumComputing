from __future__ import annotations

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from app.models.schemas import JobStatusResponse, ProcessRequest, StartJobResponse, UploadResponse
from app.services.pipeline import pipeline_service

app = FastAPI(title="Quantum Vision Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the images directory for serving static files
images_dir = Path(__file__).parent.parent / "images"
images_dir.mkdir(parents=True, exist_ok=True)
app.mount("/images", StaticFiles(directory=str(images_dir)), name="images")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/upload", response_model=UploadResponse)
async def upload_image(file: UploadFile = File(...)) -> UploadResponse:
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image uploads are supported")

    file_bytes = await file.read()
    image_id, preview, initial_tile, width, height = pipeline_service.upload_image(file_bytes)
    return UploadResponse(
        image_id=image_id,
        width=width,
        height=height,
        preview_base64=preview,
        initial_tile=initial_tile,
    )


@app.post("/api/process", response_model=StartJobResponse)
def start_processing(request: ProcessRequest) -> StartJobResponse:
    job_id = pipeline_service.create_job(request.image_id, request.tile_size, request.target_size)
    return StartJobResponse(job_id=job_id)


@app.get("/api/jobs/{job_id}", response_model=JobStatusResponse)
def get_job(job_id: str) -> JobStatusResponse:
    state = pipeline_service.get_job(job_id)
    if not state:
        raise HTTPException(status_code=404, detail="Job not found")

    return JobStatusResponse(
        job_id=state.job_id,
        status=state.status,  # type: ignore[arg-type]
        progress_quantum=state.progress_quantum,
        progress_classical=state.progress_classical,
        qubit_frame=state.qubit_frame,
        timeline_events=state.timeline_events,
        mse_results=state.mse_results,
        selected_tile=state.selected_tile,
        fft_preview_url=state.fft_preview_url,
        sobel_preview_url=state.sobel_preview_url,
        gaussian_preview_url=state.gaussian_preview_url,
        quantum_qft_preview_url=state.quantum_qft_preview_url,
        quantum_grover_preview_url=state.quantum_grover_preview_url,
        quantum_vqe_preview_url=state.quantum_vqe_preview_url,
        optimization_trace=state.optimization_trace,
        error=state.error,
    )
