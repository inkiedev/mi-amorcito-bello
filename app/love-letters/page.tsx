import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function LoveLettersPage() {
  // Datos simulados de cartas de amor
  const loveLetters = [
    {
      id: "1",
      title: "Mi primera carta para ti",
      preview: "Mi amor, desde el momento en que te vi, supe que mi vida había cambiado para siempre...",
      author: "him",
      date: "2024-01-30",
      wordCount: 245,
      isRead: true,
    },
    {
      id: "2",
      title: "Para el amor de mi vida",
      preview: "Querido corazón mío, cada día que pasa me enamoro más de ti, de tu sonrisa, de tu forma de ser...",
      author: "her",
      date: "2024-02-10",
      wordCount: 189,
      isRead: true,
    },
    {
      id: "3",
      title: "En nuestro aniversario",
      preview:
        "Han pasado meses desde que comenzamos esta aventura juntos, y cada día ha sido mejor que el anterior...",
      author: "him",
      date: "2024-03-15",
      wordCount: 312,
      isRead: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header de la página */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">💌</div>
          <h1 className="font-serif text-4xl font-bold text-accent-foreground mb-2">Cartas de Amor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Mensajes del corazón, palabras que expresan lo que sentimos en lo más profundo del alma
          </p>
        </div>

        {/* Botón para escribir nueva carta */}
        <div className="text-center mb-8">
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">✍️ Escribir Nueva Carta</Button>
        </div>

        {/* Lista de cartas */}
        <div className="grid md:grid-cols-2 gap-6">
          {loveLetters.map((letter) => (
            <Card
              key={letter.id}
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gradient-to-br from-accent/5 via-card/50 to-primary/5 backdrop-blur-sm border-accent/10 relative overflow-hidden"
            >
              {/* Elemento decorativo */}
              <div className="absolute top-4 right-4 text-4xl opacity-20 animate-float">💕</div>

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{letter.author === "him" ? "👨" : "👩"}</div>
                    <div>
                      <CardTitle className="text-lg text-accent-foreground">{letter.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          Por {letter.author === "him" ? "él" : "ella"}
                        </span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{letter.date}</span>
                      </div>
                    </div>
                  </div>
                  {!letter.isRead && <Badge className="bg-primary text-primary-foreground">Nueva</Badge>}
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed italic">{letter.preview}</p>

                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="bg-accent/5 border-accent/20 text-accent-foreground">
                    {letter.wordCount} palabras
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
                    📖 Leer Completa
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/10">
                    💕 Favorita
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/10">
                    🔗 Compartir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensaje inspiracional */}
        <Card className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-8 text-center">
            <div className="text-4xl mb-4">💝</div>
            <h3 className="font-serif text-2xl text-primary mb-3">"Las palabras del corazón nunca se olvidan"</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Cada carta es un pedacito de nuestro amor que permanecerá para siempre
            </p>
          </CardContent>
        </Card>

        {/* Botón flotante para escribir carta */}
        <div className="fixed bottom-8 right-8">
          <Button
            size="lg"
            className="rounded-full h-14 w-14 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
          >
            <span className="text-2xl">✍️</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
