"use client"

import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getSpecialDays } from "@/lib/supabase/queries"
import type { SpecialDay } from "@/lib/types"
import { AddSpecialDayModal } from "@/components/add-special-day-modal"

export default function SpecialDaysPage() {
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

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "anniversary":
        return "💕"
      case "first-time":
        return "⭐"
      case "milestone":
        return "🏆"
      case "celebration":
        return "🎉"
      default:
        return "💖"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "anniversary":
        return "bg-primary/10 text-primary border-primary/20"
      case "first-time":
        return "bg-accent/10 text-accent-foreground border-accent/20"
      case "milestone":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "celebration":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  const getDaysUntil = (dateString: string) => {
    const today = new Date()
    const targetDate = new Date(dateString)

    // Si es recurrente, calcular para este año o el próximo
    if (targetDate < today) {
      targetDate.setFullYear(today.getFullYear() + 1)
    }

    const diffTime = targetDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header de la página */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse-heart">🎉</div>
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">Días Especiales</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fechas que marcaron nuestra historia y que celebramos con amor
          </p>
        </div>

        {/* Próximo día especial destacado */}
        {!isLoading && specialDays.length > 0 && (() => {
          const nextSpecialDay = specialDays
            .filter(day => {
              const targetDate = new Date(day.date)
              const today = new Date()
              if (day.is_recurring) {
                const currentYear = today.getFullYear()
                const nextOccurrence = new Date(currentYear, targetDate.getMonth(), targetDate.getDate())
                if (nextOccurrence < today) {
                  nextOccurrence.setFullYear(currentYear + 1)
                }
                return nextOccurrence >= today
              }
              return targetDate >= today
            })
            .sort((a, b) => {
              const dateA = new Date(a.date)
              const dateB = new Date(b.date)
              return dateA.getTime() - dateB.getTime()
            })[0]

          return nextSpecialDay ? (
            <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardHeader>
                <CardTitle className="text-center text-2xl text-primary">Próximo Día Especial</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl mb-2">{getCategoryIcon(nextSpecialDay.category)}</div>
                <h3 className="text-xl font-semibold mb-2">{nextSpecialDay.title}</h3>
                <p className="text-muted-foreground mb-4">{nextSpecialDay.description}</p>
                <Button className="bg-primary hover:bg-primary/90">Ver Detalles</Button>
              </CardContent>
            </Card>
          ) : null
        })()}

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 bg-transparent">
            Todos
          </Button>
          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 bg-transparent">
            💕 Aniversarios
          </Button>
          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 bg-transparent">
            ⭐ Primeras veces
          </Button>
          <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 bg-transparent">
            🎉 Celebraciones
          </Button>
          <AddSpecialDayModal>
            <Button className="bg-primary hover:bg-primary/90">+ Nuevo Día Especial</Button>
          </AddSpecialDayModal>
        </div>

        {/* Lista de días especiales */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted/20 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-5 bg-muted/20 rounded w-40"></div>
                      <div className="h-4 bg-muted/15 rounded w-32"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/20 rounded"></div>
                    <div className="h-4 bg-muted/15 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : specialDays.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 animate-pulse-heart">🎉</div>
            <h3 className="text-2xl font-semibold text-muted-foreground mb-4">Sin días especiales aún</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comienza añadiendo vuestros momentos más importantes y fechas especiales
            </p>
            <AddSpecialDayModal>
              <Button className="bg-primary hover:bg-primary/90">
                🎉 Añadir Primer Día Especial
              </Button>
            </AddSpecialDayModal>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {specialDays.map((day) => (
              <Card
                key={day.id}
                className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-primary/10"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getCategoryIcon(day.category)}</div>
                      <div>
                        <CardTitle className="text-lg text-primary">{day.title}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <span>{new Date(day.date).toLocaleDateString()}</span>
                          {day.is_recurring && (
                            <Badge variant="outline" className="text-xs bg-accent/5 border-accent/20">
                              Recurrente
                            </Badge>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={`${getCategoryColor(day.category)}`}>{day.category}</Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{day.description}</p>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                      👀 Ver Detalles
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/10">
                      ✏️ Editar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/10">
                      📅 Recordatorio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Botón flotante para agregar día especial */}
        <div className="fixed bottom-8 right-8">
          <AddSpecialDayModal>
            <Button size="lg" className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg">
              <span className="text-2xl">🎉</span>
            </Button>
          </AddSpecialDayModal>
        </div>
      </div>
    </div>
  )
}
