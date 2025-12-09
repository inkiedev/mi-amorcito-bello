"use client"

import { useEffect, useState } from "react"

interface Heart {
  id: number
  left: number
  animationDuration: number
  size: number
  emoji: string
  delay: number
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([])

  const romanticEmojis = ["💕", "💖", "💗", "💘", "💝", "💞", "💟", "❤️", "🌹", "✨"]

  useEffect(() => {
    const createHeart = () => {
      const newHeart: Heart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        animationDuration: 4 + Math.random() * 3, // 4-7 segundos para más variedad
        size: 16 + Math.random() * 16, // 16-32px para más variedad
        emoji: romanticEmojis[Math.floor(Math.random() * romanticEmojis.length)], // Emoji aleatorio
        delay: Math.random() * 2, // Delay aleatorio para más naturalidad
      }

      setHearts((prev) => [...prev, newHeart])

      setTimeout(
        () => {
          setHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id))
        },
        (newHeart.animationDuration + newHeart.delay) * 1000,
      )
    }

    const interval = setInterval(createHeart, 3000)

    setTimeout(createHeart, 500)
    setTimeout(createHeart, 1500)
    setTimeout(createHeart, 2500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0 animate-float-up opacity-80"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `${heart.delay}s`,
            filter: "drop-shadow(0 0 8px rgba(255, 182, 193, 0.6))",
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  )
}
