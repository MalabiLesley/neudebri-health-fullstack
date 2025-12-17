import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

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

async function initializeApp() {
  if (initialized) return;

  try {
    await registerRoutes(httpServer, app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Serve static files
    serveStatic(app);
    
    initialized = true;
  } catch (err) {
    console.error("Failed to initialize app:", err);
    throw err;
  }
}

// Export for Vercel serverless handler
export default async (req: Request, res: Response) => {
  await initializeApp();
  app(req, res);
};

