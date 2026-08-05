export interface RateLimitPolicy {
  bucket: string;
  limit: number;
  windowSeconds: number;
}
