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
        "not-prose flex items-center justify-center rounded-lg border bg-zinc-50 p-8 dark:bg-zinc-900/40",
        className
      )}
    >
      {children}
    </div>
  )
}
