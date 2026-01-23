import type { VercelRequest, VercelResponse } from '@vercel/node';
// Import the CommonJS built server
import app from '../dist/index.cjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}
