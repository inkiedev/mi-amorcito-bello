import type React from "react"
import type { Metadata } from "next"
import { Cormorant_Garamond, Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { RomanticCanvas } from "@/components/romantic-canvas"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-cormorant",
})

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "Nuestro Amor",
  description: "Un rincón privado para recuerdos, cartas, fotos y días especiales",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans ${cormorant.variable} ${nunito.variable} antialiased`}>
        <RomanticCanvas />
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
