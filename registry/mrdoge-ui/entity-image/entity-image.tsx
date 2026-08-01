"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

export interface EntityImageProps {
  src?: string | null
  /** Used for the alt text and the initials fallback. */
  name: string
  size?: "sm" | "default" | "lg"
  className?: string
}

const sizeClass: Record<NonNullable<EntityImageProps["size"]>, string> = {
  sm: "size-5",
  default: "size-8",
  lg: "size-10",
}

/**
 * Just the image — no background, border, or corner radius, so team crests
 * and region flags render at their native shape. Pass a `className` (e.g.
 * `size-6`) to override the size; it takes precedence over `size`.
 */
export function EntityImage({ src, name, size = "default", className }: EntityImageProps) {
  const [errored, setErrored] = useState(false)

  if (!src || errored) {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-muted text-[0.6rem] font-medium text-muted-foreground",
          sizeClass[size],
          className
        )}
      >
        {name.slice(0, 2).toUpperCase()}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- framework-agnostic registry component, no next/image dependency
    <img
      src={src}
      alt={name}
      className={cn("shrink-0 object-contain", sizeClass[size], className)}
      onError={() => setErrored(true)}
    />
  )
}
