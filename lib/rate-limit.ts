import "server-only"

// In-memory, per-instance limiter — imperfect across multiple serverless
// replicas (each has its own memory), but a real floor against naive
// scraping/abuse with zero new infra. For a stronger guarantee, put the
// route behind Vercel Firewall or Cloudflare Rate Limiting too — this is
// meant as defense in depth, not a replacement for that.
const hits = new Map<string, { count: number; resetAt: number }>()

// Sweep expired entries occasionally so `hits` doesn't grow unbounded
// across the life of a warm instance.
let lastSweep = Date.now()
function sweep(now: number) {
  if (now - lastSweep < 60_000) return
  lastSweep = now
  for (const [key, entry] of hits) {
    if (now > entry.resetAt) hits.delete(key)
  }
}

export function isRateLimited(key: string, { windowMs = 60_000, max = 20 } = {}): boolean {
  const now = Date.now()
  sweep(now)

  const entry = hits.get(key)
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  entry.count++
  return entry.count > max
}
