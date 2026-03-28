from __future__ import annotations

import base64
import io
import threading
import time
import uuid
from dataclasses import dataclass, field

import cv2
import numpy as np
from PIL import Image
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
from qiskit.quantum_info import Statevector
from scipy.ndimage import gaussian_filter
from scipy.optimize import minimize

from app.models.schemas import MseResult, QubitFrame, TileInfo, TimelineEvent


@dataclass
class UploadedImage:
    image_id: str
    image: np.ndarray


@dataclass
class JobState:
    job_id: str
    status: str = "queued"
    progress_quantum: float = 0.0
    progress_classical: float = 0.0
    qubit_frame: QubitFrame = field(default_factory=lambda: QubitFrame(q0=0.5, q1=0.5, q2=0.5, q3=0.5))
    timeline_events: list[TimelineEvent] = field(default_factory=list)
    mse_results: list[MseResult] = field(default_factory=list)
    selected_tile: TileInfo | None = None
    fft_preview_base64: str | None = None
    sobel_preview_base64: str | None = None
    gaussian_preview_base64: str | None = None
    quantum_qft_preview_base64: str | None = None
    quantum_grover_preview_base64: str | None = None
    quantum_vqe_preview_base64: str | None = None
    optimization_trace: list[float] = field(default_factory=list)
    error: str | None = None


