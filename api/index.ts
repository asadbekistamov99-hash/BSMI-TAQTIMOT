import { createServerApp } from '../server.js';

let cachedApp: any = null;

export default async function handler(req: any, res: any) {
  // Set headers for serverless environment
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (!cachedApp) {
      cachedApp = await createServerApp();
    }
    return cachedApp(req, res);
  } catch (error: any) {
    console.error("Vercel Serverless Function Error:", error);
    res.status(500).json({ error: "Serverless execution failed", details: error?.message || String(error) });
  }
}
