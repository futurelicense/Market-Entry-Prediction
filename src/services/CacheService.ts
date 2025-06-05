interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}
export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, CacheItem<any>>;
  private constructor() {
    this.cache = new Map();
  }
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }
  set<T>(key: string, data: T, duration: number): void {
    const timestamp = Date.now();
    this.cache.set(key, {
      data,
      timestamp,
      expiry: timestamp + duration
    });
  }
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
  clear(): void {
    this.cache.clear();
  }
  removeExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}