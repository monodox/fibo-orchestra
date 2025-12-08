// Simple in-memory cache with expiration
const cache = new Map<string, { data: any; expires: number }>();

export const cacheGet = (key: string): any | null => {
  const item = cache.get(key);
  if (!item) return null;
  
  if (Date.now() > item.expires) {
    cache.delete(key);
    return null;
  }
  
  return item.data;
};

export const cacheSet = (key: string, data: any, ttlSeconds: number = 30) => {
  cache.set(key, {
    data,
    expires: Date.now() + ttlSeconds * 1000
  });
};

export const cacheClear = (key?: string) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};
