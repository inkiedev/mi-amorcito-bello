"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"

const LOVE_QUOTES = [
  "Cada día contigo es una nueva aventura de amor",
  "Eres mi persona favorita en todo el universo",
  "Nuestro amor es la historia más hermosa jamás escrita",
  "Contigo, cada momento se convierte en un recuerdo precioso",
  "Tu sonrisa es mi lugar favorito en el mundo",
  "Eres el sueño que nunca supe que tenía",
  "Nuestro amor es mi canción favorita en repeat",
]

const LOVE_START_DATE = new Date("2024-10-25T00:00:00")
const DAY_IN_MS = 1000 * 60 * 60 * 24

export function RomanticBanner() {
  const [currentQuote, setCurrentQuote] = useState(0)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([])
  const [daysTogether, setDaysTogether] = useState<number | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % LOVE_QUOTES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const createParticles = () => {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
      }))
      setParticles(newParticles)
    }

    createParticles()
    const particleInterval = setInterval(createParticles, 10000)
    return () => clearInterval(particleInterval)
  }, [])

  useEffect(() => {
    const updateDaysTogether = () => {
      setDaysTogether(Math.floor((Date.now() - LOVE_START_DATE.getTime()) / DAY_IN_MS))
    }

    updateDaysTogether()
    const interval = setInterval(updateDaysTogether, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20 rounded-lg p-8 mb-8 romantic-particles hover-glow">
      <div className="absolute top-4 left-4 text-2xl animate-gentle-bounce">💕</div>
      <div className="absolute top-8 right-8 text-xl animate-sparkle" style={{ animationDelay: "1s" }}>
        ✨
      </div>
      <div className="absolute bottom-4 left-8 text-lg animate-pulse-heart" style={{ animationDelay: "2s" }}>
        💖
      </div>
      <div className="absolute bottom-8 right-4 text-xl animate-float" style={{ animationDelay: "0.5s" }}>
        🌹
      </div>

      <div className="absolute top-1/2 left-2 text-sm animate-float" style={{ animationDelay: "3s" }}>
        💫
      </div>
      <div className="absolute top-1/3 right-2 text-sm animate-gentle-bounce" style={{ animationDelay: "1.5s" }}>
        💝
      </div>

      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-sparkle"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}

      <div className="text-center relative z-10">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-primary mb-4 animate-fade-in-up hover-lift">
          Nuestro Amor Eterno
        </h1>

        <div className="h-16 flex items-center justify-center">
          <p
            key={currentQuote}
            className="text-lg md:text-xl text-muted-foreground italic animate-fade-in-up text-balance"
            style={{ animationDelay: "0.2s" }}
          >
            &ldquo;{LOVE_QUOTES[currentQuote]}&rdquo;
          </p>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <Card
            className="px-6 py-3 bg-primary/10 border-primary/20 hover-lift animate-slide-in-right"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="text-sm font-medium text-primary">👨‍❤️‍👩 Juntos desde siempre</p>
          </Card>
          <Card
            className="px-6 py-3 bg-accent/10 border-accent/20 hover-lift animate-slide-in-right"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="text-sm font-medium text-accent">💝 Infinitos recuerdos</p>
          </Card>
        </div>

        <div className="mt-6">
          <Card className="inline-block px-8 py-4 bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30 animate-romantic-glow">
            <p className="text-2xl font-bold text-primary animate-pulse-heart">
              💕 {daysTogether ?? "..."} días de amor puro
              💕
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
