import "server-only"

const SDK_REPO = "mrdogeco/sdk"

/**
 * Live star count for a GitHub repo (defaults to the SDK repo), fetched
 * from GitHub. Cached at the Next.js fetch layer for 1 hour so we stay
 * well below the 60/hr unauthenticated rate limit (and don't hammer the
 * public API on every build/revalidation).
 *
 * Returns `null` on any failure — the button falls back to no-count
 * rather than showing a stale or zero number.
 */
export async function getGithubStarCount(repo: string = SDK_REPO): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    const data = (await res.json()) as { stargazers_count?: unknown }
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null
  } catch {
    return null
  }
}
