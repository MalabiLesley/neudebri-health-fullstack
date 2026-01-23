import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import the Express app
import app from '../server/index';

/**
 * Vercel API handler for all routes
 * Routes everything through the Express server which handles:
 * - Static file serving (from dist/public)
 * - API endpoints (/api/*)
 * - SPA routing fallback (serves index.html for unknown routes)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // The Express app handles both static and API requests
    return app(req as any, res as any);
  } catch (error) {
    console.error('[API Handler] Error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

