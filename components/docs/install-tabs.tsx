import { Tab, Tabs } from "fumadocs-ui/components/tabs"

const RUNNERS = [
  { value: "pnpm", command: "pnpm dlx" },
  { value: "npm", command: "npx" },
  { value: "yarn", command: "yarn dlx" },
  { value: "bun", command: "bunx" },
]

export function InstallTabs({ name }: { name: string }) {
  return (
    <Tabs items={RUNNERS.map((r) => r.value)}>
      {RUNNERS.map((runner) => (
        <Tab key={runner.value} value={runner.value}>
          <pre className="overflow-x-auto rounded-lg bg-fd-secondary p-4 text-sm">
            <code>
              {runner.command} shadcn@latest add https://mrdoge.co/r/{name}.json
            </code>
          </pre>
        </Tab>
      ))}
    </Tabs>
  )
}
