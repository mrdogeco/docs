import "server-only"
import { NextResponse } from "next/server"
import { MrDoge } from "@mrdoge/node"
import { isRateLimited } from "@/lib/rate-limit"

let client: MrDoge | null = null

function getClient() {
  if (!client) {
    client = new MrDoge({ apiKey: process.env.MRDOGE_ODDS_API_KEY! })
  }
  return client
}

// This site has no user sessions to gate on (public docs/demo widgets),
// so this follows the SDK's own documented "anonymous public widget"
// pattern (see content/docs/(sdk)/authentication.mdx): rate-limit instead
// of a session check, and keep the minted token's blast radius short.
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const { token, expiresAt } = await getClient().tokens.create({ ttl: 300 })
  return NextResponse.json({ token, expiresAt })
}
