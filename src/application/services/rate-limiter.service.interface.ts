import { RateLimitPolicy } from '@/src/entities/models/rate-limit';

export interface IRateLimiterService {
  check(policy: RateLimitPolicy, key: string): Promise<void>;
  consume(policy: RateLimitPolicy, key: string): Promise<void>;
  reset(policy: RateLimitPolicy, key: string): Promise<void>;
}
