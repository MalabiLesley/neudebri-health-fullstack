import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/index';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle both VercelRequest/Response and Express request/response
  return new Promise<void>((resolve) => {
    app(req as any, res as any);
    res.on('finish', () => resolve());
  });
}
