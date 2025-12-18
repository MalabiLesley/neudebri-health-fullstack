import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/static";
import { createServer } from "http";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

let initialized = false;

function initializeApp() {
  if (initialized) return;

  try {
    const httpServer = createServer(app);
    registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error(`[API Error] ${status}: ${message}`, err);
      res.status(status).json({ message });
    });

    // Serve static files
    serveStatic(app);
    
    initialized = true;
    console.log("[API] App initialized successfully");
  } catch (err) {
    console.error("[API] Failed to initialize app:", err);
  }
}

// Initialize on first request
app.use((req, res, next) => {
  initializeApp();
  next();
});

// Export the Express app directly for Vercel
export default app;

