"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (success) {
      router.push("/")
    } else {
      setError("Credenciales incorrectas. Intenta de nuevo, mi amor 💕")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@amor.com"
          required
          className="border-primary/20 focus:border-primary"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          className="border-primary/20 focus:border-primary"
        />
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar a Nuestro Mundo 💕"}
      </Button>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-muted">
        <p className="text-sm font-medium text-center mb-2">Credenciales de prueba:</p>
        <div className="text-xs space-y-1">
          <p>
            <strong>Él:</strong> el@amor.com / amor123
          </p>
          <p>
            <strong>Ella:</strong> ella@amor.com / amor123
          </p>
        </div>
      </div>
    </form>
  )
}
