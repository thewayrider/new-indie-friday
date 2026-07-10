const { createClient } = require('@upstash/redis');

const redis = createClient({
  url: process.env.REDIS_URL,
});

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { slug } = req.query;
  if (!slug) return res.status(400).json({ error: 'Missing slug' });

  try {
    const likes = await redis.get('likes:' + slug) || 0;
    const dislikes = await redis.get('dislikes:' + slug) || 0;
    return res.status(200).json({ likes: parseInt(likes), dislikes: parseInt(dislikes) });
  } catch (err) {
    console.error('Redis error:', err);
    return res.status(500).json({ error: 'Failed to fetch counts' });
  }
};