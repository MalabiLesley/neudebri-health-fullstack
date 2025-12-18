# Complete Deployment Settings Guide

## 🎯 Overview
This guide covers all settings needed for successful deployment of your Neudebri Health System on Vercel.

---

## 📋 Root Configuration Files

### 1. `vercel.json` ✅
**Location:** `/vercel.json`

**Current Configuration:**
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "outputDirectory": "dist"
}
```

**What Each Setting Does:**
- `buildCommand`: Tells Vercel how to build your app
  - Runs: `npm run build` → Builds client with Vite + server with esbuild
  - Outputs to: `dist/` directory
  - Time: ~8-10 seconds

- `installCommand`: How to install dependencies
  - `npm ci` (Continuous Integration) is better than `npm install`
  - Faster and more reliable in CI/CD environments
  - Respects exact versions in `package-lock.json`

- `outputDirectory`: Where Vercel finds your built files
  - Must point to `dist/` where your build outputs
  - Contains `index.cjs` (server) and `public/` (client)

**Do Not Change Unless:**
- You change the build output location
- You use a different build tool

---

### 2. `package.json` ✅
**Location:** `/package.json`

**Key Scripts:**
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsx script/build.ts",
    "start": "NODE_ENV=production node dist/index.cjs",
    "check": "tsc",
    "db:push": "drizzle-kit push"
  }
}
```

**Understanding Each Script:**
- `npm run build` - Vercel runs this (configured in vercel.json)
  - Builds client with Vite
  - Bundles server with esbuild
  - Output: `dist/index.cjs` + `dist/public/`

- `npm start` - For local testing (not used by Vercel)
  - Runs the server on port 5000
  - Good for debugging locally

- `npm run check` - TypeScript validation
  - Run before deploying: `npm run check`
  - Should show 0 errors

- `npm run db:push` - Database migrations
  - Only run if using PostgreSQL
  - Sets up database schema

**Do Not Change Without Good Reason:**
- These are optimized for the current setup
- Changing could break builds

---

### 3. `tsconfig.json` ✅
**Location:** `/tsconfig.json`

**Key Settings:**
- `"strict": true` - Strict type checking (good!)
- `"jsx": "preserve"` - Let Vite handle JSX
- `"module": "ESNext"` - Modern module format
- `"paths": { "@/*": ["./client/src/*"] }` - Import aliases

**Status:** Leave as-is

---

### 4. `vite.config.ts` ✅
**Location:** `/vite.config.ts`

**Key Settings:**
```typescript
{
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  }
}
```

**What This Does:**
- Sets React app root to `client/` directory
- Outputs built files to `dist/public/`
- `emptyOutDir: true` ensures clean builds

**Status:** Leave as-is

---

### 5. `.env.example` ✅
**Location:** `/.env.example`

**Current Content:**
```env
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/neudebri_health

# Node Environment
NODE_ENV=production

# Server Port (automatically set by Vercel)
# PORT=5000
```

**Status:** Documentation only (for reference)

---

## 🔐 Environment Variables (Critical!)

**Where to Set These:** Vercel Dashboard → Settings → Environment Variables

### Required Variables

#### 1. `NODE_ENV` ✅ REQUIRED
```
NODE_ENV = production
```
- **Value:** Always `production` for deployed apps
- **Purpose:** Tells Node.js to use production optimizations
- **Impact:** Critical for performance
- **Default:** Not set (could cause issues)

#### 2. `DATABASE_URL` ⚠️ CONDITIONAL
```
DATABASE_URL = postgresql://user:password@host:5432/database_name
```
- **Required If:** Using PostgreSQL database
- **Optional If:** Using in-memory storage (current setup)
- **Format:** PostgreSQL connection string
- **Note:** Make sure password has no special characters, or URL-encode them

**If You Don't Set It:**
- App uses in-memory storage (good for demo)
- Data resets on each deployment
- Fine for development/testing

**When to Set It:**
- Moving to production
- Need persistent data
- Multiple users

---

## 🌐 Vercel Dashboard Settings

### Step 1: Project Settings
**URL:** Vercel Dashboard → Your Project → Settings

**Check These Settings:**

1. **General Tab**
   ```
   Project Name: neudebri-health-fullstack
   Framework: Other (custom)
   Build Command: npm run build (already set)
   Output Directory: dist (already set)
   Install Command: npm ci (already set)
   ```

2. **Git Tab**
   ```
   Connected Repository: MalabiLesley/neudebri-health-fullstack
   Production Branch: main
   ```
   
   ✅ Verify:
   - Correct GitHub repo is linked
   - `main` is the production branch
   - Auto-deploy is enabled

3. **Environment Variables Tab** ⭐ IMPORTANT
   ```
   NODE_ENV = production
   DATABASE_URL = (if using PostgreSQL)
   ```
   
   ✅ Add These:
   - Click "Add New"
   - Set each variable
   - Click "Save"

