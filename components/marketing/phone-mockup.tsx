import { cn } from "@/lib/utils"

// Ported verbatim from mrdoge-ai's components/marketing/phone-mockup.tsx.
export function PhoneMockup({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[9/19.5] w-[min(260px,72vw)] rounded-[3.5rem] border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-2.5 shadow-2xl shadow-black/50",
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2.9rem] bg-[#0b0d10]">{children}</div>
    </div>
  )
}
