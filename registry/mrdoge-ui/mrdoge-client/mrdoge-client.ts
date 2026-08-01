import { MrDoge } from "@mrdoge/client"

let client: MrDoge | null = null

/** Browser-only — the SDK authenticates via short-lived tokens minted at /api/mrdoge/token, never a raw API key. */
export function getMrDogeClient() {
  if (typeof window === "undefined") {
    throw new Error("getMrDogeClient() must be called in the browser")
  }
  if (!client) {
    client = new MrDoge({ authEndpoint: "/api/mrdoge/token" })
  }
  return client
}
