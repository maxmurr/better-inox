import Redis from 'ioredis';

declare global {
  var __redisClient: Redis | undefined;
}

function createClient(): Redis {
  const url = process.env.REDIS_URL;

  if (!url) {
    throw new Error('REDIS_URL is not set');
  }

  const client = new Redis(url, {
    family: 0,
    lazyConnect: true,
    connectTimeout: 1_000,
    commandTimeout: 500,
    maxRetriesPerRequest: 1,
  });

  client.on('error', () => {});

  return client;
}

export function getRedis(): Redis {
  globalThis.__redisClient ??= createClient();
  return globalThis.__redisClient;
}
