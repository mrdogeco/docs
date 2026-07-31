import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface EntityImageProps {
  src?: string | null
  /** Used for the alt text and the initials fallback. */
  name: string
  size?: "sm" | "default" | "lg"
  className?: string
}

export function EntityImage({ src, name, size = "default", className }: EntityImageProps) {
  return (
    <Avatar size={size} className={className}>
      <AvatarImage src={src ?? undefined} alt={name} />
      <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