4. **Domains Tab**
   ```
   Your deployment URL: https://your-project.vercel.app
   Custom domain: (optional)
   ```
   - Can add custom domain here
   - Default Vercel domain works for testing

5. **Deployment Protection** (Optional)
   - Can password-protect deployments
   - Not necessary for public apps

### Step 2: Function Settings
**URL:** Vercel Dashboard → Your Project → Deployments → Functions

**What to Check:**
- Should see `api` function listed
- Status should be "Ready"
- Memory: 1024 MB (default is fine)
- Max Duration: 60 seconds (default is fine)

**If Not Showing:**
- Force redeploy with `Redeploy` button
- Check build logs for errors

---

## 📦 Build Configuration

### `script/build.ts` ✅
**What It Does:**
1. Cleans `dist/` directory
2. Builds client with Vite → `dist/public/`
3. Bundles server with esbuild → `dist/index.cjs`

**Build Output:**
```
dist/
├── index.cjs (844 KB) - Server code
└── public/
    ├── index.html (1.4 KB)
    ├── assets/
    │   ├── index-*.js (928 KB)
    │   └── index-*.css (76.68 KB)
    └── favicon.png
```

**Status:** Leave as-is

---

## 🔧 API Handler Configuration

### `api/index.ts` ✅
**Location:** `/api/index.ts`

**What It Does:**
1. Exports Express app for Vercel serverless
2. Initializes routes on first request
3. Serves static files
4. Handles errors

**Current Flow:**
```
Request → Vercel → api/index.ts → Express app
         ↓
    Register routes → API handling
         ↓
    Serve static files → Frontend
         ↓
    Response → Vercel → Client
```

**Status:** Leave as-is

---

## 🗂️ Static File Configuration

### `server/static.ts` ✅
**Location:** `/server/static.ts`

**What It Does:**
1. Finds `dist/public/` directory
2. Serves static files (JS, CSS, images)
3. SPA fallback to `index.html`

**Path Resolution (tries in order):**
1. `__dirname/../public` (from `dist/` compiled files)
2. `__dirname/public` (direct from server dir)
3. `process.cwd()/dist/public` (from project root)
4. `process.cwd()/public` (fallback)

**Caching:**
- `maxAge: "1d"` - Browser caches files for 1 day
- `etag: false` - Disables ETag headers

**SPA Fallback:**
- Serves `index.html` for all non-file routes
- Allows React Router to handle routing
- Returns 404 only if `index.html` missing

**Status:** Leave as-is

---

## ✅ Pre-Deployment Checklist

### Code Quality
- [ ] Run `npm run check` - Should show 0 errors
- [ ] Run `npm run build` - Should complete in ~10 seconds
- [ ] All commits pushed to `main` branch
- [ ] No uncommitted changes

### Configuration Files
- [ ] `vercel.json` exists and is valid JSON
- [ ] `package.json` has correct scripts
- [ ] `tsconfig.json` is valid
- [ ] `vite.config.ts` points to correct directories

### Git Repository
- [ ] Repository is public (Vercel can access it)
- [ ] Using `main` branch (or correct production branch)
- [ ] Latest code is pushed to GitHub
- [ ] No sensitive files committed (check `.gitignore`)

### Vercel Dashboard
- [ ] Project is linked to GitHub repository
- [ ] Build command: `npm run build` ✓
- [ ] Install command: `npm ci` ✓
- [ ] Output directory: `dist` ✓
- [ ] Environment variables set:
  - [ ] `NODE_ENV = production`
  - [ ] `DATABASE_URL` (if using PostgreSQL)

### Files Exist
- [ ] `dist/index.cjs` (server bundle)
- [ ] `dist/public/index.html` (frontend)
- [ ] `dist/public/assets/index-*.js` (React app)
- [ ] `api/index.ts` (serverless handler)

---

## 🚀 Deployment Process

### 1. Local Verification
```bash
# Clean build
npm run build

# Type check
npm run check

# Both should succeed
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Deployment: Ready for production"
git push origin main
```

### 3. Vercel Auto-Deploy
- Vercel detects push to `main`
- Starts build automatically
- Takes ~2-3 minutes

### 4. Or Manual Deploy
- Go to Vercel Dashboard
- Click "Redeploy" button
- Wait for build status to show ✓

### 5. Verify Deployment
```bash
# Test static files
curl https://your-app.vercel.app/assets/index-*.js

# Test API
curl https://your-app.vercel.app/api/auth/demo/patient

# Visit frontend
https://your-app.vercel.app/
```

---

## 🔍 What to Check After Deployment

### Vercel Dashboard
1. **Deployment Status**
   - Should show green checkmark ✓
   - "Ready" status

2. **Build Logs**
   - Should show: `✓ built in X.XXs`
   - No error messages
   - Look for: `[Static] Found dist at:`

