export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Basic environment check
  const envCheck = {
    nodeEnv: process.env.NODE_ENV || 'not set',
    mongodbUri: process.env.MONGODB_URI ? 'set (starts with: ' + process.env.MONGODB_URI.substring(0, 10) + '...)' : 'not set',
    vercelEnv: process.env.VERCEL_ENV || 'not set',
    vercelRegion: process.env.VERCEL_REGION || 'not set'
  };

  return res.status(200).json({
    message: "Connection test endpoint",
    timestamp: new Date().toISOString(),
    environment: envCheck,
    headers: req.headers
  });
}
