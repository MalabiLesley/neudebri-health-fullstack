# Deployment — Frontend / Backend separation

- Backend
  - Lives in /workspaces/neudebri-health-fullstack/server
  - Start dev server: (from repo root)
    - cd server
    - npm install
    - NODE_ENV=development npm run dev
  - Exposes REST API (e.g. /api/appointments). Uses CORS; set CLIENT_ORIGIN env to restrict origin in production.

- Frontend
  - Lives in /workspaces/neudebri-health-fullstack/client
  - Start dev: cd client && npm install && npm run dev
  - In production: build static files (npm run build) and serve via CDN/static host (Netlify, Vercel) or serve behind a reverse proxy.

- Production recommendations
  - Build frontend separately and host as static assets (CDN or S3 + CloudFront).
  - Host backend as a separate service (Docker container, Kubernetes, or cloud app).
  - Use an API base URL env var in the frontend (e.g. REACT_APP_API_URL or VITE_API_URL) to point to backend.
  - Configure backend CORS to allow only your frontend origin.
  - Use a reverse proxy (NGINX) or API gateway to route /api/* to backend and serve static files from the frontend host.

- Quick local dev
  - Start backend on port 4000, frontend on port 5173 (or Vite default).
  - Set CLIENT_ORIGIN=http://localhost:5173 for stricter CORS.
  - Example:
    export CLIENT_ORIGIN=http://localhost:5173
    cd server && npm run dev
    cd client && npm run dev

## Docker local dev (recommended)
1. Build and bring services up:
   docker-compose up --build -d
2. Initialize DB and run Prisma migrations from server container or host:
   cd server
   npx prisma generate
   npx prisma migrate dev --name init
   npm run prisma:seed
3. Open:
   - Frontend: http://localhost:5173
   - Backend health: http://localhost:4000/health

## Production notes
- Build frontend as static assets and host on CDN or static host (S3 + CloudFront, Netlify, Vercel).
- Host backend as a container or managed service, point VITE_API_URL / CLIENT_ORIGIN accordingly.
- Use strong JWT_SECRET and secure DB credentials in environment variables / secrets manager.