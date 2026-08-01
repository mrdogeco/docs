import "server-only"
import { NextResponse } from "next/server"
import { MrDoge } from "@mrdoge/node"

let client: MrDoge | null = null

function getClient() {
  if (!client) {
    client = new MrDoge({ apiKey: process.env.MRDOGE_ODDS_API_KEY! })
  }
  return client
}

export async function POST() {
  const { token, expiresAt } = await getClient().tokens.create()
  return NextResponse.json({ token, expiresAt })
}
