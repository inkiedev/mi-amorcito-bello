"use client"

import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getQuotes } from "@/lib/supabase/queries"
import type { Quote } from "@/lib/types"
import { AddQuoteModal } from "@/components/add-quote-modal"

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const data = await getQuotes()
        setQuotes(data)
      } catch (error) {
        console.error('Error fetching quotes:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuotes()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header de la página */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-sparkle">💬</div>
          <h1 className="font-serif text-4xl font-bold text-accent-foreground mb-2">Frases de Amor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Palabras que nacen del corazón y llegan al alma, nuestras frases más hermosas
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button variant="outline" size="sm" className="border-accent/20 hover:bg-accent/10 bg-transparent">
            Todas las frases
          </Button>
          <Button variant="outline" size="sm" className="border-accent/20 hover:bg-accent/10 bg-transparent">
            💕 Favoritas
          </Button>
          <Button variant="outline" size="sm" className="border-accent/20 hover:bg-accent/10 bg-transparent">
            Por él
          </Button>
          <Button variant="outline" size="sm" className="border-accent/20 hover:bg-accent/10 bg-transparent">
            Por ella
          </Button>
          <AddQuoteModal>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">+ Nueva Frase</Button>
          </AddQuoteModal>
        </div>

        {/* Lista de frases */}
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted/20 rounded-full"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-muted/20 rounded w-32"></div>
                      <div className="h-3 bg-muted/15 rounded w-24"></div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted/20 rounded"></div>
                    <div className="h-6 bg-muted/15 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : quotes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 animate-sparkle">💬</div>
            <h3 className="text-2xl font-semibold text-muted-foreground mb-4">Sin frases aún</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comienza añadiendo vuestra primera frase de amor
            </p>
            <AddQuoteModal>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                💬 Añadir Primera Frase
              </Button>
            </AddQuoteModal>
          </div>
        ) : (
          <div className="space-y-6">
            {quotes.map((quote) => (
              <Card
                key={quote.id}
                className="hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-accent/5 via-card/50 to-primary/5 backdrop-blur-sm border-accent/10 relative overflow-hidden"
              >
                {/* Elemento decorativo */}
                <div className="absolute top-4 right-4 text-4xl opacity-20">💌</div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{quote.created_by === "him" ? "👨" : "👩"}</div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Por {quote.created_by === "him" ? "él" : "ella"} • {new Date(quote.date).toLocaleDateString()}
                        </p>
                        {quote.context && (
                          <Badge
                            variant="outline"
                            className="mt-1 bg-accent/5 border-accent/20 text-accent-foreground text-xs"
                          >
                            {quote.context}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {quote.is_favorite && <span className="text-2xl animate-pulse-heart">💕</span>}
                  </div>
                </CardHeader>

                <CardContent>
                  <blockquote className="text-lg font-serif italic text-accent-foreground mb-4 leading-relaxed text-balance">
                    "{quote.text}"
                  </blockquote>

                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/10">
                      💕 {quote.is_favorite ? "Favorita" : ""}
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/10">
                        🔗 Compartir
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/10">
                        ✏️ Editar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Botón flotante para agregar frase */}
        <div className="fixed bottom-8 right-8">
          <AddQuoteModal>
            <Button
              size="lg"
              className="rounded-full h-14 w-14 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg"
            >
              <span className="text-2xl">💬</span>
            </Button>
          </AddQuoteModal>
        </div>
      </div>
    </div>
  )
}
