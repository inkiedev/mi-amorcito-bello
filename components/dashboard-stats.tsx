"use client"

import { CalendarHeart, Camera, LibraryBig, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getDashboardStats } from "@/lib/supabase/queries"
import { useRomanticDataVersion } from "@/hooks/use-romantic-data-version"

export function DashboardStats() {
  const dataVersion = useRomanticDataVersion()
  const [stats, setStats] = useState({
    memories: 0,
    photos: 0,
    quotes: 0,
    specialDays: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats()
        setStats({
          memories: data.memories,
          photos: data.photos,
          quotes: data.quotes,
          specialDays: data.specialDays,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [dataVersion])

  const items = [
    { label: "Recuerdos", value: stats.memories, icon: LibraryBig, color: "text-primary" },
    { label: "Fotos", value: stats.photos, icon: Camera, color: "text-secondary" },
    { label: "Frases", value: stats.quotes, icon: Quote, color: "text-accent" },
    { label: "Fechas", value: stats.specialDays, icon: CalendarHeart, color: "text-secondary" },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {items.map((item, index) => {
        const Icon = item.icon

        return (
          <Card key={item.label} className="romantic-card rounded-lg letter-reveal" style={{ animationDelay: `${index * 0.07}s` }}>
            <CardContent className="relative z-10 p-5">
              <div className={`mb-5 grid size-11 place-items-center rounded-full border border-current/25 bg-current/10 ${item.color}`}>
                <Icon className="size-5" />
              </div>
              <div className="script-title text-4xl font-bold text-foreground">{isLoading ? "..." : item.value}</div>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
