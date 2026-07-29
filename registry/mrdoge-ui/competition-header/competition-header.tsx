import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export interface CompetitionHeaderProps {
  name: string
  region?: string
  stage?: string
  logoUrl?: string
  className?: string
}

export function CompetitionHeader({
  name,
  region,
  stage,
  logoUrl,
  className,
}: CompetitionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Avatar className="bg-muted">
        <AvatarImage src={logoUrl} alt={name} />
        <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-medium">{name}</span>
        {region ? (
          <span className="truncate text-xs text-muted-foreground">
            {region}
          </span>
        ) : null}
      </div>
      {stage ? (
        <Badge variant="outline" className="ml-auto">
          {stage}
        </Badge>
      ) : null}
    </div>
  )
}
