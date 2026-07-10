import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug, type } = req.body;

  if (!slug || !type) {
    return res.status(400).json({ error: 'Missing slug or type parameter' });
  }

  if (type !== 'like' && type !== 'dislike') {
    return res.status(400).json({ error: 'Type must be like or dislike' });
  }

  try {
    const key = type === 'like' ? 'likes:' + slug : 'dislikes:' + slug;
    const newCount = await redis.incr(key);

    const otherKey = type === 'like' ? 'dislikes:' + slug : 'likes:' + slug;
    const otherCount = await redis.get(otherKey) || 0;

    return res.status(200).json({
      likes: type === 'like' ? newCount : parseInt(otherCount),
      dislikes: type === 'dislike' ? newCount : parseInt(otherCount),
    });
  } catch (err) {
    console.error('Redis error:', err);
    return res.status(500).json({ error: 'Failed to record vote' });
  }
}