3. **Function Logs**
   - Click "Functions" tab
   - Should see `api` function
   - Click to view runtime logs
   - Look for: `[API] App initialized successfully`

### Browser Testing
1. **Frontend**
   - Visit `https://your-app.vercel.app/`
   - Should show dashboard (no white page)
   - Check console - should be clean

2. **API Endpoint**
   - Visit `https://your-app.vercel.app/api/auth/demo/patient`
   - Should return JSON with user data
   - Not 404 or error page

3. **Static Assets**
   - Open DevTools → Network
   - Load page, check assets
   - All JS/CSS files should return 200
   - Not 404 or 500

4. **Functionality**
   - Click navigation links
   - Should change pages
   - No console errors

---

## ⚠️ Common Issues & Solutions

### Issue 1: 404 Errors
```
Symptom: "404: NOT_FOUND" on page load
```
**Check:**
1. Vercel build logs - did build complete?
2. Is `dist/public/index.html` in build?
3. Are environment variables set?

**Fix:**
1. Click "Redeploy" button
2. Check output in build logs
3. Verify `vercel.json` is correct

### Issue 2: White Page
```
Symptom: Page loads but shows blank/white
```
**Check:**
1. Browser console - any errors?
2. Network tab - did JS files load? (200 status)
3. Static files returning correct content?

**Fix:**
1. Hard refresh: `Ctrl+Shift+R`
2. Clear cache: `Ctrl+Shift+Delete`
3. Check Vercel Function logs

### Issue 3: API 404
```
Symptom: API calls return 404
```
**Check:**
1. Is the route registered in `server/routes.ts`?
2. Does the function log show initialization?
3. Is `api/index.ts` present in repo?

**Fix:**
1. Verify routes are exported correctly
2. Redeploy from Vercel dashboard
3. Check Function logs for errors

### Issue 4: "Port disconnected" in Console
```
Symptom: Browser shows "Port disconnected, reconnecting..."
```
**Check:**
1. Is this a development mode artifact?
2. Clear browser cache and reload
3. Check if using old cached version

**Fix:**
1. Ctrl+Shift+Delete - clear all cache
2. Ctrl+Shift+R - hard refresh
3. Test in incognito window

---

## 📊 Performance Metrics

### Build Performance
- **Build time:** ~8-10 seconds
- **Server bundle:** 844 KB
- **Client JS:** 928 KB (265 KB gzipped)
- **Client CSS:** 76.68 KB (12.41 KB gzipped)
- **Total:** ~1.9 MB

### Optimization Tips (Optional)
- Code-split large components
- Use dynamic imports for routes
- Compress images
- Enable gzip (Vercel does this automatically)

---

## 🔐 Security Checklist

### Sensitive Data
- [ ] No API keys in code
- [ ] No passwords committed
- [ ] `.env.local` is in `.gitignore`
- [ ] Environment variables used for secrets

### CORS & Headers
- Express has built-in CORS support
- Static files served with cache headers
- No sensitive info in HTTP headers

### Database Security
- [ ] Use strong passwords in DATABASE_URL
- [ ] PostgreSQL requires SSL if available
- [ ] Restrict database access to Vercel IPs

---

## 📞 Support & Debugging

### Vercel Docs
- [Vercel Node.js Runtime](https://vercel.com/docs/functions/serverless-functions)
- [Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Deployment Configuration](https://vercel.com/docs/projects/project-configuration)

### Deployment Guides
- See `DEPLOYMENT_GUIDE.md` for initial setup
- See `DEPLOYMENT_FIX.md` for 404 fixes
- See `VERCEL_TROUBLESHOOTING.md` for detailed troubleshooting

### Quick Debug Commands
```bash
# Build locally (same as Vercel)
npm run build

# Type check (catches errors early)
npm run check

# Start server locally
npm start

# Check git status
git status

# View recent commits
git log --oneline -5
```

---

## ✨ Summary

**What's Configured:**
- ✅ Build system (Vite + esbuild)
- ✅ Vercel settings (vercel.json)
- ✅ API handler (api/index.ts)
- ✅ Static serving (server/static.ts)
- ✅ Environment setup (.env.example)

**What You Need to Set:**
1. **Vercel Dashboard → Settings → Environment Variables**
   - `NODE_ENV = production`
   - `DATABASE_URL` (if using PostgreSQL)

2. **Verify:**
   - GitHub repo linked correctly
   - `main` branch is production branch
   - Build/install commands are correct

**Then Deploy:**
- Push to main: `git push origin main`
- Vercel auto-deploys
- Or manually redeploy from dashboard

**Result:**
- App running at `https://your-project.vercel.app`
- All settings optimized for production
- Ready for users!

---

**Last Updated:** 2025-12-18
**Status:** Ready for Production Deployment ✅
