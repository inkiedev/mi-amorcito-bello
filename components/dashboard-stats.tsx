"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { getDashboardStats } from "@/lib/supabase/queries"

export function DashboardStats() {
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
          photos: data.memories, // For now, photos are part of memories
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
  }, [])

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-primary">💭 Recuerdos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {isLoading ? "..." : stats.memories}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-secondary/5 border-secondary/20 hover:bg-secondary/10 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-secondary-foreground">📸 Fotos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-secondary-foreground">
            {isLoading ? "..." : stats.photos}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20 hover:bg-accent/10 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-accent-foreground">💬 Frases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-accent-foreground">
            {isLoading ? "..." : stats.quotes}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20 hover:bg-primary/10 transition-colors">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-primary">🎉 Días Especiales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">
            {isLoading ? "..." : stats.specialDays}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
