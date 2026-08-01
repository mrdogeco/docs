import { cn } from "@/lib/utils"

export function ComponentPreview({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "not-prose flex items-center justify-center rounded-lg border bg-background p-8",
        className
      )}
    >
      {children}
    </div>
  )
}
