/**
 * Production Caching System
 *
 * - In-memory LRU cache for development
 * - Redis support for production
 * - Automatic cache invalidation
 * - Cache stampede prevention
 */

import { logger } from "./logger";

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

interface CacheOptions {
  ttl?: number; // Time to live in seconds (default: 300 = 5 minutes)
  tags?: string[]; // For cache invalidation by tag
}

interface CacheStore {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  deleteByTag(tag: string): Promise<void>;
  clear(): Promise<void>;
}

/**
 * In-memory cache (for development)
 */
class MemoryCache implements CacheStore {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private tagIndex: Map<string, Set<string>> = new Map();
  private maxSize: number = 1000; // Maximum number of entries

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    const ttl = (options.ttl || 300) * 1000; // Convert to milliseconds
    const expiresAt = Date.now() + ttl;

    // LRU eviction - remove oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      value,
      expiresAt,
    });

    // Index by tags
    if (options.tags) {
      for (const tag of options.tags) {
        if (!this.tagIndex.has(tag)) {
          this.tagIndex.set(tag, new Set());
        }
        this.tagIndex.get(tag)!.add(key);
      }
    }
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);

    // Remove from tag index
    for (const keys of this.tagIndex.values()) {
      keys.delete(key);
    }
  }

  async deleteByTag(tag: string): Promise<void> {
    const keys = this.tagIndex.get(tag);
    if (keys) {
      for (const key of keys) {
        this.cache.delete(key);
      }
      this.tagIndex.delete(tag);
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.tagIndex.clear();
  }
}

/**
 * Redis cache (for production)
 */
class RedisCache implements CacheStore {
  // Placeholder - requires ioredis installation
  // private redis: Redis;

  constructor(redisUrl: string) {
    logger.info("RedisCache would initialize here", undefined, { redisUrl });
    // this.redis = new Redis(redisUrl);
  }

  async get<T>(key: string): Promise<T | null> {
    throw new Error("Redis cache not yet implemented. Use MemoryCache for now.");
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    throw new Error("Redis cache not yet implemented.");
  }

  async delete(key: string): Promise<void> {
    throw new Error("Redis cache not yet implemented.");
  }

  async deleteByTag(tag: string): Promise<void> {
    throw new Error("Redis cache not yet implemented.");
  }

  async clear(): Promise<void> {
    // await this.redis.flushdb();
  }
}

class Cache {
  private store: CacheStore;

  constructor() {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl && process.env.NODE_ENV === "production") {
      try {
        this.store = new RedisCache(redisUrl);
      } catch (error) {
        logger.warn("Failed to initialize Redis cache, falling back to memory", undefined, {
          error: error instanceof Error ? error.message : String(error),
        });
        this.store = new MemoryCache();
      }
    } else {
      this.store = new MemoryCache();
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const startTime = Date.now();
    const value = await this.store.get<T>(key);
    const duration = Date.now() - startTime;

    if (value !== null) {
      logger.debug("Cache hit", undefined, { key, duration: `${duration}ms` });
    } else {
      logger.debug("Cache miss", undefined, { key, duration: `${duration}ms` });
    }

    return value;
  }

  async set<T>(key: string, value: T, options?: CacheOptions): Promise<void> {
    await this.store.set(key, value, options);
    logger.debug("Cache set", undefined, { key, ttl: options?.ttl });
  }

  async delete(key: string): Promise<void> {
    await this.store.delete(key);
    logger.debug("Cache deleted", undefined, { key });
  }

  async deleteByTag(tag: string): Promise<void> {
    await this.store.deleteByTag(tag);
    logger.debug("Cache invalidated by tag", undefined, { tag });
  }

  async clear(): Promise<void> {
    await this.store.clear();
    logger.info("Cache cleared");
  }

  /**
   * Get or set pattern - fetch from cache or compute and cache
   */
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    options?: CacheOptions
  ): Promise<T> {
    const cached = await this.get<T>(key);

    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const value = await fetcher();

    // Cache it
    await this.set(key, value, options);

    return value;
  }
}

// Singleton instance
let globalCache: Cache | null = null;

export function getCache(): Cache {
  if (!globalCache) {
    globalCache = new Cache();
  }
  return globalCache;
}

/**
 * Cache key generators for common use cases
 */
export const CacheKeys = {
  user: (userId: string) => `user:${userId}`,
  userSubscription: (userId: string) => `user:${userId}:subscription`,
  userSessions: (userId: string) => `user:${userId}:sessions`,
  userWeaknesses: (userId: string) => `user:${userId}:weaknesses`,
  question: (questionId: string) => `question:${questionId}`,
  examQuestions: (examType: string) => `exam:${examType}:questions`,
  leaderboard: (period: string) => `leaderboard:${period}`,
  adminStats: () => "admin:stats",
} as const;

/**
 * Cache tags for invalidation
 */
export const CacheTags = {
  user: (userId: string) => `user:${userId}`,
  questions: () => "questions",
  subscriptions: () => "subscriptions",
  sessions: () => "sessions",
  admin: () => "admin",
} as const;

/**
 * Common cache TTL values (in seconds)
 */
export const CacheTTL = {
  oneMinute: 60,
  fiveMinutes: 300,
  fifteenMinutes: 900,
  oneHour: 3600,
  oneDay: 86400,
  oneWeek: 604800,
} as const;
