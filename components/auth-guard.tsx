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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse-heart">💜</div>
          <p className="text-lg text-muted-foreground">Cargando nuestro amor...</p>
        </div>
      </div>
    )
  }

  if (!user && pathname !== '/login') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-serif text-primary mb-2">
                💜 Mi Amorcito Bello
              </CardTitle>
              <CardDescription>
                Ingresa para acceder a nuestros recuerdos
              </CardDescription>
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
