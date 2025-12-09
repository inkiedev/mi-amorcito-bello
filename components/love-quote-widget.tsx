"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getRandomQuote } from "@/lib/supabase/queries"
import type { Quote } from "@/lib/types"

export function LoveQuoteWidget() {
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchRandomQuote = async () => {
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
  }

  useEffect(() => {
    fetchRandomQuote()
  }, [])

  const nextQuote = () => {
    fetchRandomQuote()
  }

  return (
    <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-primary/10 relative overflow-hidden">
      <div className="absolute top-2 right-2 text-4xl opacity-20 animate-pulse-heart">💕</div>
      <CardContent className="p-6">
        <div className="text-center">
          <div className="text-3xl mb-4">💌</div>
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
              <blockquote className="text-lg font-serif italic text-primary mb-3 min-h-[3rem] flex items-center justify-center text-balance">
                "{currentQuote.text}"
              </blockquote>
              <p className="text-sm text-muted-foreground mb-4">
                — {currentQuote.author || (currentQuote.created_by === 'him' ? 'Él' : 'Ella')}
              </p>
              <Button variant="ghost" size="sm" onClick={nextQuote} className="text-primary hover:bg-primary/10">
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
