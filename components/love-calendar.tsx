"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { getSpecialDays } from "@/lib/supabase/queries"
import type { SpecialDay } from "@/lib/types"

export function LoveCalendar() {
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSpecialDays = async () => {
      try {
        const data = await getSpecialDays()
        setSpecialDays(data)
      } catch (error) {
        console.error('Error fetching special days:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpecialDays()
  }, [])

  const today = new Date()

  const getDaysUntil = (dateString: string, isRecurring: boolean = false) => {
    const targetDate = new Date(dateString)
    const currentYear = today.getFullYear()
    const nextOccurrence = new Date(currentYear, targetDate.getMonth(), targetDate.getDate())

    if (nextOccurrence < today && isRecurring) {
      nextOccurrence.setFullYear(currentYear + 1)
    }

    const diffTime = nextOccurrence.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "anniversary": return "💕"
      case "first-time": return "⭐"
      case "milestone": return "🏆"
      case "celebration": return "🎉"
      default: return "💖"
    }
  }

  const upcomingEvents = specialDays
    .map((day) => ({
      ...day,
      emoji: getCategoryEmoji(day.category),
      daysUntil: getDaysUntil(day.date, day.is_recurring),
    }))
    .filter((day) => day.daysUntil >= 0)
    .sort((a, b) => a.daysUntil - b.daysUntil)

  const nextSpecialDay = upcomingEvents[0]

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-accent/10 hover-lift romantic-particles">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent-foreground">
          <span className="animate-gentle-bounce">📅</span>
          <span>Días Especiales</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-20 bg-muted/20 rounded-lg"></div>
              <div className="space-y-2 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-muted/15 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ) : specialDays.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4 animate-pulse-heart">📅</div>
            <p className="text-muted-foreground mb-4">Sin días especiales aún</p>
            <p className="text-sm text-muted-foreground">¡Añade vuestros primeros días especiales!</p>
          </div>
        ) : (
          <>
            {nextSpecialDay && (
              <div className="mb-6 p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg border border-accent/20 animate-romantic-glow">
                <div className="text-center">
                  <div className="text-3xl mb-2 animate-pulse-heart">{nextSpecialDay.emoji}</div>
                  <h3 className="font-medium text-accent-foreground mb-1">{nextSpecialDay.title}</h3>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="animate-fade-in-up">
                      {nextSpecialDay.daysUntil === 0
                        ? "¡Hoy!"
                        : nextSpecialDay.daysUntil === 1
                          ? "¡Mañana!"
                          : `Faltan ${nextSpecialDay.daysUntil} días`}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <span className="animate-sparkle">✨</span>
                Próximos Eventos:
              </h4>
              {upcomingEvents.slice(0, 4).map((day, index) => (
                <div
                  key={day.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-300 hover-lift"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl animate-gentle-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
                      {day.emoji}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{day.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(day.date).toLocaleDateString("es-ES", {
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs transition-all duration-300 ${
                      day.daysUntil <= 7 ? "bg-accent/20 border-accent text-accent-foreground animate-pulse-heart" : ""
                    }`}
                  >
                    {day.daysUntil === 0 ? "Hoy" : day.daysUntil === 1 ? "Mañana" : `${day.daysUntil} días`}
                  </Badge>
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
              >
                📅 Ver calendario completo
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
