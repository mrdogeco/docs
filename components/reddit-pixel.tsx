"use client"

import { Suspense, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Script from "next/script"

const REDDIT_PIXEL_ID = "a2_hxjyfz9e1dk9"

declare global {
  interface Window {
    rdt?: (...args: unknown[]) => void
  }
}

// Re-fires PageVisit on every client-side route change — App Router
// navigations don't reload the page, so the base script's own one-time
// load wouldn't otherwise see them. searchParams is in the dep list too:
// ad-campaign landing pages often differ only by query string (UTM tags,
// Reddit's own click-id param), and those should count as distinct
// visits for attribution. useSearchParams() requires a Suspense boundary
// (see RedditPixel below), a standard App Router constraint.
function PageviewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    window.rdt?.("track", "PageVisit")
  }, [pathname, searchParams])

  return null
}

// Reddit Ads pixel. Pixel ID is public-facing (visible in any page's
// source once loaded), safe to hardcode — same posture as the Vercel
// Analytics script in app/layout.tsx. The "Start Free Trial" / "View
// Documentation" conversion events are configured as no-code "Web
// element events" in Reddit's Ads Manager (matched by button text/CSS
// selector) — Reddit's own script detects those clicks once this base
// pixel is loaded; nothing else to wire up for them here.
export function RedditPixel() {
  return (
    <>
      <Script id="reddit-pixel-base" strategy="afterInteractive">
        {`
          !function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);
          rdt('init','${REDDIT_PIXEL_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <PageviewTracker />
      </Suspense>
    </>
  )
}
