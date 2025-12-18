import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Try multiple possible paths for dist/public directory
  // In Vercel, the dist folder is at the root level
  const possiblePaths = [
    // For serverless functions in api/ directory
    path.resolve(__dirname, "../public"),
    // For regular Node.js server
    path.resolve(__dirname, "public"),
    // From process.cwd() (works in both local and Vercel)
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
  ];

  let distPath: string | null = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      console.log(`[Static] Found dist at: ${p}`);
      distPath = p;
      break;
    }
  }

  if (!distPath) {
    console.warn(`[Static] Could not find dist directory. Tried:\n${possiblePaths.map(p => `  - ${p}`).join("\n")}`);
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
    if (!fs.existsSync(indexPath)) {
      return res.status(404).json({ error: "index.html not found" });
    }
    res.sendFile(indexPath);
  });
}

