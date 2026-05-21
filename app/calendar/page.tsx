"use client"

import { useState, useEffect } from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getMemories, getSpecialDays, getQuotes } from "@/lib/supabase/queries"
import type { RomanticMemory, SpecialDay, Quote } from "@/lib/types"
import { useRomanticDataVersion } from "@/hooks/use-romantic-data-version"

type CalendarContentItem = {
  type: RomanticMemory["type"] | "quote" | "special-day"
  title: string
  emoji: string
  id: string
}

export default function CalendarPage() {
  const dataVersion = useRomanticDataVersion()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [memories, setMemories] = useState<RomanticMemory[]>([])
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [memoriesData, specialDaysData, quotesData] = await Promise.all([
          getMemories(),
          getSpecialDays(),
          getQuotes()
        ])
        setMemories(memoriesData)
        setSpecialDays(specialDaysData)
        setQuotes(quotesData)
      } catch (error) {
        console.error('Error fetching calendar data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dataVersion])

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDateKey = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const getContentForDate = (day: number) => {
    const dateKey = formatDateKey(currentDate.getFullYear(), currentDate.getMonth(), day)
    const content: CalendarContentItem[] = []
    
    // Add memories for this date
    memories.forEach(memory => {
      if (memory.date === dateKey) {
        content.push({
          type: memory.type || 'memory',
          title: memory.title,
          emoji: memory.type === 'photo' ? "📸" : "💭",
          id: memory.id
        })
      }
    })
    
    // Add special days for this date
    specialDays.forEach(specialDay => {
      const specialDate = new Date(specialDay.date)
      if (specialDay.is_recurring) {
        // For recurring events, check if month and day match
        const currentYear = currentDate.getFullYear()
        const recurringDate = new Date(currentYear, specialDate.getMonth(), specialDate.getDate())
        if (formatDateKey(recurringDate.getFullYear(), recurringDate.getMonth(), recurringDate.getDate()) === dateKey) {
          content.push({
            type: 'special-day',
            title: specialDay.title,
            emoji: "🎉",
            id: specialDay.id
          })
        }
      } else if (specialDay.date === dateKey) {
        content.push({
          type: 'special-day',
          title: specialDay.title,
          emoji: "🎉",
          id: specialDay.id
        })
      }
    })
    
    // Add quotes for this date
    quotes.forEach(quote => {
      if (quote.date === dateKey) {
        content.push({
          type: 'quote',
          title: quote.text.substring(0, 30) + (quote.text.length > 30 ? '...' : ''),
          emoji: "💌",
          id: quote.id
        })
      }
    })
    
    return content.length > 0 ? content : null
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const selectDate = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    setSelectedDate(selected)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Días vacíos al inicio
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const content = getContentForDate(day)
      const isToday =
        new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString()

      days.push(
        <div
          key={day}
          onClick={() => selectDate(day)}
          className={`
            h-12 flex items-center justify-center cursor-pointer rounded-lg transition-all duration-300 relative
            hover:bg-primary/10 hover:scale-105
            ${isToday ? "bg-primary text-primary-foreground font-bold" : ""}
            ${content ? "bg-accent/20 border-2 border-accent/30" : ""}
          `}
        >
          <span className="text-sm">{day}</span>
          {content && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse-heart">
              <div className="absolute inset-0 bg-accent rounded-full animate-ping opacity-75"></div>
            </div>
          )}
        </div>,
      )
    }

    return days
  }

  const selectedDateContent = selectedDate ? getContentForDate(selectedDate.getDate()) : null

  return (
    <div className="romantic-page min-h-screen">
      <NavigationHeader />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center letter-reveal">
          <div className="mb-4 text-6xl animate-bounce-slow">📅</div>
          <h1 className="script-title love-ribbon mb-8 text-5xl font-bold text-foreground md:text-6xl">Calendario del Amor</h1>
          <p className="text-lg text-muted-foreground">Cada día es especial cuando lo vivimos juntos</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3" aria-busy={isLoading}>
          <div className="lg:col-span-2">
            <Card className="glass-panel">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth("prev")}
                    className="hover:bg-primary/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <CardTitle className="script-title text-3xl text-foreground">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigateMonth("next")}
                    className="hover:bg-primary/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 grid grid-cols-7 gap-2">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div
                      key={day}
                      className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {selectedDate && selectedDateContent ? (
              <Card className="romantic-card">
                <CardHeader>
                  <CardTitle className="script-title text-2xl text-foreground">
                    {selectedDate.toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDateContent.map((item, index) => (
                    <div
                      key={index}
                      className="flex cursor-pointer items-center gap-3 rounded-lg border border-foreground/10 bg-foreground/[0.04] p-3 transition-colors hover:bg-foreground/[0.07]"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {item.type === "memory"
                            ? "Recuerdo"
                            : item.type === "photo"
                              ? "Foto"
                              : item.type === "quote"
                                ? "Frase"
                                : item.type === "special-day"
                                  ? "Día Especial"
                                  : "Carta"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="glass-panel">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">💕</div>
                  <p className="text-muted-foreground">Selecciona una fecha para ver nuestros momentos especiales</p>
                </CardContent>
              </Card>
            )}

            <Card className="romantic-card">
              <CardHeader>
                <CardTitle className="script-title text-3xl text-foreground">Este Mes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Recuerdos</span>
                  <Badge variant="outline">
                    {memories.filter(m => {
                      const memoryDate = new Date(m.date)
                      return memoryDate.getMonth() === currentDate.getMonth() && 
                             memoryDate.getFullYear() === currentDate.getFullYear()
                    }).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Fotos</span>
                  <Badge variant="outline">
                    {memories.filter(m => {
                      const memoryDate = new Date(m.date)
                      return m.type === 'photo' && 
                             memoryDate.getMonth() === currentDate.getMonth() && 
                             memoryDate.getFullYear() === currentDate.getFullYear()
                    }).length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Días Especiales</span>
                  <Badge variant="outline">
                    {specialDays.filter(d => {
                      const specialDate = new Date(d.date)
                      if (d.is_recurring) {
                        return specialDate.getMonth() === currentDate.getMonth()
                      }
                      return specialDate.getMonth() === currentDate.getMonth() && 
                             specialDate.getFullYear() === currentDate.getFullYear()
                    }).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
