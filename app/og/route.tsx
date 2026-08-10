import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"

export const runtime = "edge"

const WIDTH = 1200
const HEIGHT = 630
const PINK = "#EC4899"

// Satori doesn't clamp/ellipsize overflowing text, so length is capped
// here rather than relying on CSS.
function truncate(value: string, max: number): string {
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

// Shared branded OG image for every page — see lib/seo.ts's
// ogImagePath()/buildMetadata(). Deliberately uses the default Satori
// font only (no custom font fetch): a request-time Google Fonts fetch is
// a common pattern but an unnecessary build-fragility risk for a template
// that's mostly about layout and color, not typography fidelity.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const title = truncate(searchParams.get("title") ?? "Mr. Doge", 70)
  const description = truncate(searchParams.get("description") ?? "", 130)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0a0a0a",
          backgroundImage: `radial-gradient(circle at 85% 15%, ${PINK}33, transparent 55%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: PINK,
          }}
        >
          Mr. Doge
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 980 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, lineHeight: 1.15, color: "#fafafa" }}>
            {title}
          </div>
          {description && (
            <div style={{ display: "flex", fontSize: 28, color: "#a1a1aa", lineHeight: 1.4 }}>{description}</div>
          )}
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#71717a" }}>mrdoge.co</div>
      </div>
    ),
    {
      width: WIDTH,
      height: HEIGHT,
      headers: {
        "Cache-Control": "public, immutable, max-age=31536000",
      },
    }
  )
}
