// Vercel serverless function entry point
// This imports and exports the main Express server

import app from "../server/index";

console.log("[API] Module loaded - exporting Express app");

// Export the Express app as the default handler
// Vercel's Node runtime will handle the HTTP protocol conversion
export default app;

