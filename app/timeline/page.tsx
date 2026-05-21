"use client"

import { useEffect, useMemo, useState } from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRomanticDataVersion } from "@/hooks/use-romantic-data-version"
import { getMemories, getQuotes, getSpecialDays } from "@/lib/supabase/queries"
import type { Quote, RomanticMemory, SpecialDay } from "@/lib/types"

type TimelineEvent = {
  id: string
  title: string
  date: string
  description: string
  type: string
  icon: string
}

export default function TimelinePage() {
  const dataVersion = useRomanticDataVersion()
  const [memories, setMemories] = useState<RomanticMemory[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTimelineData = async () => {
      try {
        const [memoriesData, quotesData, specialDaysData] = await Promise.all([
          getMemories(),
          getQuotes(),
          getSpecialDays(),
        ])

        setMemories(memoriesData)
        setQuotes(quotesData)
        setSpecialDays(specialDaysData)
      } catch (error) {
        console.error("Error fetching timeline data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTimelineData()
  }, [dataVersion])

  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    const memoryEvents = memories.map((memory) => ({
      id: memory.id,
      title: memory.title,
      date: memory.date,
      description: memory.description,
      type: memory.tags.includes("carta") ? "carta" : memory.type,
      icon: memory.tags.includes("carta") ? "💌" : memory.type === "photo" ? "📸" : "💭",
    }))

    const quoteEvents = quotes.map((quote) => ({
      id: quote.id,
      title: quote.context || "Frase guardada",
      date: quote.date,
      description: quote.text,
      type: "frase",
      icon: "💬",
    }))

    const specialDayEvents = specialDays.map((day) => ({
      id: day.id,
      title: day.title,
      date: day.date,
      description: day.description,
      type: "día especial",
      icon: "🎉",
    }))

    return [...memoryEvents, ...quoteEvents, ...specialDayEvents].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  }, [memories, quotes, specialDays])

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-12 text-center">
          <div className="mb-4 text-6xl animate-float">📅</div>
          <h1 className="mb-2 font-serif text-4xl font-bold text-secondary-foreground">Línea de Tiempo</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Un recorrido real por los momentos que ustedes han guardado.
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-24 rounded bg-muted/20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : timelineEvents.length === 0 ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-10 text-center">
              <div className="mb-4 text-5xl animate-pulse-heart">💕</div>
              <h2 className="mb-2 font-serif text-2xl text-primary">La línea de tiempo está esperando su primera escena</h2>
              <p className="text-muted-foreground">Crea recuerdos, frases o días especiales y aparecerán aquí.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="relative">
            <div className="absolute bottom-0 left-8 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent" />

            <div className="flex flex-col gap-8">
              {timelineEvents.map((event) => (
                <div key={`${event.type}-${event.id}`} className="relative flex items-start gap-6">
                  <div className="relative z-10 flex-shrink-0">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary text-2xl shadow-lg animate-pulse-heart">
                      {event.icon}
                    </div>
                  </div>

                  <Card className="flex-1 border-primary/10 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <h3 className="mb-1 text-xl font-semibold text-primary">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="leading-relaxed text-muted-foreground">{event.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
