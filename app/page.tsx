import { RomanticBanner } from "@/components/romantic-banner"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentMemories } from "@/components/recent-memories"
import { LoveCalendar } from "@/components/love-calendar"
import { LoveQuoteWidget } from "@/components/love-quote-widget"
import { ActivityFeed } from "@/components/activity-feed"
import { LoveCounter } from "@/components/love-counter"
import { AddMemoryModal } from "@/components/add-memory-modal"
import { AddQuoteModal } from "@/components/add-quote-modal"
import { AddPhotoModal } from "@/components/add-photo-modal"
import { LoveLetterGenerator } from "@/components/love-letter-generator"
import { RomanticNotifications } from "@/components/romantic-notifications"
import { FloatingHearts } from "@/components/floating-hearts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { NavigationHeader } from "@/components/navigation-header"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <FloatingHearts />
      <RomanticNotifications />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <RomanticBanner />

        <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <DashboardStats />
        </div>

        <div className="mb-8 animate-slide-in-right" style={{ animationDelay: "0.4s" }}>
          <LoveCounter />
        </div>

        {/* Dashboard principal con widgets */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 space-y-6">
            <div className="animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
              <RecentMemories />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: "0.8s" }}>
              <LoveQuoteWidget />
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            <div className="animate-slide-in-right" style={{ animationDelay: "0.7s" }}>
              <LoveCalendar />
            </div>
            <div className="animate-slide-in-right" style={{ animationDelay: "0.9s" }}>
              <ActivityFeed />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="animate-fade-in-up" style={{ animationDelay: "1s" }}>
            <Link href="/memories">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-primary/5 border-primary/20 hover-lift hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <span className="animate-gentle-bounce">💭</span> <span>Nuestros Recuerdos</span>
                  </CardTitle>
                  <CardDescription>Momentos especiales que hemos vivido juntos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Guarda y revive todos esos momentos únicos que hacen especial nuestra historia
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "1.1s" }}>
            <Link href="/photos">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-secondary/5 border-secondary/20 hover-lift hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                    <span className="animate-sparkle">📸</span> <span>Galería de Fotos</span>
                  </CardTitle>
                  <CardDescription>Nuestras fotos más hermosas</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Una colección visual de nuestros momentos más preciados
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "1.2s" }}>
            <Link href="/quotes">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-accent/5 border-accent/20 hover-lift hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-foreground">
                    <span className="animate-pulse-heart">💬</span> <span>Frases de Amor</span>
                  </CardTitle>
                  <CardDescription>Palabras que nos llegan al corazón</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Frases románticas, promesas y palabras dulces que nos decimos
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "1.3s" }}>
            <Link href="/special-days">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-primary/5 border-primary/20 hover-lift hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <span className="animate-gentle-bounce">🎉</span> <span>Días Especiales</span>
                  </CardTitle>
                  <CardDescription>Fechas importantes en nuestra relación</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Aniversarios, primeras veces y celebraciones que marcaron nuestra historia
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "1.4s" }}>
            <Link href="/calendar">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-accent/5 border-accent/20 hover-lift hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-foreground">
                    <span className="animate-bounce-slow">📅</span> <span>Calendario del Amor</span>
                  </CardTitle>
                  <CardDescription>Vista interactiva de todos nuestros momentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Explora todos nuestros recuerdos, fotos y días especiales en un calendario hermoso
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "1.5s" }}>
            <Link href="/timeline">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-secondary/5 border-secondary/20 hover-lift hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-secondary-foreground">
                    <span className="animate-float">📅</span> <span>Línea de Tiempo</span>
                  </CardTitle>
                  <CardDescription>La cronología de nuestro amor</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Un viaje a través del tiempo de nuestra hermosa relación
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          <div className="animate-fade-in-up" style={{ animationDelay: "1.6s" }}>
            <Link href="/love-letters">
              <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-accent/5 border-accent/20 hover-lift hover-glow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-accent-foreground">
                    <span className="animate-pulse-heart">💌</span> <span>Cartas de Amor</span>
                  </CardTitle>
                  <CardDescription>Mensajes del corazón</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Cartas y mensajes especiales que nos hemos escrito con amor
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="animate-fade-in-up" style={{ animationDelay: "1.7s" }}>
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20 hover-glow romantic-particles">
            <CardHeader>
              <CardTitle className="text-center font-serif text-2xl text-primary animate-pulse-heart">
                💕 Crear Nuevo Recuerdo
              </CardTitle>
              <CardDescription className="text-center">¿Qué momento especial quieres guardar hoy?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-4">
                <AddMemoryModal>
                  <Button className="bg-primary hover:bg-primary/90 hover-lift transition-all duration-300 hover:scale-105">
                    📝 Escribir Recuerdo
                  </Button>
                </AddMemoryModal>
                <AddPhotoModal>
                  <Button
                    variant="outline"
                    className="border-secondary text-secondary-foreground hover:bg-secondary/10 bg-transparent hover-lift transition-all duration-300 hover:scale-105"
                  >
                    📸 Subir Foto
                  </Button>
                </AddPhotoModal>
                <AddQuoteModal>
                  <Button
                    variant="outline"
                    className="border-accent text-accent-foreground hover:bg-accent/10 bg-transparent hover-lift transition-all duration-300 hover:scale-105"
                  >
                    💬 Añadir Frase
                  </Button>
                </AddQuoteModal>
                <LoveLetterGenerator>
                  <Button
                    variant="outline"
                    className="border-accent text-accent-foreground hover:bg-accent/10 bg-transparent hover-lift transition-all duration-300 hover:scale-105"
                  >
                    ✍️ Generar Carta
                  </Button>
                </LoveLetterGenerator>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
