"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface Notification {
  id: string
  message: string
  type: "love" | "memory" | "special"
  icon: string
}

const LOVE_MESSAGES = [
  { message: "Recuerda decirle lo mucho que la amas hoy 💕", type: "love" as const, icon: "💕" },
  { message: "¿Qué tal si planeas una sorpresa romántica? ✨", type: "love" as const, icon: "✨" },
  { message: "Es un buen momento para crear un nuevo recuerdo juntos 📸", type: "memory" as const, icon: "📸" },
  { message: "Tu aniversario se acerca, ¡prepara algo especial! 🎉", type: "special" as const, icon: "🎉" },
  { message: "Envíale una foto de cuando eran novios 💌", type: "memory" as const, icon: "💌" },
]

export function RomanticNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Mostrar una notificación aleatoria cada 30 segundos
    const interval = setInterval(() => {
      const randomMessage = LOVE_MESSAGES[Math.floor(Math.random() * LOVE_MESSAGES.length)]
      const newNotification: Notification = {
        id: Date.now().toString(),
        ...randomMessage,
      }

      setNotifications((prev) => [...prev, newNotification])

      // Auto-remover después de 10 segundos
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id))
      }, 10000)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  if (notifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className="bg-primary/95 backdrop-blur-sm border-primary/20 shadow-lg animate-in slide-in-from-right duration-300"
        >
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">{notification.icon}</span>
              <div className="flex-1">
                <p className="text-sm text-primary-foreground leading-relaxed">{notification.message}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
                className="text-primary-foreground hover:bg-primary-foreground/10 p-1 h-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
