// Slim launch-day announcement strip, above the hero. The badge is a
// live SVG from Product Hunt's own CDN (vote count updates in place) —
// a plain <img>, not next/image, so it's never cached/optimized stale.
// Pull this once the launch has run its course.
export function ProductHuntBanner() {
  return (
    <div className="mb-6 flex justify-center sm:mb-8">
      <a
        href="https://www.producthunt.com/products/mr-doge?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-mr-doge"
        target="_blank"
        rel="noopener noreferrer"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- live vote-count SVG from Product Hunt's CDN, must not go through Next's image optimizer/cache */}
        <img
          alt="Mr. Doge - AI-powered sports development kit. | Product Hunt"
          width={190}
          height={41}
          className="h-auto w-36 sm:w-[190px]"
          src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1220505&theme=dark&t=1786460369605"
        />
      </a>
    </div>
  )
}
