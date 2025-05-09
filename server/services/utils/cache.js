import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export const setCache = async (key, data, ttl = 3600) => {
  await redis.set(key, JSON.stringify(data), 'EX', ttl);
};

export const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

export default redis;
