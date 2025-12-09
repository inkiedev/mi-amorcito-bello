import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth-guard"

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Nuestro Amor Eterno 💕",
  description: "Un lugar especial para nuestros recuerdos, momentos y amor infinito",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${playfair.variable} ${inter.variable} antialiased`}>
        <AuthProvider>
          <AuthGuard>
            <Suspense fallback={null}>{children}</Suspense>
          </AuthGuard>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
