import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { siteMetadata } from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Fallback only — every real route sets its own metadata via
// buildMetadata() (lib/seo.ts). This used to be the site's actual
// default ("mrdoge-ui — Components for sports betting apps", a leftover
// from before mrdoge-co and mrdoge-ui merged into this repo) and leaked
// onto "/" and "/ui" since neither set metadata of its own.
export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.url),
  title: "Mr. Doge | Sports Odds API with AI Predictions",
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
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
