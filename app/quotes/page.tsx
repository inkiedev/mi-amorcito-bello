"use client"

import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { deleteQuote, getQuotes, updateQuote } from "@/lib/supabase/queries"
import type { Quote } from "@/lib/types"
import { AddQuoteModal } from "@/components/add-quote-modal"
import { useAuth } from "@/contexts/auth-context"
import { getCoupleAuthorIcon, getCoupleAuthorLabel } from "@/lib/utils"
import { notifyRomanticDataChanged, useRomanticDataVersion } from "@/hooks/use-romantic-data-version"
import { Heart, Pencil, Trash2 } from "lucide-react"

export default function QuotesPage() {
  const { user } = useAuth()
  const dataVersion = useRomanticDataVersion()
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "favorites" | "mine" | "theirs">("all")

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
  }, [dataVersion])

  const filteredQuotes = quotes.filter((quote) => {
    if (filter === "favorites") return quote.is_favorite
    if (filter === "mine") return quote.created_by === user?.id
    if (filter === "theirs") return quote.created_by !== user?.id
    return true
  })

  const handleToggleFavorite = async (quote: Quote) => {
    try {
      await updateQuote(quote.id, { is_favorite: !quote.is_favorite })
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error updating quote favorite:", error)
      alert("No pude actualizar la frase. Intenta de nuevo.")
    }
  }

  const handleDeleteQuote = async (quote: Quote) => {
    const confirmed = window.confirm("¿Eliminar esta frase?")
    if (!confirmed) return

    try {
      await deleteQuote(quote.id)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error deleting quote:", error)
      alert("No pude eliminar la frase. Intenta de nuevo.")
    }
  }

  return (
    <div className="romantic-page min-h-screen">
      <NavigationHeader />
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 text-center letter-reveal">
          <div className="mb-4 text-6xl animate-sparkle">💬</div>
          <h1 className="script-title love-ribbon mb-8 text-5xl font-bold text-foreground md:text-6xl">Frases de Amor</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Palabras que nacen del corazón y llegan al alma, nuestras frases más hermosas
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-accent/20 hover:bg-accent/10"
            onClick={() => setFilter("all")}
          >
            Todas las frases
          </Button>
          <Button
            variant={filter === "favorites" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-accent/20 hover:bg-accent/10"
            onClick={() => setFilter("favorites")}
          >
            💕 Favoritas
          </Button>
          <Button
            variant={filter === "mine" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-accent/20 hover:bg-accent/10"
            onClick={() => setFilter("mine")}
          >
            Por mí
          </Button>
          <Button
            variant={filter === "theirs" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-accent/20 hover:bg-accent/10"
            onClick={() => setFilter("theirs")}
          >
            Por mi amor
          </Button>
          <AddQuoteModal>
            <Button className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">+ Nueva Frase</Button>
          </AddQuoteModal>
        </div>

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
        ) : filteredQuotes.length === 0 ? (
          <Card className="glass-panel">
            <CardContent className="p-10 text-center">
              <div className="mb-4 text-5xl">⌕</div>
              <h3 className="script-title mb-2 text-3xl text-foreground">No hay frases en este filtro</h3>
              <p className="text-muted-foreground">Cambia el filtro o guarda una nueva frase.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredQuotes.map((quote) => (
              <Card
                key={quote.id}
                className="romantic-card"
              >
                <div className="absolute right-4 top-4 text-4xl opacity-20">❦</div>

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{getCoupleAuthorIcon(quote.created_by, user?.id)}</div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Por {getCoupleAuthorLabel(quote.created_by, user?.id)} •{" "}
                          {new Date(quote.date).toLocaleDateString()}
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
                  <blockquote className="script-title mb-4 text-balance text-2xl italic leading-relaxed text-foreground">
                    &ldquo;{quote.text}&rdquo;
                  </blockquote>

                  {quote.is_favorite && <Badge className="bg-accent text-accent-foreground">Favorita</Badge>}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <AddQuoteModal quote={quote}>
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Pencil data-icon="inline-start" />
                        Editar
                      </Button>
                    </AddQuoteModal>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full bg-transparent"
                      onClick={() => handleToggleFavorite(quote)}
                    >
                      <Heart data-icon="inline-start" className={quote.is_favorite ? "fill-current text-secondary" : ""} />
                      {quote.is_favorite ? "Quitar favorito" : "Favorito"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDeleteQuote(quote)}
                    >
                      <Trash2 data-icon="inline-start" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="fixed bottom-8 right-8">
          <AddQuoteModal>
            <Button
              size="lg"
              className="size-14 rounded-full bg-accent text-accent-foreground shadow-lg hover:bg-accent/90"
            >
              <span className="text-2xl">💬</span>
            </Button>
          </AddQuoteModal>
        </div>
      </div>
    </div>
  )
}
