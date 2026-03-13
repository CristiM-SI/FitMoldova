/**
 * Lightweight in-memory data cache with TTL support.
 *
 * Usage
 * ─────
 *   const cache = new DataCache()
 *
 *   // Cache result of any async fn for 5 minutes
 *   const data = await cache.get('clubs', () => fetchClubs(), 5 * 60_000)
 *
 * When the app migrates from mock data to real API calls, wrap every fetch
 * inside cache.get() to avoid re-fetching the same data on navigation.
 */

interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export class DataCache {
  private readonly store = new Map<string, CacheEntry<unknown>>()

  /**
   * Returns the cached value for `key` if it is still fresh.
   * Otherwise calls `fetcher`, caches the result for `ttlMs`, and returns it.
   */
  async get<T>(key: string, fetcher: () => Promise<T>, ttlMs = 5 * 60_000): Promise<T> {
    const entry = this.store.get(key) as CacheEntry<T> | undefined
    if (entry && Date.now() < entry.expiresAt) return entry.value

    const value = await fetcher()
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs })
    return value
  }

  /** Synchronous variant for mock / already-resolved data. */
  getSync<T>(key: string, fetcher: () => T, ttlMs = 5 * 60_000): T {
    const entry = this.store.get(key) as CacheEntry<T> | undefined
    if (entry && Date.now() < entry.expiresAt) return entry.value

    const value = fetcher()
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs })
    return value
  }

  invalidate(key: string): void {
    this.store.delete(key)
  }

  clear(): void {
    this.store.clear()
  }
}

/** App-level singleton cache — shared across all components. */
export const appCache = new DataCache()