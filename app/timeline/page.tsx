import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function TimelinePage() {
  // Datos simulados de la línea de tiempo
  const timelineEvents = [
    {
      id: "1",
      title: "Nos conocimos",
      date: "2024-01-15",
      description: "El día que nuestros caminos se cruzaron por primera vez",
      type: "meeting",
      icon: "⭐",
    },
    {
      id: "2",
      title: "Primera cita oficial",
      date: "2024-01-22",
      description: "Nuestra primera cita real, llena de nervios y emoción",
      type: "date",
      icon: "💕",
    },
    {
      id: "3",
      title: "Primer beso",
      date: "2024-02-01",
      description: "El momento mágico que selló nuestro amor",
      type: "milestone",
      icon: "💋",
    },
    {
      id: "4",
      title: "Dijimos 'Te amo'",
      date: "2024-02-20",
      description: "Las palabras más importantes de nuestras vidas",
      type: "milestone",
      icon: "💖",
    },
    {
      id: "5",
      title: "Oficialmente novios",
      date: "2024-03-15",
      description: "El día que decidimos ser oficialmente una pareja",
      type: "relationship",
      icon: "👫",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header de la página */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4 animate-float">📅</div>
          <h1 className="font-serif text-4xl font-bold text-secondary-foreground mb-2">Línea de Tiempo</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            El viaje de nuestro amor a través del tiempo, cada momento importante de nuestra historia
          </p>
        </div>

        {/* Línea de tiempo */}
        <div className="relative">
          {/* Línea vertical */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent"></div>

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-6">
                {/* Punto en la línea */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-2xl animate-pulse-heart shadow-lg">
                    {event.icon}
                  </div>
                </div>

                {/* Contenido del evento */}
                <Card className="flex-1 hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm border-primary/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-semibold text-primary mb-1">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                        {event.type}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{event.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Punto final */}
          <div className="relative flex items-center gap-6 mt-8">
            <div className="relative z-10 flex-shrink-0">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center text-2xl animate-sparkle shadow-lg">
                ∞
              </div>
            </div>
            <Card className="flex-1 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-6 text-center">
                <h3 className="text-xl font-serif font-semibold text-primary mb-2">Nuestro Futuro</h3>
                <p className="text-muted-foreground">
                  Infinitos momentos hermosos nos esperan en esta aventura de amor...
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
