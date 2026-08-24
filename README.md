# Nestania — Split Architecture (MVC, fully independent)

This project is split into two **fully independent** projects — neither reaches
into the other, and there is no shared code folder between them. Each is
structured as MVC internally.

```
nestania/
├── backend/    Express API server (port 4000) — MongoDB, orders, products, auth, uploads
└── frontend/   React + Vite app (port 5173) — talks to the backend over HTTP
```

Previously `server.ts` ran Express *and* Vite in the same process (Vite in middleware
mode), so the app only worked as one combined process. That coupling is gone. Then,
in an earlier pass, both sides pulled their types/product data/image helpers from a
sibling `shared/` folder outside their own directory. That's gone too — each side
now owns its own copy of that code, so `frontend/` and `backend/` can be copied out
of this repo individually and will build and run with zero changes.

## MVC layout on each side

**backend/src/**
```
models/       Domain types (types.ts), in-memory product/category/coupon data
              (productData.ts), and the local-image registry (imageRegistry.ts)
controllers/  One file per resource — pure request-handling logic, no routing
routes/       Thin Express routers that wire URLs/methods to controllers
services/     DatabaseService.ts — all MongoDB access
middleware/   multer upload config
config/       CORS config
app.ts        Builds & configures the Express app (middleware + routes)
server.ts     Bootstraps the DB connection and starts app.listen()
```

**frontend/src/**
```
types.ts, data/products.ts, utils/imageUtils.ts   Local copies of domain
                                                    types/data (no longer @shared)
models/       Client-side data-shaping helpers (CartModel, OrderModel, etc.)
controllers/  ShopController.ts — orchestrates model + API calls
context/      ShopContext.tsx — app-wide state (View layer's data source)
components/, pages/   The View layer (React components)
```

## Quick start

There is no root `package.json` and no workspaces — `backend/` and `frontend/` are
two standalone projects. Install and run each on its own, in two terminals:

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env
npm run dev              # http://localhost:4000

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

Open http://localhost:5173 — the app looks and behaves exactly as before, admin panel
included (`/admin`, default login `admin@nestania.com` / `admin123`).

## How the two servers connect

- The frontend never hardcodes the backend's address. `frontend/src/config/api.ts`
  reads `VITE_API_URL` and every API call in the app goes through its `apiFetch()`
  helper (a drop-in replacement for `fetch`), which prefixes relative `/api/...`
  paths with that URL.
- Uploaded product images live on the **backend** (`backend/public/product_images`,
  served at `/product_images/*`). `frontend/src/utils/imageUtils.ts` exposes
  `setAssetBaseUrl()`, which `frontend/src/main.tsx` calls once at startup with the
  same `VITE_API_URL`, so `<img>` tags resolve to the backend automatically.
- CORS: the backend reads `CORS_ORIGIN` (comma-separated list) and only allows those
  origins to call it. Update it to include your frontend's deployed URL in production.

## Environment variables

**backend/.env**
| Var | Default | Purpose |
|---|---|---|
| `PORT` | `4000` | API server port |
| `MONGODB_URI` | *(unset → in-memory storage)* | MongoDB Atlas/self-hosted connection string |
| `CORS_ORIGIN` | `http://localhost:5173` | Comma-separated list of allowed frontend origins |

**frontend/.env**
| Var | Default | Purpose |
|---|---|---|
| `VITE_API_URL` | `http://localhost:4000` | Where the backend API/assets live |

⚠️ **Rotate your MongoDB credentials.** An earlier version of `server.ts` had a live
MongoDB Atlas username/password hardcoded directly in the source. That's been removed
— `MONGODB_URI` is now read from the environment — but since the credentials were
committed to the repo before, treat them as compromised and rotate the database
password in Atlas.

## Deploying separately

Because these are two fully independent projects, deploy them independently:

- **Backend**: `cd backend && npm run build` → `backend/dist/server.cjs`. Run with
  `node dist/server.cjs` on any Node host (Render, Fly.io, a VPS, etc.), with
  `MONGODB_URI` and `CORS_ORIGIN` set in that host's environment.
- **Frontend**: `cd frontend && npm run build` → static files in `frontend/dist/`.
  Deploy to any static host (Vercel, Netlify, S3+CDN, etc.) with `VITE_API_URL` set
  to your backend's public URL at build time.

`frontend/vercel.json` still contains the SPA rewrite rule needed if you deploy the
frontend to Vercel as a static site.

## What changed in this pass

| Before | Now |
|---|---|
| `backend`/`frontend` each imported from a sibling `shared/` folder via `@shared/*` (frontend) or `../../shared/...` (backend) | Each side has its own local copy: `frontend/src/{types.ts, data/products.ts, utils/imageUtils.ts}` and `backend/src/models/{types.ts, productData.ts, imageRegistry.ts}` |
| `backend/src/server.ts` was one 570-line file with all routes, middleware config, and the listen() call inline | Split into `app.ts` (Express app + middleware + route mounting), `server.ts` (bootstrap/listen), `routes/*` (one router per resource), `controllers/*` (one file per resource), `middleware/upload.ts`, `config/cors.ts` |
| `shared/` folder at the repo root | Removed — no longer needed by either side |
| Root `package.json` with npm `workspaces: ["frontend", "backend"]` tying both projects together for install/scripts | Removed — no root `package.json` at all; each project has its own independent `npm install` / scripts |

No frontend UI code, component logic, or API route behavior was changed — this was a
structural refactor only.
