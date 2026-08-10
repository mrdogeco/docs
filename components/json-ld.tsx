// Renders one or more JSON-LD objects as a single <script> tag. JSON.stringify
// output only, never user input — safe from the dangerouslySetInnerHTML XSS
// concern that applies to arbitrary HTML.
export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
