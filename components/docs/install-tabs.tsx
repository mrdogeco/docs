import fs from "node:fs"
import path from "node:path"
import { Tab, Tabs, TabsTrigger } from "fumadocs-ui/components/tabs"
import { TabsList as RawTabsList } from "fumadocs-ui/components/ui/tabs"
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock"
import registry from "@/registry.json"

const RUNNERS = [
  { value: "pnpm", command: "pnpm dlx", install: "pnpm add" },
  { value: "npm", command: "npx", install: "npm install" },
  { value: "yarn", command: "yarn dlx", install: "yarn add" },
  { value: "bun", command: "bunx", install: "bun add" },
]

function readSource(filePath: string) {
  return fs.readFileSync(path.join(process.cwd(), filePath), "utf-8")
}

export function InstallTabs({ name }: { name: string }) {
  const item = registry.items.find((i) => i.name === name)
  const files = item?.files ?? []
  const registryDeps = item?.registryDependencies ?? []
  const npmDeps = item?.dependencies ?? []
  const envVars = item?.envVars ?? {}
  const envVarNames = Object.keys(envVars)

  return (
    <Tabs defaultValue="command" className="my-0 rounded-none border-none bg-transparent p-0">
      <RawTabsList className="flex gap-3.5 overflow-x-auto pr-4 text-fd-secondary-foreground not-prose">
        <TabsTrigger value="command">Command</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </RawTabsList>
      <Tab value="Command" className="bg-transparent p-0">
        <div className="flex flex-col gap-3 pt-3">
          <Tabs items={RUNNERS.map((r) => r.value)} className="my-0">
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
          {envVarNames.length > 0 ? (
            <p className="text-sm text-fd-muted-foreground">
              Also requires {envVarNames.map((v) => <code key={v}>{v}</code>)} — set it in your
              own environment after installing.
            </p>
          ) : null}
        </div>
      </Tab>
      <Tab value="Manual" className="bg-transparent p-0">
        <div className="flex flex-col gap-4">
          {npmDeps.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-fd-muted-foreground">Install the following dependencies:</p>
              <Tabs items={RUNNERS.map((r) => r.value)} className="my-0">
                {RUNNERS.map((runner) => (
                  <Tab key={runner.value} value={runner.value}>
                    <pre className="overflow-x-auto rounded-lg bg-fd-secondary p-4 text-sm">
                      <code>
                        {runner.install} {npmDeps.join(" ")}
                      </code>
                    </pre>
                  </Tab>
                ))}
              </Tabs>
            </div>
          ) : null}
          {registryDeps.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-fd-muted-foreground">
                Install the shadcn/ui primitives this component depends on:
              </p>
              <pre className="overflow-x-auto rounded-lg bg-fd-secondary p-4 text-sm">
                <code>npx shadcn@latest add {registryDeps.join(" ")}</code>
              </pre>
            </div>
          ) : null}
          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-fd-muted-foreground">
              Copy and paste the following file{files.length > 1 ? "s" : ""} into your project:
            </p>
            <div className="flex flex-col gap-3">
              {files.map((file) => (
                <DynamicCodeBlock
                  key={file.path}
                  lang="tsx"
                  code={readSource(file.path)}
                  codeblock={{
                    title: "target" in file && file.target ? file.target : file.path.split("/").pop(),
                  }}
                />
              ))}
            </div>
          </div>
          {envVarNames.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-fd-muted-foreground">
                Set the following environment variable{envVarNames.length > 1 ? "s" : ""}:
              </p>
              <pre className="overflow-x-auto rounded-lg bg-fd-secondary p-4 text-sm">
                <code>{envVarNames.map((v) => `${v}=`).join("\n")}</code>
              </pre>
            </div>
          ) : null}
        </div>
      </Tab>
    </Tabs>
  )
}
