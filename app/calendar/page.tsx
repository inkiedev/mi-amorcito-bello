"use client"

import { useState, useEffect } from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getMemories, getSpecialDays, getQuotes } from "@/lib/supabase/queries"
import type { RomanticMemory, SpecialDay, Quote } from "@/lib/types"

export default function CalendarPage() {
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
  }, [])

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
    const content = []
    
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
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce-slow">📅</div>
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">Calendario del Amor</h1>
          <p className="text-lg text-muted-foreground">Cada día es especial cuando lo vivimos juntos</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendario */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
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
                  <CardTitle className="text-2xl text-primary">
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
                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                    <div
                      key={day}
                      className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Días del calendario */}
                <div className="grid grid-cols-7 gap-2">{renderCalendarDays()}</div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de detalles */}
          <div className="space-y-6">
            {selectedDate && selectedDateContent ? (
              <Card className="bg-accent/10 border-accent/20">
                <CardHeader>
                  <CardTitle className="text-accent-foreground">
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
                      className="flex items-center gap-3 p-3 bg-background/50 rounded-lg hover:bg-background/70 transition-colors cursor-pointer"
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
              <Card className="bg-muted/20">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-2">💕</div>
                  <p className="text-muted-foreground">Selecciona una fecha para ver nuestros momentos especiales</p>
                </CardContent>
              </Card>
            )}

            {/* Estadísticas rápidas */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-primary">Este Mes</CardTitle>
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
