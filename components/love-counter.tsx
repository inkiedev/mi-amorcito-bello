"use client"

import { useEffect, useState } from "react"

const LOVE_START_DATE = new Date("2024-10-25T00:00:00")

export function LoveCounter() {
  const [timeData, setTimeData] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const updateCounter = () => {
      const now = new Date()
      const diff = now.getTime() - LOVE_START_DATE.getTime()

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

  const units = [
    { label: "días", value: timeData.days },
    { label: "horas", value: timeData.hours },
    { label: "minutos", value: timeData.minutes },
    { label: "segundos", value: timeData.seconds },
  ]

  return (
    <div className="relative overflow-hidden rounded-lg border border-secondary/20 bg-background/25 p-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {units.map((unit, index) => (
          <div
            key={unit.label}
            className="rounded-lg border border-foreground/10 bg-foreground/[0.04] p-4 text-center letter-reveal"
            style={{ animationDelay: `${index * 0.08}s` }}
          >
            <div className="script-title text-4xl font-bold text-secondary">{unit.value}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{unit.label}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-sm italic text-muted-foreground">Cada segundo todavía encuentra dónde quedarse.</p>
    </div>
  )
}
