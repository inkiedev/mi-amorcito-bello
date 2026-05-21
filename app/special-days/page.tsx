"use client"

import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { deleteSpecialDay, getSpecialDays } from "@/lib/supabase/queries"
import type { SpecialDay } from "@/lib/types"
import { AddSpecialDayModal } from "@/components/add-special-day-modal"
import { notifyRomanticDataChanged, useRomanticDataVersion } from "@/hooks/use-romantic-data-version"
import { Pencil, Trash2 } from "lucide-react"

type SpecialDayFilter = "all" | SpecialDay["category"]

export default function SpecialDaysPage() {
  const dataVersion = useRomanticDataVersion()
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<SpecialDayFilter>("all")

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
  }, [dataVersion])

  const filteredSpecialDays = specialDays.filter((day) => (filter === "all" ? true : day.category === filter))

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

  const handleDeleteSpecialDay = async (day: SpecialDay) => {
    const confirmed = window.confirm(`¿Eliminar "${day.title}" de sus fechas especiales?`)
    if (!confirmed) return

    try {
      await deleteSpecialDay(day.id)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error deleting special day:", error)
      alert("No pude eliminar la fecha. Intenta de nuevo.")
    }
  }

  return (
    <div className="romantic-page min-h-screen">
      <NavigationHeader />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center letter-reveal">
          <div className="mb-4 text-6xl candle-glow">🎉</div>
          <h1 className="script-title love-ribbon mb-8 text-5xl font-bold text-foreground md:text-6xl">Días Especiales</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Fechas que marcaron nuestra historia y que celebramos con amor
          </p>
        </div>

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
            <Card className="glass-panel mb-8">
              <CardHeader>
                <CardTitle className="script-title text-center text-3xl text-foreground">Próximo Día Especial</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl mb-2">{getCategoryIcon(nextSpecialDay.category)}</div>
                <h3 className="text-xl font-semibold mb-2">{nextSpecialDay.title}</h3>
                <p className="text-muted-foreground mb-4">{nextSpecialDay.description}</p>
              </CardContent>
            </Card>
          ) : null
        })()}

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-primary/20 hover:bg-primary/10"
            onClick={() => setFilter("all")}
          >
            Todos
          </Button>
          <Button
            variant={filter === "anniversary" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-primary/20 hover:bg-primary/10"
            onClick={() => setFilter("anniversary")}
          >
            💕 Aniversarios
          </Button>
          <Button
            variant={filter === "first-time" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-primary/20 hover:bg-primary/10"
            onClick={() => setFilter("first-time")}
          >
            ⭐ Primeras veces
          </Button>
          <Button
            variant={filter === "milestone" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-primary/20 hover:bg-primary/10"
            onClick={() => setFilter("milestone")}
          >
            🏆 Hitos
          </Button>
          <Button
            variant={filter === "celebration" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-primary/20 hover:bg-primary/10"
            onClick={() => setFilter("celebration")}
          >
            🎉 Celebraciones
          </Button>
          <AddSpecialDayModal>
            <Button className="rounded-full bg-primary hover:bg-primary/90">+ Nuevo Día Especial</Button>
          </AddSpecialDayModal>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
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
        ) : filteredSpecialDays.length === 0 ? (
          <Card className="glass-panel">
            <CardContent className="p-10 text-center">
              <div className="mb-4 text-5xl">⌕</div>
              <h3 className="script-title mb-2 text-3xl text-foreground">No hay fechas en este filtro</h3>
              <p className="text-muted-foreground">Cambia de categoría o guarda una nueva fecha.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredSpecialDays.map((day) => (
              <Card
                key={day.id}
                className="romantic-card"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getCategoryIcon(day.category)}</div>
                      <div>
                        <CardTitle className="script-title text-3xl text-foreground">{day.title}</CardTitle>
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
                  <div className="flex flex-wrap gap-2">
                    <AddSpecialDayModal specialDay={day}>
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Pencil data-icon="inline-start" />
                        Editar
                      </Button>
                    </AddSpecialDayModal>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDeleteSpecialDay(day)}
                    >
                      <Trash2 data-icon="inline-start" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="fixed bottom-8 right-8">
          <AddSpecialDayModal>
            <Button size="lg" className="size-14 rounded-full bg-primary shadow-lg hover:bg-primary/90">
              <span className="text-2xl">🎉</span>
            </Button>
          </AddSpecialDayModal>
        </div>
      </div>
    </div>
  )
}
