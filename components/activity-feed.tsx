"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ActivityFeed() {
  return (
    <Card className="romantic-card rounded-lg">
      <CardHeader>
        <CardTitle className="script-title flex items-center gap-2 text-3xl text-foreground">
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
