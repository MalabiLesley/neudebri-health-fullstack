import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In Vercel, we need to find public directory relative to where code is deployed
  // The bundled server will be at .vercel/output/functions/api/[[...slugs]].func/
  // But we import the app from ../server/index which is server/index.ts source
  
  let distPath: string | null = null;
  
  // Strategy: Look for dist/public relative to common deployment paths
  const pathsToTry = [
    // Current working directory (Vercel root)
    path.join(process.cwd(), "dist", "public"),
    // Relative to the bundled location
    path.join(process.cwd(), "..", "..", "dist", "public"),
    // For local development
    path.resolve(__dirname, "..", "dist", "public"),
    path.resolve(__dirname, "..", "..", "dist", "public"),
  ];

  console.log(`[Static] Process CWD: ${process.cwd()}`);
  console.log(`[Static] Script dirname: ${__dirname}`);
  
  for (const tryPath of pathsToTry) {
    const indexPath = path.join(tryPath, "index.html");
    if (fs.existsSync(indexPath)) {
      distPath = tryPath;
      console.log(`[Static] ✓ Found dist/public at: ${distPath}`);
      break;
    }
  }

  if (!distPath) {
    console.error(`[Static] ✗ Could not find dist/public/index.html`);
    // Fallback: just serve from dist/public assuming it exists
    // Vercel will handle the error if files are missing
    distPath = path.join(process.cwd(), "dist", "public");
    console.log(`[Static] ⚠️  Using fallback path: ${distPath}`);
  }

  // Serve static assets with aggressive caching
  app.use(express.static(distPath, {
    maxAge: "1y",
    etag: false,
    lastModified: false,
    setHeaders: (res, filepath) => {
      if (filepath.match(/\.(js|css|woff2|ttf|eot|woff)$/i)) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
      } else if (filepath.endsWith('index.html') || filepath.endsWith('.html')) {
        res.set('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    }
  }));

  // SPA fallback - serve index.html for all non-matched routes
  app.use((req, res) => {
    const indexPath = path.join(distPath!, "index.html");
    console.log(`[SPA Fallback] ${req.method} ${req.path}`);
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error(`[SPA Fallback] Error sending index.html:`, err.message);
        res.status(404).json({ error: "Not found" });
      }
    });
  });
}


