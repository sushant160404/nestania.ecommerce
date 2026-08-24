# Render Deployment Guide

The backend deploys to Render as a Node **web service**. You can deploy it two
ways — pick one:

- **Blueprint (recommended):** the repo has a `render.yaml` at its root. In
  Render, choose **New → Blueprint**, connect this repo, and Render reads all
  settings (build/start commands, health check, `rootDir: backend`) from it.
  You'll be prompted for the secret env vars (`MONGODB_URI`, `CORS_ORIGIN`).
- **Manual:** create a Web Service and set the fields under "Manual settings"
  below yourself.

## Pre-deployment Checklist

### 1. MongoDB Setup
- [ ] Create MongoDB Atlas cluster
- [ ] Configure database user with read/write permissions
- [ ] Whitelist Render's outbound IPs (or `0.0.0.0/0` for simplicity)
- [ ] Get the connection string

> ⚠️ **Rotate your DB password first.** A live `MONGODB_URI` was previously
> committed in `backend/.env`, so those credentials are in git history and must
> be considered compromised. Rotate the Atlas password, then use the new URI
> only as a Render env var — never commit it.

### 2. Manual settings (skip if using the Blueprint)
1. **Create New Web Service** → connect this GitHub repo.
2. Set **Root Directory** to `backend`.
3. **Build Command:** `npm install --include=dev && npm run build`
   (the `--include=dev` is required — the build uses esbuild, a devDependency,
   which a plain production install would skip.)
4. **Start Command:** `npm start`
5. **Node Version:** 18 or higher (declared via `engines` in `package.json`).

### 3. Environment Variables (set in the Render dashboard)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
CORS_ORIGIN=https://your-frontend.vercel.app
```
`CORS_ORIGIN` is a comma-separated list — include every frontend origin that
calls the API (e.g. your Vercel production URL and any custom domain). It must
match exactly (scheme + host, no trailing slash).

### 4. Wire up the frontend
- [ ] Note your Render URL (e.g. `https://nestania-backend.onrender.com`)
- [ ] Set `VITE_API_URL` to that URL in the frontend's Vercel env vars, then redeploy
- [ ] Confirm the Render URL is present in this service's `CORS_ORIGIN`

### 5. Health Check
- [ ] `GET /api/health` returns `{ "status": "ok", ... }` (Render uses this)
- [ ] Test the DB connection (health reports `"db": "mongodb"` when connected)

## Storage caveat (important on the free plan)
Uploaded product images are written to `backend/public/product_images` on the
container's **local disk**, which Render wipes on every deploy and restart — so
uploads won't persist. For durable uploads, attach a Render **persistent disk**
mounted at that path, or move uploads to object storage (S3/Cloudinary/etc.).

## Troubleshooting
- Check Render logs for build/runtime errors.
- Build fails with "esbuild ... not found" → the build command is missing
  `--include=dev`.
- CORS errors in the browser → `CORS_ORIGIN` doesn't exactly match the frontend
  origin.
- App starts but can't reach the DB → verify `MONGODB_URI` and that Atlas allows
  connections from Render.
