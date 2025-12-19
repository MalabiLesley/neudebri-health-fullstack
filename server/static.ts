import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Try multiple possible paths for public directory
  // In Vercel serverless, this will be inside .vercel/functions/api/
  const possiblePaths = [
    // For Vercel serverless function
    path.resolve(__dirname, "..", "public"),
    // For local dev from api/index.ts
    path.resolve(__dirname, "..", "..", "dist", "public"),
    // From process.cwd()
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
  ];

  console.log(`[Static] Looking for public files...`);
  let distPath: string | null = null;
  
  for (const p of possiblePaths) {
    const exists = fs.existsSync(p);
    console.log(`[Static] ${exists ? "✓" : "✗"} ${p}`);
    if (exists) {
      distPath = p;
      console.log(`[Static] Using: ${distPath}`);
      break;
    }
  }

  if (!distPath) {
    console.warn(`[Static] ✗ Could not find public directory`);
    console.warn("[Static] App will return 404 for static requests");
    // Still set up the fallback route so we don't crash
    app.use("*", (req, res) => {
      res.status(404).json({ error: "Static files not found. Make sure to run 'npm run build'." });
    });
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
      console.error(`[Static] index.html not found at ${indexPath}`);
      return res.status(404).json({ error: "index.html not found" });
    }
    res.sendFile(indexPath);
  });
}

