import type { VercelRequest, VercelResponse } from '@vercel/node';

// Import and cache the app instance
let app: any = null;

async function getApp() {
  if (!app) {
    const { default: expressApp } = await import('../server/index');
    app = expressApp;
  }
  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const expressApp = await getApp();
    
    // Call the Express app
    // Express middleware will handle initialization
    return expressApp(req as any, res as any);
  } catch (error) {
    console.error('API handler error:', error);
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

