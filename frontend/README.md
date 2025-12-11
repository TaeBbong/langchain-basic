# LLM Chat Frontend (React)

A minimal React frontend for an LLM chat service backed by the existing `/chat` endpoint.

## Scripts

- `npm install` – install deps
- `npm run dev` – start Vite dev server (port 5173)
- `npm run build` – production build to `dist/`
- `npm run preview` – preview the production build locally

## Dev Proxy

The Vite dev server proxies `/chat` to your backend. Set `VITE_BACKEND_URL` (defaults to `http://localhost:8000`). Example:

```sh
VITE_BACKEND_URL=http://localhost:8000 npm run dev
```

The app uses a relative URL (`/chat`) so when you serve the built files via the same origin as the backend, it will call the backend directly without extra config.

## Assumed API Contract

The client POSTs to `/chat` with JSON `{ user_message: string }`. The response is expected to be JSON and contain a reply in one of these fields: `reply`, `message`, `text`, `content`, `answer`, or `assistant`. If none are present, the client will stringify the JSON or fall back to plain text.

You can adjust `src/services/api.js` to fit your server’s exact schema.

## Project Structure

```
frontend/
  src/
    components/   # Header, ChatWindow, Message, ChatInput
    hooks/        # useChat (state), useLocalStorage
    pages/        # ChatPage
    services/     # api.js (calls /chat)
    styles/       # globals.css
    App.jsx, main.jsx
  index.html
  vite.config.js  # dev proxy and build config
```

## Integration

1. Run `npm run build` to produce `frontend/dist/`.
2. Serve the `dist/` folder via your backend’s static file handler, ensuring requests to `/chat` reach the backend endpoint.
