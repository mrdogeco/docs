import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import { Tab, Tabs } from "fumadocs-ui/components/tabs"
import { Step, Steps } from "fumadocs-ui/components/steps"
import { Card, Cards } from "fumadocs-ui/components/card"
import { Callout } from "fumadocs-ui/components/callout"
import { Accordion, Accordions } from "fumadocs-ui/components/accordion"
import { TypeTable } from "fumadocs-ui/components/type-table"
import { File, Folder, Files } from "fumadocs-ui/components/files"
import { ComponentPreview } from "@/components/docs/component-preview"

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Tab,
    Tabs,
    Step,
    Steps,
    Card,
    Cards,
    Callout,
    Accordion,
    Accordions,
    TypeTable,
    File,
    Folder,
    Files,
    ComponentPreview,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>
}
