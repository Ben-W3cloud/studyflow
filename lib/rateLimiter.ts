const windows = new Map<string, { count: number; start: number }>();

const DEFAULT_LIMIT = Number(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE) || 60;
const WINDOW_MS = 60_000;

export function isRateLimited(key: string, limit = DEFAULT_LIMIT): boolean {
  const now = Date.now();
  const entry = windows.get(key);

  if (!entry) {
    windows.set(key, { count: 1, start: now });
    return false;
  }

  if (now - entry.start > WINDOW_MS) {
    windows.set(key, { count: 1, start: now });
    return false;
  }

  entry.count += 1;
  if (entry.count > limit) return true;
  return false;
}
