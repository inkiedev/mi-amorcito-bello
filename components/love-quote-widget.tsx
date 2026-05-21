"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRandomQuote } from "@/lib/supabase/queries"
import type { Quote } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"
import { getCoupleAuthorLabel } from "@/lib/utils"
import { useRomanticDataVersion } from "@/hooks/use-romantic-data-version"

export function LoveQuoteWidget() {
  const { user } = useAuth()
  const dataVersion = useRomanticDataVersion()
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchRandomQuote = useCallback(async () => {
    try {
      setIsLoading(true)
      const quote = await getRandomQuote()
      setCurrentQuote(quote)
    } catch (error) {
      console.error('Error fetching quote:', error)
      setCurrentQuote(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    getRandomQuote()
      .then((quote) => {
        if (isMounted) {
          setCurrentQuote(quote)
        }
      })
      .catch((error) => {
        console.error('Error fetching quote:', error)
        if (isMounted) {
          setCurrentQuote(null)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [dataVersion])

  const nextQuote = () => {
    void fetchRandomQuote()
  }

  return (
    <Card className="romantic-card rounded-lg">
      <div className="absolute right-4 top-4 text-4xl opacity-20 candle-glow">❦</div>
      <CardContent className="p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            💌
          </div>
          {isLoading ? (
            <div className="min-h-[8rem] flex items-center justify-center">
              <div className="animate-pulse space-y-3 w-full">
                <div className="h-4 bg-muted/30 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-muted/30 rounded w-1/2 mx-auto"></div>
                <div className="h-3 bg-muted/20 rounded w-1/3 mx-auto"></div>
              </div>
            </div>
          ) : currentQuote ? (
            <>
              <blockquote className="script-title mb-3 flex min-h-[3rem] items-center justify-center text-balance text-2xl italic text-foreground">
                &ldquo;{currentQuote.text}&rdquo;
              </blockquote>
              <p className="text-sm text-muted-foreground mb-4">
                — {currentQuote.author || getCoupleAuthorLabel(currentQuote.created_by, user?.id)}
              </p>
              <Button variant="ghost" size="sm" onClick={nextQuote} className="rounded-full text-primary hover:bg-primary/10">
                💫 Otra frase
              </Button>
            </>
          ) : (
            <div className="min-h-[8rem] flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl mb-3 animate-pulse-heart">💜</div>
                <p className="text-muted-foreground mb-2">Sin frases aún</p>
                <p className="text-sm text-muted-foreground">¡Añade vuestra primera frase de amor!</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
