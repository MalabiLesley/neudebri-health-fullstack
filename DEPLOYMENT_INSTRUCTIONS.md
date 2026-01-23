# Professional Deployment Guide - Neudebri Health System

## Architecture

```
┌─────────────────────────────────────────┐
│       Vercel (Frontend/Static)          │
│   https://neudebri-health.vercel.app    │
│  - React SPA (dist/public)              │
│  - Environment: VITE_API_BASE=[render]  │
└────────────────┬────────────────────────┘
                 │ API Calls
                 │
┌────────────────▼────────────────────────┐
│        Render (Backend/API)             │
│  https://neudebri-health-api.render.com │
│  - Express.js Server                    │
│  - All API routes                       │
│  - Static file serving fallback         │
└─────────────────────────────────────────┘
```

## Deployment Steps

### Step 1: Deploy Backend to Render

1. **Connect repository to Render**
   - Go to [render.com](https://render.com)
   - Create new Web Service
   - Connect your GitHub repository
   - Select the neudebri-health-fullstack repo

2. **Configure the service**
   - **Name:** neudebri-health-api
   - **Root Directory:** (leave empty)
   - **Environment:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Instance Type:** Free (or upgrade as needed)

3. **Add environment variables** (in Render dashboard)
   ```
   NODE_ENV = production
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete
   - Note the URL: `https://neudebri-health-api.render.com`

### Step 2: Deploy Frontend to Vercel

1. **Connect repository to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub project
   - Select the neudebri-health-fullstack repo

2. **Configure the project**
   - **Framework:** Vite
   - **Build Command:** `npm run build:client`
   - **Output Directory:** `dist/public`
   - **Install Command:** `npm ci`

3. **Add Environment Variables** (in Vercel project settings)
   ```
   VITE_API_BASE = https://neudebri-health-api.render.com
   ```

4. **Deploy**
   - Vercel will auto-deploy on push to main
   - Wait for build to complete
   - Your frontend URL: `https://neudebri-health.vercel.app`

### Step 3: Verify Deployment

**Test the frontend:**
```bash
curl https://neudebri-health.vercel.app/
```

**Test the backend API:**
```bash
curl https://neudebri-health-api.render.com/api/auth/demo/patient
```

**Test frontend → backend communication:**
1. Visit https://neudebri-health.vercel.app/
2. Open browser DevTools (F12)
3. Check Network tab
4. API calls should go to `https://neudebri-health-api.render.com/api/*`

## Local Development

### Start Backend
```bash
npm run dev
# or
NODE_ENV=production npm start
```
Backend: `http://localhost:5000`

### Start Frontend (separate terminal)
```bash
npm run build:client
# Then serve dist/public or use Vite dev server
npx vite --root client
```

### Configure local .env
```env
VITE_API_BASE=http://localhost:5000
```

## Key Files

- **`vercel.json`** - Vercel frontend configuration
- **`render.yaml`** - Render backend configuration
- **`.env.example`** - Environment variable template
- **`.env.production`** - Production environment (Render backend URL)

## Troubleshooting

### Frontend 404 errors
- Check `VITE_API_BASE` environment variable on Vercel
- Ensure Render backend is running
- Check browser Network tab - API calls should go to Render, not Vercel

### Backend 404 errors
- Check Render backend is deployed and running
- Verify `npm start` command works locally: `NODE_ENV=production node dist/index.cjs`
- Check Render logs for errors

### CORS errors
- Add CORS headers to Express (if needed)
- Both services are on `render.com` and `vercel.app` - different origins

### Cold starts
- Render free tier sleeps after 15 min inactivity
- First request may take 30+ seconds
- Upgrade to paid tier for always-on service

## Production Checklist

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel  
- [ ] Environment variables set on both platforms
- [ ] VITE_API_BASE points to Render backend
- [ ] Frontend loads without errors
- [ ] API calls work (check Network tab)
- [ ] All pages load correctly
- [ ] Login/authentication works
- [ ] Data displays from backend

## Scaling

**Current Setup (Free Tier):**
- Vercel: Limited to 12 serverless function invocations per day
- Render: Sleeps after 15 minutes of inactivity

**To Scale:**
1. Upgrade Render to paid tier (always-on, auto-scaling)
2. Upgrade Vercel to Pro/Enterprise if needed
3. Add database (PostgreSQL on Render or AWS RDS)
4. Add caching (Redis)
5. Add CDN for static assets

## Support

For issues with:
- **Vercel:** https://vercel.com/support
- **Render:** https://render.com/docs
- **Application:** Check application logs on both platforms
