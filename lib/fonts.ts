import { Bungee } from "next/font/google"

// Same display font as mrdoge.ai's /developers hero — used sparingly,
// just for the gradient headline treatment, not the whole site.
export const bungee = Bungee({
  variable: "--font-bungee",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
})
