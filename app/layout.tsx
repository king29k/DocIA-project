import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/lib/theme-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "DocIA - Votre Assistant Santé Intelligent",
  description:
    "DocIA est votre compagnon santé intelligent qui vous accompagne dans vos questions médicales avec des réponses fiables et personnalisées, disponible 24h/24 et 7j/7.",
  keywords: "santé, assistant médical, IA, Douala General Hospital, DocIA, intelligence artificielle, médecine",
  authors: [{ name: "DocIA Team" }],
  openGraph: {
    title: "DocIA - Votre Assistant Santé Intelligent",
    description: "Votre compagnon santé intelligent disponible 24h/24",
    type: "website",
    locale: "fr_FR",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
