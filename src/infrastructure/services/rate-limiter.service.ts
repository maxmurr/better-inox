import { z } from 'zod';

import { RateLimitError } from '@/src/entities/errors/auth';
import { RateLimitPolicy } from '@/src/entities/models/rate-limit';
import type { ICrashReporterService } from '@/src/application/services/crash-reporter.service.interface';
import type { IInstrumentationService } from '@/src/application/services/instrumentation.service.interface';
import { IRateLimiterService } from '@/src/application/services/rate-limiter.service.interface';

import { getRedis } from '@/redis';

export class RateLimiterService implements IRateLimiterService {
  constructor(
    private readonly instrumentationService: IInstrumentationService,
    private readonly crashReporterService: ICrashReporterService
  ) {}

  async check(policy: RateLimitPolicy, key: string): Promise<void> {
    const state = await this.instrumentationService.startSpan(
      {
        name: 'RateLimiterService > check',
        attributes: { bucket: policy.bucket },
      },
      () =>
        this.failOpen(async () => {
          const redisKey = buildKey(policy, key);
          const replies = await getRedis()
            .multi()
            .get(redisKey)
            .ttl(redisKey)
            .exec();

          return readReplies(replies);
        })
    );

    if (!state || state.count < policy.limit) {
      return;
    }

    throw new RateLimitError(
      `Rate limit exceeded for ${policy.bucket}`,
      state.ttl > 0 ? state.ttl : policy.windowSeconds
    );
  }

  async consume(policy: RateLimitPolicy, key: string): Promise<void> {
    await this.instrumentationService.startSpan(
      {
        name: 'RateLimiterService > consume',
        attributes: { bucket: policy.bucket },
      },
      () =>
        this.failOpen(async () => {
          const redisKey = buildKey(policy, key);
          const replies = await getRedis()
            .multi()
            .incr(redisKey)
            .expire(redisKey, policy.windowSeconds, 'NX')
            .exec();

          validateRedisReplies(replies);
          return null;
        })
    );
  }

  async reset(policy: RateLimitPolicy, key: string): Promise<void> {
    await this.instrumentationService.startSpan(
      {
        name: 'RateLimiterService > reset',
        attributes: { bucket: policy.bucket },
      },
      () =>
        this.failOpen(async () => {
          await getRedis().del(buildKey(policy, key));
          return null;
        })
    );
  }

  private async failOpen<T>(operation: () => Promise<T>): Promise<T | null> {
    try {
      return await operation();
    } catch (err) {
      this.crashReporterService.report(err);
      return null;
    }
  }
}

function buildKey(policy: RateLimitPolicy, key: string): string {
  return `rl:${policy.bucket}:${key}`;
}

type RedisReplies = [error: Error | null, result: unknown][] | null;

type RateLimitState = {
  count: number;
  ttl: number;
};

const redisCountSchema = z.coerce.number().int().nonnegative();
const redisTtlSchema = z.coerce.number().int();

function validateRedisReplies(
  replies: RedisReplies
): NonNullable<RedisReplies> {
  if (!replies) {
    throw new Error('Redis transaction was aborted');
  }

  for (const [err] of replies) {
    if (err) {
      throw err;
    }
  }

  return replies;
}

function readReplies(replies: RedisReplies): RateLimitState {
  const [countReply, ttlReply] = validateRedisReplies(replies);

  return {
    count: redisCountSchema.parse(countReply?.[1] ?? 0),
    ttl: redisTtlSchema.parse(ttlReply?.[1] ?? 0),
  };
}
