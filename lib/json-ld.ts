import { absoluteUrl, siteMetadata } from "@/lib/seo"

// Plain {label,url} list, not imported from components/marketing/footer.tsx:
// that file's SOCIAL_LINKS is bound to react-icons components for
// rendering, a different shape/purpose than this plain data list.
const SOCIAL_URLS = [
  "https://github.com/mrdogeco",
  "https://www.reddit.com/r/mrdoge/",
  "https://x.com/mrdogeapp",
  "https://www.linkedin.com/company/mrdoge/",
  "https://www.instagram.com/mrdoge.ai/",
]

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteMetadata.name,
    url: siteMetadata.url,
    logo: absoluteUrl("/assets/mrdoge-logo-dark.svg"),
    sameAs: SOCIAL_URLS,
  }
}

export function softwareApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${siteMetadata.name} SDK`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    url: absoluteUrl("/docs"),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "7-day free trial on every paid tier",
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

function titleCaseSegment(segment: string): string {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

/** Breadcrumb items for a docs page, one per URL segment (e.g. "/docs/ui/match-card" -> Docs > Ui > match card's real title). */
export function docsBreadcrumbItems(pageUrl: string, title: string): { name: string; path: string }[] {
  const segments = pageUrl.split("/").filter(Boolean)
  let path = ""
  return segments.map((segment, index) => {
    path += `/${segment}`
    const isLast = index === segments.length - 1
    return { name: isLast ? title : titleCaseSegment(segment), path }
  })
}

export function blogPostingJsonLd({
  title,
  description,
  path,
  date,
  author,
  image,
}: {
  title: string
  description: string
  path: string
  date: string
  author?: string
  image: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url: absoluteUrl(path),
    datePublished: date,
    image: absoluteUrl(image),
    author: { "@type": "Organization", name: author ?? siteMetadata.name },
    publisher: {
      "@type": "Organization",
      name: siteMetadata.name,
      logo: { "@type": "ImageObject", url: absoluteUrl("/assets/mrdoge-logo-dark.svg") },
    },
  }
}

interface FaqCategory {
  category: string
  questions: { question: string; answer: string }[]
}

export function faqPageJsonLd(categories: FaqCategory[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: categories.flatMap((category) =>
      category.questions.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      }))
    ),
  }
}
