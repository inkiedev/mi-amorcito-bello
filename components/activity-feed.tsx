"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function ActivityFeed() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-secondary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-secondary-foreground">
          🔔 <span>Actividad Reciente</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <div className="text-4xl mb-4 animate-gentle-bounce">📱</div>
          <p className="text-muted-foreground mb-2">Sin actividad aún</p>
          <p className="text-sm text-muted-foreground">La actividad aparecerá cuando crees recuerdos</p>
        </div>
      </CardContent>
    </Card>
  )
}
