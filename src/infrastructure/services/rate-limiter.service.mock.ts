import { RateLimitError } from '@/src/entities/errors/auth';
import { RateLimitPolicy } from '@/src/entities/models/rate-limit';
import { IRateLimiterService } from '@/src/application/services/rate-limiter.service.interface';

export class MockRateLimiterService implements IRateLimiterService {
  private _counters: Map<string, { count: number; expiresAt: number }> =
    new Map();

  async check(policy: RateLimitPolicy, key: string): Promise<void> {
    const entry = this._read(policy, key);

    if (!entry || entry.count < policy.limit) {
      return;
    }

    throw new RateLimitError(
      `Rate limit exceeded for ${policy.bucket}`,
      Math.ceil((entry.expiresAt - Date.now()) / 1000)
    );
  }

  async consume(policy: RateLimitPolicy, key: string): Promise<void> {
    const entry = this._read(policy, key);

    if (entry) {
      entry.count += 1;
      return;
    }

    this._counters.set(buildKey(policy, key), {
      count: 1,
      expiresAt: Date.now() + policy.windowSeconds * 1000,
    });
  }

  async reset(policy: RateLimitPolicy, key: string): Promise<void> {
    this._counters.delete(buildKey(policy, key));
  }

  private _read(policy: RateLimitPolicy, key: string) {
    const mapKey = buildKey(policy, key);
    const entry = this._counters.get(mapKey);

    if (!entry) {
      return undefined;
    }

    if (entry.expiresAt <= Date.now()) {
      this._counters.delete(mapKey);
      return undefined;
    }

    return entry;
  }
}

function buildKey(policy: RateLimitPolicy, key: string): string {
  return `rl:${policy.bucket}:${key}`;
}
