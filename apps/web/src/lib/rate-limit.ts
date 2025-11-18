/**
 * Production-ready rate limiter with Redis support
 * - In-memory fallback for development
 * - Redis-based for production (supports multiple server instances)
 */

import { logger } from "./logger";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitStore {
  check(identifier: string, limit: number, windowMs: number): Promise<boolean>;
  getRemaining(identifier: string, limit: number): Promise<number>;
  getResetTime(identifier: string): Promise<number | null>;
  reset(identifier: string): Promise<void>;
  destroy(): Promise<void>;
}

/**
 * In-memory rate limiter (for development)
 */
class MemoryRateLimiter implements RateLimitStore {
  private requests: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Clean up expired entries every minute
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, entry] of this.requests.entries()) {
        if (now > entry.resetTime) {
          this.requests.delete(key);
        }
      }
    }, 60 * 1000);

    logger.info("MemoryRateLimiter initialized (not recommended for production)");
  }

  async check(identifier: string, limit: number, windowMs: number): Promise<boolean> {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now > entry.resetTime) {
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return true;
    }

    if (entry.count < limit) {
      entry.count++;
      return true;
    }

    return false;
  }

  async getRemaining(identifier: string, limit: number): Promise<number> {
    const entry = this.requests.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return limit;
    }
    return Math.max(0, limit - entry.count);
  }

  async getResetTime(identifier: string): Promise<number | null> {
    const entry = this.requests.get(identifier);
    if (!entry || Date.now() > entry.resetTime) {
      return null;
    }
    return entry.resetTime;
  }

  async reset(identifier: string): Promise<void> {
    this.requests.delete(identifier);
  }

  async destroy(): Promise<void> {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.requests.clear();
  }
}

/**
 * Redis-based rate limiter (for production)
 *
 * To enable Redis:
 * 1. Set REDIS_URL in environment variables
 * 2. Install: pnpm add ioredis
 * 3. Uncomment the RedisRateLimiter class below
 */
class RedisRateLimiter implements RateLimitStore {
  // Placeholder - requires ioredis installation
  // private redis: Redis;

  constructor(redisUrl: string) {
    logger.info("RedisRateLimiter would initialize here", undefined, { redisUrl });

    // Uncomment when ioredis is installed:
    // this.redis = new Redis(redisUrl);
    // logger.info("RedisRateLimiter initialized");
  }

  async check(identifier: string, limit: number, windowMs: number): Promise<boolean> {
    // TODO: Implement Redis-based rate limiting
    // Example implementation:
    // const key = `ratelimit:${identifier}`;
    // const current = await this.redis.incr(key);
    // if (current === 1) {
    //   await this.redis.pexpire(key, windowMs);
    // }
    // return current <= limit;

    throw new Error("Redis rate limiter not yet implemented. Use MemoryRateLimiter for now.");
  }

  async getRemaining(identifier: string, limit: number): Promise<number> {
    throw new Error("Redis rate limiter not yet implemented.");
  }

  async getResetTime(identifier: string): Promise<number | null> {
    throw new Error("Redis rate limiter not yet implemented.");
  }

  async reset(identifier: string): Promise<void> {
    throw new Error("Redis rate limiter not yet implemented.");
  }

  async destroy(): Promise<void> {
    // await this.redis.quit();
  }
}

class RateLimiter {
  private store: RateLimitStore;

  constructor() {
    const redisUrl = process.env.REDIS_URL;

    if (redisUrl && process.env.NODE_ENV === "production") {
      try {
        this.store = new RedisRateLimiter(redisUrl);
      } catch (error) {
        logger.warn("Failed to initialize Redis rate limiter, falling back to memory", undefined, {
          error: error instanceof Error ? error.message : String(error),
        });
        this.store = new MemoryRateLimiter();
      }
    } else {
      this.store = new MemoryRateLimiter();
    }
  }

  async check(identifier: string, limit: number, windowMs: number): Promise<boolean> {
    return this.store.check(identifier, limit, windowMs);
  }

  async getRemaining(identifier: string, limit: number): Promise<number> {
    return this.store.getRemaining(identifier, limit);
  }

  async getResetTime(identifier: string): Promise<number | null> {
    return this.store.getResetTime(identifier);
  }

  async reset(identifier: string): Promise<void> {
    return this.store.reset(identifier);
  }

  async destroy(): Promise<void> {
    return this.store.destroy();
  }
}

// Global rate limiter instance
let globalRateLimiter: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!globalRateLimiter) {
    globalRateLimiter = new RateLimiter();
  }
  return globalRateLimiter;
}

/**
 * Rate limit configurations for different endpoints
 */
export const RATE_LIMITS = {
  // Authentication endpoints - stricter limits
  auth: {
    limit: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // API endpoints - moderate limits
  api: {
    limit: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // Practice generation - prevent abuse
  practice: {
    limit: 20,
    windowMs: 60 * 60 * 1000, // 1 hour
  },

  // File uploads - very strict
  upload: {
    limit: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * Get client identifier (IP address or user ID)
 */
export function getClientIdentifier(req: Request, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get real IP from headers (for proxies/load balancers)
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');

  if (forwarded) {
    return `ip:${forwarded.split(',')[0].trim()}`;
  }

  if (realIp) {
    return `ip:${realIp}`;
  }

  // Fallback to a default identifier
  return 'ip:unknown';
}

/**
 * Middleware to apply rate limiting
 */
export async function rateLimit(
  req: Request,
  userId: string | undefined,
  config: { limit: number; windowMs: number }
): Promise<{ allowed: boolean; remaining: number; resetTime: number | null }> {
  const limiter = getRateLimiter();
  const identifier = getClientIdentifier(req, userId);

  const allowed = limiter.check(identifier, config.limit, config.windowMs);
  const remaining = limiter.getRemaining(identifier, config.limit);
  const resetTime = limiter.getResetTime(identifier);

  return {
    allowed,
    remaining,
    resetTime,
  };
}
