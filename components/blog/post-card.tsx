import Link from "next/link"
import Image from "next/image"

export interface PostCardData {
  url: string
  title: string
  description?: string
  date: string
  tags?: string[]
  /** Resolved by the caller — falls back to the auto-generated OG image when a post has no custom one. */
  image: string
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link
      href={post.url}
      className="block overflow-hidden rounded-2xl border transition-colors hover:bg-muted/50"
    >
      <div className="relative aspect-[1200/630] w-full overflow-hidden bg-muted">
        <Image src={post.image} alt="" fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
      </div>
      <div className="p-6">
        <time dateTime={post.date} className="text-sm text-muted-foreground">
          {formatDate(post.date)}
        </time>
        <h2 className="mt-2 text-xl font-semibold tracking-tight">{post.title}</h2>
        {post.description && <p className="mt-2 text-muted-foreground">{post.description}</p>}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
