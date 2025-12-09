"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function LoveCounter() {
  const [timeData, setTimeData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  //No cambiar esto, esta fecha es la final
  const startDate = new Date("2024-10-25T00:00:00")

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date()
      const diff = now.getTime() - startDate.getTime()

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeData({ days, hours, minutes, seconds })
    }

    updateCounter()
    const interval = setInterval(updateCounter, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-primary/20 relative overflow-hidden">
      <div className="absolute top-2 right-2 text-4xl opacity-20 animate-pulse-heart">💕</div>
      <CardHeader>
        <CardTitle className="text-center text-primary font-serif">Tiempo Juntos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{timeData.days}</div>
            <div className="text-xs text-muted-foreground">Días</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-secondary-foreground">{timeData.hours}</div>
            <div className="text-xs text-muted-foreground">Horas</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-accent-foreground">{timeData.minutes}</div>
            <div className="text-xs text-muted-foreground">Minutos</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-primary">{timeData.seconds}</div>
            <div className="text-xs text-muted-foreground">Segundos</div>
          </div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-4 italic">
          Cada segundo contigo es un regalo del cielo
        </p>
      </CardContent>
    </Card>
  )
}
