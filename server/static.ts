import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // Try multiple possible paths for public directory
  const possiblePaths = [
    // For Vercel production
    path.join(process.cwd(), "dist", "public"),
    // For local production
    path.resolve(__dirname, "..", "dist", "public"),
    // Fallback
    path.resolve(__dirname, "..", "public"),
  ];

  console.log(`[Static] CWD: ${process.cwd()}`);
  console.log(`[Static] __dirname: ${__dirname}`);
  console.log(`[Static] Looking for public files...`);
  let distPath: string | null = null;
  
  for (const p of possiblePaths) {
    const exists = fs.existsSync(p);
    console.log(`[Static] ${exists ? "✓" : "✗"} ${p}`);
    if (exists && fs.existsSync(path.join(p, "index.html"))) {
      distPath = p;
      console.log(`[Static] ✓ Found index.html, using: ${distPath}`);
      break;
    }
  }

  if (!distPath) {
    console.error(`[Static] ✗ Could not find public directory with index.html`);
    console.error("[Static] Available files in process.cwd():");
    try {
      const files = fs.readdirSync(process.cwd());
      console.error(files);
    } catch (e) {
      console.error("Could not read directory");
    }
    
    // Still set up error route so we don't crash
    app.use("*", (req, res) => {
      res.status(404).json({ 
        error: "Static files not found. dist/public/index.html missing.",
        cwd: process.cwd(),
        nodeEnv: process.env.NODE_ENV
      });
    });
    return;
  }

  // Serve static files with proper cache headers
  app.use(express.static(distPath, {
    maxAge: "1d",
    etag: true,
    lastModified: true,
    setHeaders: (res, filepath) => {
      // Cache JavaScript and CSS for a long time
      if (filepath.endsWith('.js') || filepath.endsWith('.css')) {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
      // Don't cache HTML
      else if (filepath.endsWith('.html')) {
        res.set('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    }
  }));

  // SPA fallback - serve index.html for all non-file routes
  app.use("*", (req, res) => {
    const indexPath = path.join(distPath!, "index.html");
    console.log(`[Static] SPA fallback for ${req.path} -> ${indexPath}`);
    if (!fs.existsSync(indexPath)) {
      console.error(`[Static] index.html not found at ${indexPath}`);
      return res.status(404).json({ error: "index.html not found" });
    }
    res.set('Cache-Control', 'public, max-age=0, must-revalidate');
    res.sendFile(indexPath);
  });
}

