# Quantum Vision Backend

## Setup

1. Create and activate a Python environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Start the API server:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Endpoints

- `POST /api/upload` image upload (grayscale + resize).
- `POST /api/process` start quantum/classical processing job.
- `GET /api/jobs/{job_id}` poll job progress and outputs.
- `GET /health` health check.

## Notes

- Processing uses QFT, Grover, and VQE on 4x4 tiles.
- Classical outputs include FFT, Sobel, and Gaussian previews.
- Frontend expects this server at `http://127.0.0.1:8000` by default.
