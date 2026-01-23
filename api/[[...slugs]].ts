import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/index';

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Call the Express app directly - it handles async operations
  return app(req as any, res as any);
}