class PipelineService:
    def __init__(self) -> None:
        self._images: dict[str, UploadedImage] = {}
        self._jobs: dict[str, JobState] = {}
        self._lock = threading.Lock()

    @staticmethod
    def _ensure_gray_and_resize(pil_image: Image.Image, target_size: int = 128) -> np.ndarray:
        image = pil_image.convert("L")
        resized = image.resize((target_size, target_size), Image.Resampling.LANCZOS)
        return np.array(resized, dtype=np.uint8)

    @staticmethod
    def _np_to_base64_png(array: np.ndarray) -> str:
        if array.dtype != np.uint8:
            clipped = np.clip(array, 0, 255).astype(np.uint8)
        else:
            clipped = array
        pil_img = Image.fromarray(clipped)
        with io.BytesIO() as buffer:
            pil_img.save(buffer, format="PNG")
            return base64.b64encode(buffer.getvalue()).decode("ascii")

    @staticmethod
    def _np_to_base64_png_preview(array: np.ndarray, preview_size: tuple[int, int] = (512, 512)) -> str:
        """Convert numpy array to base64 PNG, resized to preview size."""
        if array.dtype != np.uint8:
            clipped = np.clip(array, 0, 255).astype(np.uint8)
        else:
            clipped = array
        pil_img = Image.fromarray(clipped)
        # Resize to preview size
        pil_img = pil_img.resize(preview_size, Image.Resampling.LANCZOS)
        with io.BytesIO() as buffer:
            pil_img.save(buffer, format="PNG")
            return base64.b64encode(buffer.getvalue()).decode("ascii")

    @staticmethod
    def _extract_initial_tile(image: np.ndarray, tile_size: int = 4) -> TileInfo:
        tile = image[0:tile_size, 0:tile_size].flatten().tolist()
        return TileInfo(row=0, col=0, values=[int(v) for v in tile])

    def upload_image(self, file_bytes: bytes, target_size: int = 128) -> tuple[str, str, TileInfo, int, int]:
        image_id = str(uuid.uuid4())
        pil_image = Image.open(io.BytesIO(file_bytes))
        gray = self._ensure_gray_and_resize(pil_image, target_size=target_size)
        preview = self._np_to_base64_png(gray)
        initial_tile = self._extract_initial_tile(gray)

        with self._lock:
            self._images[image_id] = UploadedImage(image_id=image_id, image=gray)

        return image_id, preview, initial_tile, gray.shape[1], gray.shape[0]

    def create_job(self, image_id: str, tile_size: int, target_size: int) -> str:
        job_id = str(uuid.uuid4())
        state = JobState(
            job_id=job_id,
            status="queued",
            timeline_events=[TimelineEvent(id="shared-upload", label="Image uploaded", side="shared", progress_mark=0)],
        )
        with self._lock:
            self._jobs[job_id] = state

        worker = threading.Thread(
            target=self._run_job,
            args=(job_id, image_id, tile_size, target_size),
            daemon=True,
        )
        worker.start()
        return job_id

    def get_job(self, job_id: str) -> JobState | None:
        with self._lock:
            return self._jobs.get(job_id)

    @staticmethod
    def _apply_qft(qc: QuantumCircuit, n: int) -> None:
        for i in range(n):
            qc.h(i)
            for j in range(i + 1, n):
                qc.cp(np.pi / (2 ** (j - i)), j, i)
        for i in range(n // 2):
            qc.swap(i, n - i - 1)

    @staticmethod
    def _normalize_tile(tile_array: np.ndarray, num_qubits: int = 4) -> np.ndarray:
        tile_normalized = tile_array / 255.0
        tile_flat = tile_normalized.flatten()
        norm = np.linalg.norm(tile_flat)
        if norm > 0:
            return tile_flat / norm
        return np.ones(2**num_qubits) / np.sqrt(2**num_qubits)

    def _process_tile_qft(self, tile_array: np.ndarray, num_qubits: int = 4) -> tuple[np.ndarray, QubitFrame]:
        tile_quantum = self._normalize_tile(tile_array, num_qubits)
        qc = QuantumCircuit(num_qubits)
        qc.initialize(tile_quantum, qc.qubits)
        self._apply_qft(qc, num_qubits)

        state = Statevector.from_instruction(qc)
        result = np.abs(state.data)
        if np.max(result) > 0:
            result = result / np.max(result)

        frame = QubitFrame(
            q0=float(np.sum(np.abs(state.data[::2]) ** 2)),
            q1=float(np.sum(np.abs(state.data[1::2]) ** 2)),
            q2=float(np.mean(np.abs(state.data[:8]) ** 2)),
            q3=float(np.mean(np.abs(state.data[8:]) ** 2)),
        )

        return result.reshape(4, 4), frame

    def _process_tile_grover(self, tile_array: np.ndarray, num_qubits: int = 4) -> np.ndarray:
        tile_quantum = self._normalize_tile(tile_array, num_qubits)
        qc = QuantumCircuit(num_qubits)
        qc.initialize(tile_quantum, qc.qubits)
        self._apply_qft(qc, num_qubits)

        for i in range(num_qubits):
            qc.z(i)

        for i in range(num_qubits):
            qc.h(i)
            qc.x(i)
        qc.h(num_qubits - 1)
        qc.mcx(list(range(num_qubits - 1)), num_qubits - 1)
        qc.h(num_qubits - 1)
        for i in range(num_qubits):
            qc.x(i)
            qc.h(i)

        state = Statevector.from_instruction(qc)
        result = np.abs(state.data)
        if np.max(result) > 0:
            result = result / np.max(result)
        return result.reshape(4, 4)

    def _process_tile_vqe(self, tile_array: np.ndarray, optimization_trace: list[float], num_qubits: int = 4) -> np.ndarray:
        tile_quantum = self._normalize_tile(tile_array, num_qubits)
        qc = QuantumCircuit(num_qubits)
        qc.initialize(tile_quantum, qc.qubits)
        self._apply_qft(qc, num_qubits)

        for i in range(num_qubits):
            qc.z(i)

        for i in range(num_qubits):
            qc.h(i)
            qc.x(i)
        qc.h(num_qubits - 1)
        qc.mcx(list(range(num_qubits - 1)), num_qubits - 1)
        qc.h(num_qubits - 1)
        for i in range(num_qubits):
            qc.x(i)
            qc.h(i)

        theta = Parameter("theta")
        for i in range(num_qubits):
            qc.ry(theta, i)

        def cost(params: np.ndarray) -> float:
            val = params[0]
            qc_temp = qc.assign_parameters({theta: val})
            state = Statevector.from_instruction(qc_temp)
            data = np.abs(state.data)
            variance = float(np.var(data))
            optimization_trace.append(variance)
            return variance

        res = minimize(cost, x0=[0.5], method="COBYLA", options={"maxiter": 12})
        qc_final = qc.assign_parameters({theta: float(res.x[0])})
        state = Statevector.from_instruction(qc_final)
        result = np.abs(state.data)
        if np.max(result) > 0:
            result = result / np.max(result)
        return result.reshape(4, 4)

    @staticmethod
    def _mse(img1: np.ndarray, img2: np.ndarray) -> float:
        return float(np.mean((img1 - img2) ** 2))

    @staticmethod
    def _tile_positions(height: int, width: int, tile_size: int) -> list[tuple[int, int]]:
        out: list[tuple[int, int]] = []
        for row in range(0, height - tile_size + 1, tile_size):
            for col in range(0, width - tile_size + 1, tile_size):
                out.append((row, col))
        return out

    def _emit_event(self, state: JobState, event_id: str, label: str, side: str, mark: int) -> None:
        if any(e.id == event_id for e in state.timeline_events):
            return
        state.timeline_events.append(TimelineEvent(id=event_id, label=label, side=side, progress_mark=mark))

    def _run_job(self, job_id: str, image_id: str, tile_size: int, target_size: int) -> None:
        with self._lock:
            state = self._jobs[job_id]
            image_obj = self._images.get(image_id)
            state.status = "running"

        if image_obj is None:
            with self._lock:
                state.status = "failed"
                state.error = "Image not found"
            return

        image = image_obj.image
        if image.shape[0] != target_size or image.shape[1] != target_size:
            image = np.array(Image.fromarray(image).resize((target_size, target_size), Image.Resampling.LANCZOS), dtype=np.uint8)

        height, width = image.shape
        positions = self._tile_positions(height, width, tile_size)
        total = len(positions)

        qft_out = np.zeros((height, width), dtype=np.uint8)
        grover_out = np.zeros((height, width), dtype=np.uint8)
        vqe_out = np.zeros((height, width), dtype=np.uint8)
        optimization_trace: list[float] = []

        try:
            self._emit_event(state, "quantum-tiles", "4x4 tiles extracted", "quantum", 12)

            for idx, (row, col) in enumerate(positions):
                tile = image[row : row + tile_size, col : col + tile_size]
                qft_tile, frame = self._process_tile_qft(tile)
                grover_tile = self._process_tile_grover(tile)
                vqe_tile = self._process_tile_vqe(tile, optimization_trace)

                qft_out[row : row + tile_size, col : col + tile_size] = (qft_tile * 255).astype(np.uint8)
                grover_out[row : row + tile_size, col : col + tile_size] = (grover_tile * 255).astype(np.uint8)
                vqe_out[row : row + tile_size, col : col + tile_size] = (vqe_tile * 255).astype(np.uint8)

                if idx % max(1, total // 30) == 0:
                    state.progress_quantum = min(99.0, (idx / total) * 100)
                    state.selected_tile = TileInfo(row=row, col=col, values=[int(v) for v in tile.flatten().tolist()])
                    state.qubit_frame = frame

                    if state.progress_quantum >= 30:
                        self._emit_event(state, "quantum-encode", "Amplitude encoding complete", "quantum", 30)
                    if state.progress_quantum >= 47:
                        self._emit_event(state, "quantum-qft", "QFT gate chain finished", "quantum", 47)
                    if state.progress_quantum >= 65:
                        self._emit_event(state, "quantum-grover", "Grover oracle + diffusion", "quantum", 65)
                    if state.progress_quantum >= 84:
                        self._emit_event(state, "quantum-vqe", "VQE theta optimized", "quantum", 84)

            img_float = image.astype(np.float32)
            fft_full = np.fft.fft2(img_float)
            fft_shifted = np.fft.fftshift(fft_full)
            fft_mag = np.log(np.abs(fft_shifted) + 1)
            fft_mag = fft_mag / np.max(fft_mag)
            state.progress_classical = 34
            self._emit_event(state, "classical-fft", "FFT spectrum generated", "classical", 34)

            sobel_x = cv2.Sobel(img_float, cv2.CV_64F, 1, 0, ksize=3)
            sobel_y = cv2.Sobel(img_float, cv2.CV_64F, 0, 1, ksize=3)
            sobel = np.sqrt(sobel_x**2 + sobel_y**2)
            if np.max(sobel) > 0:
                sobel = sobel / np.max(sobel)
            state.progress_classical = 68
            self._emit_event(state, "classical-sobel", "Sobel edge map generated", "classical", 68)

            gaussian = gaussian_filter(img_float, sigma=1)
            if np.max(gaussian) > 0:
                gaussian = gaussian / np.max(gaussian)
            state.progress_classical = 100
            self._emit_event(state, "classical-gaussian", "Gaussian smoothing finished", "classical", 100)

            img_norm = image.astype(np.float32) / 255.0
            qft_norm = qft_out.astype(np.float32) / 255.0
            grover_norm = grover_out.astype(np.float32) / 255.0
            vqe_norm = vqe_out.astype(np.float32) / 255.0

            mse_results = [
                MseResult(key="qft", label="QFT", value=self._mse(img_norm, qft_norm), family="quantum"),
                MseResult(
                    key="grover",
                    label="QFT + Grover",
                    value=self._mse(img_norm, grover_norm),
                    family="quantum",
                ),
                MseResult(
                    key="vqe",
                    label="QFT + Grover + VQE",
                    value=self._mse(img_norm, vqe_norm),
                    family="quantum",
                ),
                MseResult(key="fft", label="FFT", value=self._mse(img_norm, fft_mag), family="classical"),
                MseResult(key="sobel", label="Sobel", value=self._mse(img_norm, sobel), family="classical"),
                MseResult(key="gaussian", label="Gaussian", value=self._mse(img_norm, gaussian), family="classical"),
            ]

            state.quantum_qft_preview_base64 = self._np_to_base64_png_preview(qft_out)
            state.quantum_grover_preview_base64 = self._np_to_base64_png_preview(grover_out)
            state.quantum_vqe_preview_base64 = self._np_to_base64_png_preview(vqe_out)
            state.fft_preview_base64 = self._np_to_base64_png_preview((fft_mag * 255).astype(np.uint8))
            state.sobel_preview_base64 = self._np_to_base64_png_preview((sobel * 255).astype(np.uint8))
            state.gaussian_preview_base64 = self._np_to_base64_png_preview((gaussian * 255).astype(np.uint8))
            state.optimization_trace = optimization_trace[-120:]
            state.mse_results = mse_results
            state.progress_quantum = 100
            state.progress_classical = 100
            state.status = "completed"

        except Exception as exc:  # pragma: no cover
            state.status = "failed"
            state.error = str(exc)


pipeline_service = PipelineService()
