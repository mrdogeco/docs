import Link from "next/link"
import { Button } from "@/components/ui/button"

// Rendered at the bottom of every post, outside the MDX body, so the
// funnel (read post -> try components -> try the SDK) doesn't depend on
// each post remembering to link out itself.
export function PostCta() {
  return (
    <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border bg-muted/30 p-8 text-center">
      <h2 className="text-xl font-semibold tracking-tight">Try it yourself</h2>
      <p className="max-w-md text-muted-foreground">
        Free, copy-paste React components for sports apps, or the full SDK behind them — live odds, scores, and AI predictions.
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button asChild>
          <Link href="/ui">Browse components</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/docs">Read the SDK docs</Link>
        </Button>
      </div>
    </div>
  )
}
