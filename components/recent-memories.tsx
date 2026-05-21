"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getRecentMemories } from "@/lib/supabase/queries"
import type { RomanticMemory } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { getCoupleAuthorLabel } from "@/lib/utils"
import { useRomanticDataVersion } from "@/hooks/use-romantic-data-version"

export function RecentMemories() {
  const { user } = useAuth()
  const dataVersion = useRomanticDataVersion()
  const [recentMemories, setRecentMemories] = useState<RomanticMemory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await getRecentMemories(3)
        setRecentMemories(data)
      } catch (error) {
        console.error('Error fetching memories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemories()
  }, [dataVersion])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "memory":
        return "💭"
      case "quote":
        return "💬"
      case "photo":
        return "📸"
      case "special-day":
        return "🎉"
      default:
        return "💕"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "memory":
        return "bg-primary/10 text-primary border-primary/20"
      case "quote":
        return "bg-accent/10 text-accent-foreground border-accent/20"
      case "photo":
        return "bg-secondary/10 text-secondary-foreground border-secondary/20"
      case "special-day":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20"
    }
  }

  return (
    <Card className="romantic-card rounded-lg">
      <CardHeader>
        <CardTitle className="script-title flex items-center gap-2 text-3xl text-foreground">
          ✨ <span>Recuerdos Recientes</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg bg-foreground/[0.04] p-3">
                <div className="size-8 animate-pulse rounded bg-muted/30"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 animate-pulse rounded bg-muted/30"></div>
                  <div className="h-3 w-3/4 animate-pulse rounded bg-muted/20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentMemories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4 animate-pulse-heart">💜</div>
            <p className="text-muted-foreground mb-4">Aún no hay recuerdos</p>
            <p className="text-sm text-muted-foreground">¡Comienza creando vuestro primer recuerdo juntos!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentMemories.map((memory) => (
              <div
                key={memory.id}
                className="flex items-start gap-3 rounded-lg border border-foreground/10 bg-foreground/[0.04] p-3 transition-all duration-300 hover:-translate-y-1 hover:bg-foreground/[0.07]"
              >
                <div className="text-2xl">{getTypeIcon(memory.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm truncate">{memory.title}</h4>
                    <Badge variant="outline" className={`text-xs ${getTypeColor(memory.type)}`}>
                      {memory.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{memory.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      Por {getCoupleAuthorLabel(memory.created_by, user?.id)} •{" "}
                      {new Date(memory.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <Link href="/memories">
            <Button variant="outline" className="w-full rounded-full bg-transparent">
              Ver Todos los Recuerdos
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
