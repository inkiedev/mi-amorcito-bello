"use client"

import { UserProfile } from "@/components/user-profile"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function NavigationHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 romantic-particles">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 hover-lift group">
          <span className="text-2xl animate-pulse-heart group-hover:animate-gentle-bounce">💕</span>
          <span className="font-serif text-xl font-bold text-primary transition-all duration-300 group-hover:text-primary/80">
            Nuestro Amor
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/memories">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover-glow group"
            >
              <span className="group-hover:animate-gentle-bounce">💭</span> Recuerdos
            </Button>
          </Link>
          <Link href="/photos">
            <Button
              variant="ghost"
              className="hover:bg-secondary/10 transition-all duration-300 hover:scale-105 hover-glow group"
            >
              <span className="group-hover:animate-sparkle">📸</span> Fotos
            </Button>
          </Link>
          <Link href="/quotes">
            <Button
              variant="ghost"
              className="hover:bg-accent/10 transition-all duration-300 hover:scale-105 hover-glow group"
            >
              <span className="group-hover:animate-pulse-heart">💬</span> Frases
            </Button>
          </Link>
          <Link href="/special-days">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 transition-all duration-300 hover:scale-105 hover-glow group"
            >
              <span className="group-hover:animate-gentle-bounce">🎉</span> Días Especiales
            </Button>
          </Link>
          <Link href="/calendar">
            <Button
              variant="ghost"
              className="hover:bg-accent/10 transition-all duration-300 hover:scale-105 hover-glow group"
            >
              <span className="group-hover:animate-bounce-slow">📅</span> Calendario
            </Button>
          </Link>
        </nav>

        <div className="animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
