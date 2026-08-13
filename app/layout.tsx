import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Analytics } from "@vercel/analytics/next";
import { siteMetadata } from "@/lib/seo";
import { organizationJsonLd, softwareApplicationJsonLd } from "@/lib/json-ld";
import { JsonLd } from "@/components/json-ld";
import { RedditPixel } from "@/components/reddit-pixel";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: "Mr. Doge | Sports Data API, AI Predictions and Open-source components",
  description:
    "Real-time sports odds, live match data, and AI-powered predictions via a typed SDK with native WebSocket support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={[organizationJsonLd(), softwareApplicationJsonLd()]} />
        <RootProvider>{children}</RootProvider>
        <Analytics />
        <RedditPixel />
      </body>
    </html>
  );
}
