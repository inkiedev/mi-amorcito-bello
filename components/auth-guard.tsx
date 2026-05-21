"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/login-form"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user && pathname === '/login') {
      router.push('/')
    }
  }, [user, isLoading, pathname, router])

  if (isLoading) {
    return (
      <div className="romantic-page flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full border border-secondary/30 bg-secondary/10 text-4xl candle-glow">
            ♥
          </div>
          <p className="script-title text-3xl text-foreground">Cargando nuestro amor...</p>
        </div>
      </div>
    )
  }

  if (!user && pathname !== '/login') {
    return (
      <div className="romantic-page flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="glass-panel overflow-hidden rounded-lg">
            <CardHeader className="text-center">
              <CardTitle className="script-title mb-2 text-4xl text-foreground">Nuestro Amor</CardTitle>
              <CardDescription>Este rincón es privado.</CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
