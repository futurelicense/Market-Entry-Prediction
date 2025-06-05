interface TokenBucket {
  tokens: number;
  lastRefill: number;
  capacity: number;
  refillRate: number;
}
export class RateLimiter {
  private static instance: RateLimiter;
  private buckets: Map<string, TokenBucket>;
  private constructor() {
    this.buckets = new Map();
  }
  static getInstance(): RateLimiter {
    if (!RateLimiter.instance) {
      RateLimiter.instance = new RateLimiter();
    }
    return RateLimiter.instance;
  }
  initBucket(key: string, capacity: number, refillInterval: number): void {
    if (!this.buckets.has(key)) {
      this.buckets.set(key, {
        tokens: capacity,
        lastRefill: Date.now(),
        capacity,
        refillRate: capacity / refillInterval
      });
    }
  }
  async tryAcquire(key: string): Promise<boolean> {
    const bucket = this.buckets.get(key);
    if (!bucket) return false;
    this.refillTokens(bucket);
    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }
    // Calculate wait time until next token
    const waitTime = 1 / bucket.refillRate * 1000;
    await new Promise(resolve => setTimeout(resolve, waitTime));
    return this.tryAcquire(key);
  }
  private refillTokens(bucket: TokenBucket): void {
    const now = Date.now();
    const timePassed = now - bucket.lastRefill;
    const tokensToAdd = timePassed * bucket.refillRate;
    bucket.tokens = Math.min(bucket.capacity, bucket.tokens + tokensToAdd);
    bucket.lastRefill = now;
  }
}