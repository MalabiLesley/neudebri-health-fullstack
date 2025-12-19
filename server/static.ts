import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Try multiple possible paths for dist/public directory
  // In Vercel, the dist folder is at the root level relative to cwd
  const possiblePaths = [
    // For serverless functions - relative to api/index.ts 
    path.resolve(__dirname, "..", "..", "dist", "public"),
    // From process.cwd() (works in both local and Vercel)
    path.resolve(process.cwd(), "dist", "public"),
    // Fallback
    path.resolve(process.cwd(), "public"),
    // For local dev
    path.resolve(__dirname, "../..", "dist", "public"),
  ];

  console.log(`[Static] __dirname: ${__dirname}`);
  console.log(`[Static] process.cwd(): ${process.cwd()}`);
  console.log(`[Static] Searching for static files in:`);
  possiblePaths.forEach(p => console.log(`  - ${p}`));

  let distPath: string | null = null;
  for (const p of possiblePaths) {
    console.log(`[Static] Checking ${p}... exists: ${fs.existsSync(p)}`);
    if (fs.existsSync(p)) {
      console.log(`[Static] ✓ Found dist at: ${p}`);
      distPath = p;
      break;
    }
  }

  if (!distPath) {
    console.warn(`[Static] ✗ Could not find dist directory in any expected location`);
    console.warn("[Static] Static files will not be served. Make sure to run 'npm run build' first.");
    return;
  }

  // Serve static files with caching
  app.use(express.static(distPath, {
    maxAge: "1d",
    etag: false
  }));

  // SPA fallback - serve index.html for all non-file routes
  app.use("*", (req, res) => {
    const indexPath = path.resolve(distPath!, "index.html");
    console.log(`[Static] Fallback request to ${req.originalUrl}, serving index.html from ${indexPath}`);
    if (!fs.existsSync(indexPath)) {
      console.error(`[Static] ✗ index.html not found at ${indexPath}`);
      return res.status(404).json({ error: "index.html not found" });
    }
    res.sendFile(indexPath);
  });
}

