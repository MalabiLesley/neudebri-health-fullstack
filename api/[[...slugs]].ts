import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Vercel's serverless functions need explicit async handling
  try {
    return app(req as any, res as any);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

