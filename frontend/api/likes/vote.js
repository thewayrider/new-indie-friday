import { createClient } from 'redis';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { slug, type } = req.body;
  if (!slug || !type) return res.status(400).json({ error: 'Missing slug or type' });
  if (type !== 'like' && type !== 'dislike') return res.status(400).json({ error: 'Invalid type' });

  const redis = createClient({ url: process.env.REDIS_URL });

  try {
    await redis.connect();
    const key = type === 'like' ? 'likes:' + slug : 'dislikes:' + slug;
    const newCount = await redis.incr(key);
    const otherKey = type === 'like' ? 'dislikes:' + slug : 'likes:' + slug;
    const otherCount = await redis.get(otherKey) || 0;
    await redis.disconnect();

    return res.status(200).json({
      likes: type === 'like' ? newCount : parseInt(otherCount),
      dislikes: type === 'dislike' ? newCount : parseInt(otherCount),
    });
  } catch (err) {
    console.error('Redis error:', err);
    await redis.disconnect().catch(() => {});
    return res.status(500).json({ error: 'Failed to record vote' });
  }
}