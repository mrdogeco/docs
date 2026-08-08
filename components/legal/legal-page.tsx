import Link from "next/link"

export interface LegalSubsection {
  id: string
  title: string
  content?: string
  items?: string[]
  note?: string
}

export interface LegalSection {
  id: string
  title: string
  content?: string
  items?: string[]
  note?: string
  contact?: { email: string; support?: string; website: string }
  subsections?: LegalSubsection[]
}

export interface LegalData {
  title: string
  lastUpdated: string
  noticeTitle: string
  noticeText: string
  sections: LegalSection[]
}

// Shared by /terms and /privacy — same table-of-contents + numbered-section
// shape, ported from old_mrdoge-co's terms/privacy pages (which had this
// duplicated inline in each page.tsx).
export function LegalPage({ data }: { data: LegalData }) {
  const { title, lastUpdated, noticeTitle, noticeText, sections } = data

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-16">
      <h1 className="text-center text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
      <p className="mt-4 text-center text-sm text-muted-foreground">Last updated: {lastUpdated}</p>

      <div className="mt-10 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-6">
        <p className="text-sm font-semibold text-amber-600 dark:text-amber-400">{noticeTitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">{noticeText}</p>
      </div>

      <nav className="mt-8 rounded-2xl border bg-muted/50 p-6">
        <h2 className="text-sm font-semibold tracking-wide uppercase">Table of contents</h2>
        <ol className="mt-4 list-inside list-decimal space-y-2 text-sm">
          {sections.map((section) => (
            <li key={section.id}>
              <Link href={`#${section.id}`} className="text-foreground underline-offset-4 hover:underline">
                {section.title}
              </Link>
              {section.subsections && (
                <ol className="mt-2 ml-6 list-inside list-decimal space-y-1">
                  {section.subsections.map((sub) => (
                    <li key={sub.id}>
                      <Link href={`#${sub.id}`} className="text-muted-foreground hover:text-foreground">
                        {sub.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 flex flex-col gap-12">
        {sections.map((section, i) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h2 className="text-2xl font-semibold tracking-tight">
              {i + 1}. {section.title}
            </h2>

            {section.content && <p className="mt-4 leading-relaxed text-muted-foreground">{richText(section.content)}</p>}

            {section.items && (
              <ul className="mt-4 ml-4 list-outside list-disc space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="text-muted-foreground">
                    {richText(item)}
                  </li>
                ))}
              </ul>
            )}

            {section.note && (
              <p className="mt-4 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground italic">{richText(section.note)}</p>
            )}

            {section.contact && (
              <div className="mt-4 flex flex-col gap-1.5 rounded-lg bg-muted/50 p-4 text-sm">
                <p>
                  <strong>{section.contact.support ? "Privacy email" : "Email"}:</strong>{" "}
                  <a href={`mailto:${section.contact.email}`} className="text-foreground underline underline-offset-4">
                    {section.contact.email}
                  </a>
                </p>
                {section.contact.support && (
                  <p>
                    <strong>Support email:</strong>{" "}
                    <a href={`mailto:${section.contact.support}`} className="text-foreground underline underline-offset-4">
                      {section.contact.support}
                    </a>
                  </p>
                )}
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={section.contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground underline underline-offset-4"
                  >
                    {section.contact.website}
                  </a>
                </p>
              </div>
            )}

            {section.subsections && (
              <div className="mt-6 ml-4 flex flex-col gap-6">
                {section.subsections.map((sub, j) => (
                  <div key={sub.id} id={sub.id} className="scroll-mt-24">
                    <h3 className="text-lg font-semibold">
                      {i + 1}.{j + 1} {sub.title}
                    </h3>
                    {sub.content && <p className="mt-2 leading-relaxed text-muted-foreground">{richText(sub.content)}</p>}
                    {sub.items && (
                      <ul className="mt-2 ml-4 list-outside list-disc space-y-2">
                        {sub.items.map((item) => (
                          <li key={item} className="text-muted-foreground">
                            {richText(item)}
                          </li>
                        ))}
                      </ul>
                    )}
                    {sub.note && (
                      <p className="mt-2 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground italic">{richText(sub.note)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {i < sections.length - 1 && <hr className="mt-8 border-border" />}
          </section>
        ))}
      </div>
    </div>
  )
}

// Only `**bold**` is used anywhere in the actual section content.
function richText(value: string) {
  return value.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-foreground">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  )
}
