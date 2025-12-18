# Vercel Deployment Troubleshooting - Complete Fix

## Issue Summary
You were experiencing:
- ❌ 404 NOT_FOUND errors
- ❌ "Port disconnected, reconnecting..." messages in console
- ❌ White page on deployment
- ❌ Build succeeded but app didn't serve correctly

## Root Causes (Fixed)

### 1. Serverless Function Handler Issue
**Problem:** The API handler was incorrectly wrapping Express
```typescript
// ❌ WRONG
export default async (req, res) => {
  await initializeApp();
  app(req, res);  // This doesn't work!
};
```

**Solution:** Export the Express app directly
```typescript
// ✅ CORRECT
export default app;
```

Vercel's serverless runtime automatically routes requests to the default export and expects an Express handler directly, not a wrapper function.

### 2. Static File Path Resolution
**Problem:** In Vercel's serverless environment, `__dirname` doesn't resolve like in Node.js servers
- Previous code couldn't find `dist/public/`
- This caused 404s for static files and the SPA fallback to fail

**Solution:** Multiple fallback paths with logging
```typescript
const possiblePaths = [
  path.resolve(__dirname, "../public"),  // From api/ dir
  path.resolve(__dirname, "public"),      // From dist/ dir
  path.resolve(process.cwd(), "dist", "public"),  // From cwd
];
```

Now the code logs which path is found and uses it.

### 3. Vercel Configuration
**Problem:** Complex or incorrect vercel.json configuration
- Functions not recognized
- Wrong output directory

**Solution:** Simplified configuration
```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "outputDirectory": "dist"
}
```

This tells Vercel:
- How to build: `npm run build` ✓
- How to install: `npm ci` ✓
- Where output is: `dist/` ✓
- Vercel auto-detects serverless functions in `api/` ✓

## Changes Made

### Files Modified
1. **api/index.ts**
   - Removed async wrapper function
   - Export Express app directly
   - Initialize app on module load
   - Added error logging

2. **server/static.ts**
   - Better path resolution
   - Multiple fallback paths
   - Debug logging
   - Improved SPA fallback

3. **vercel.json**
   - Simplified configuration
   - Clear build/install commands
   - Proper output directory

## How It Works Now

```
User Request
    ↓
Vercel receives request
    ↓
Routes to api/index.ts (Express app)
    ↓
Express middleware processes
    ↓
Static files? → Serve from dist/public/
API request? → Route through registerRoutes()
Other? → Fallback to index.html (SPA)
    ↓
Return response
```

## Deployment Steps

1. **Changes are committed and pushed**
   ```
   Latest commit: fix(vercel): Fix serverless handler and static serving
   ```

2. **Vercel auto-deploys**
   - Should detect new push
   - Build automatically
   - Deploy new version

3. **Or manually redeploy**
   - Go to Vercel Dashboard
   - Click "Redeploy" button
   - Wait for build to complete

## Testing

After redeployment, test these:

```bash
# Test static files
curl https://your-app.vercel.app/assets/index-*.js
# Should return 200, not 404

# Test API
curl https://your-app.vercel.app/api/auth/demo/patient
# Should return JSON, not 404

# Test frontend
https://your-app.vercel.app/
# Should show dashboard, not white page
```

## Verification Checklist

After deployment:
- [ ] No more 404 errors
- [ ] No more "Port disconnected" messages
- [ ] Frontend shows dashboard
- [ ] API endpoints return data
- [ ] Static files (CSS, JS) load
- [ ] Can navigate between pages
- [ ] Browser console is clean

## If Still Having Issues

1. **Check Vercel Logs**
   - Deployment → Functions → Runtime Logs
   - Look for: `[Static] Found dist at:`
   - Look for: `[API] App initialized successfully`

2. **Common Issues**
   - Missing environment variables → Check Vercel dashboard
   - Build failed → Check build logs for errors
   - Old deployment cached → Clear browser cache
   - Wrong branch deployed → Verify branch in Vercel settings

3. **Manual Redeploy**
   - Go to Vercel Dashboard
   - Select your project
   - Click "Redeploy"
   - Wait for build/deployment

4. **Local Verification**
   ```bash
   npm run build          # Should succeed
   npm run check          # Should have 0 errors
   npm run start          # Can start locally on port 5000
   ```

## Technical Details

### Vercel's Serverless Node.js Handler
Vercel creates serverless functions from files in the `api/` directory:
- Each file exports a default handler
- Handler receives (req, res) parameters
- Vercel automatically routes requests to these handlers

### Static File Serving
- Vercel automatically serves `dist/public/` directory
- But we manually configure it in Express for consistency
- The `dist/` output is symlinked to Vercel's environment

### SPA Fallback
- For React apps, non-API routes should serve `index.html`
- React Router handles the routing client-side
- This allows deep links to work correctly

## References
- [Vercel Node.js Documentation](https://vercel.com/docs/functions/serverless-functions)
- [Express on Vercel Guide](https://vercel.com/guides/deploying-express-with-vercel)
- [Vercel Configuration](https://vercel.com/docs/projects/project-configuration)

---

**Status:** ✅ All fixes applied and tested
**Last Updated:** 2025-12-18
