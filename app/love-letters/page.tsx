"use client"

import { useEffect, useState } from "react"
import { AddLoveLetterModal } from "@/components/add-love-letter-modal"
import { LoveLetterGenerator } from "@/components/love-letter-generator"
import { NavigationHeader } from "@/components/navigation-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { useRomanticDataVersion } from "@/hooks/use-romantic-data-version"
import { getLoveLetters } from "@/lib/supabase/queries"
import type { RomanticMemory } from "@/lib/types"
import { getCoupleAuthorLabel } from "@/lib/utils"

export default function LoveLettersPage() {
  const { user } = useAuth()
  const dataVersion = useRomanticDataVersion()
  const [letters, setLetters] = useState<RomanticMemory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const data = await getLoveLetters()
        setLetters(data)
      } catch (error) {
        console.error("Error fetching love letters:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLetters()
  }, [dataVersion])

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl animate-float">💌</div>
          <h1 className="mb-2 font-serif text-4xl font-bold text-accent-foreground">Cartas de Amor</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Mensajes largos, promesas, disculpas bonitas y palabras para volver a leer cuando haga falta.
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-3">
          <AddLoveLetterModal>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">✍️ Escribir Carta</Button>
          </AddLoveLetterModal>
          <LoveLetterGenerator>
            <Button variant="outline" className="bg-transparent">
              ✨ Generar Inspiración
            </Button>
          </LoveLetterGenerator>
        </div>

        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-2/3 rounded bg-muted/30" />
                  <div className="h-3 w-1/3 rounded bg-muted/20" />
                </CardHeader>
                <CardContent>
                  <div className="h-20 rounded bg-muted/20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : letters.length === 0 ? (
          <Card className="border-accent/20 bg-accent/5">
            <CardContent className="p-10 text-center">
              <div className="mb-4 text-5xl animate-pulse-heart">💝</div>
              <h2 className="mb-2 font-serif text-2xl text-accent-foreground">Todavía no hay cartas guardadas</h2>
              <p className="mx-auto mb-6 max-w-md text-muted-foreground">
                La primera puede ser cortita. Lo importante es que sea suya.
              </p>
              <AddLoveLetterModal>
                <Button>Guardar Primera Carta</Button>
              </AddLoveLetterModal>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {letters.map((letter) => (
              <Card
                key={letter.id}
                className="relative overflow-hidden border-accent/10 bg-gradient-to-br from-accent/10 via-card/70 to-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="absolute right-4 top-4 text-4xl opacity-20">💌</div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg text-accent-foreground">{letter.title}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Por {getCoupleAuthorLabel(letter.created_by, user?.id)} •{" "}
                        {new Date(letter.date).toLocaleDateString()}
                      </p>
                    </div>
                    {letter.is_favorite && <Badge>Favorita</Badge>}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-5 whitespace-pre-line text-muted-foreground">{letter.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
