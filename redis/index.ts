import Redis from 'ioredis';

import { env } from '@/env';

declare global {
  var __redisClient: Redis | undefined;
}

function createClient(): Redis {
  const client = new Redis(env.REDIS_URL, {
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
