# LangChain-Basic

Basic tutorial to learn langchain

## How to run (local)

```bash
$ uv run uvicorn app.main:app --reload
```

## Run everything with Docker Compose

The default compose file runs everywhere (macOS Apple Silicon, Linux, Windows) without assuming a GPU. Build and start both the FastAPI backend (`backend` service) and the React frontend with one command:

```bash
docker compose up --build
```

- Frontend (Vite dev server): http://localhost:5173
- Backend is only reachable from inside the Docker network (the frontend container proxies to it).

The frontend container reads `VITE_BACKEND_URL` (defaults to `http://backend:8000` in `docker-compose.yml`) so you can point it at a different API by setting an environment override:

```bash
VITE_BACKEND_URL=https://your-api-host docker compose up --build frontend
```

The backend purposely is not published to the host for safety. If you want to hit it directly (e.g., `http://localhost:8000/docs`), temporarily add `ports: ["8000:8000"]` under the `backend` service in `docker-compose.yml` or run `docker compose run --service-ports backend`. Stop the stack with `docker compose down`.

### Environment variables

Populate the root `.env` file (sample keys are already listed) before running Docker Compose. The backend service imports everything from this file via `env_file` so secrets/config stay out of the image build.

### GPU passthrough (Linux/NVIDIA hosts)

When you need the backend to offload work to an NVIDIA GPU, use the `backend-gpu` service that lives in the same compose file. Start it alongside the frontend like this:

```bash
docker compose --profile gpu up --build backend-gpu frontend
```

Only the services you request are created, so the default CPU-only `backend` stays stopped and port 8000 remains available. The GPU service inherits the same image/build but adds `deploy.resources.reservations.devices` plus the standard `NVIDIA_VISIBLE_DEVICES` / `NVIDIA_DRIVER_CAPABILITIES` env vars. Install the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) on the host beforehand. On macOS (including Apple Silicon/M-series) Docker Desktop cannot expose GPUs, so keep using the default CPU service (`docker compose up --build`).
