import Link from "next/link"
import { CalendarDays, Camera, LibraryBig, Mail, Plus, Quote, Sparkles } from "lucide-react"
import { ActivityFeed } from "@/components/activity-feed"
import { AddMemoryModal } from "@/components/add-memory-modal"
import { AddPhotoModal } from "@/components/add-photo-modal"
import { AddQuoteModal } from "@/components/add-quote-modal"
import { DashboardStats } from "@/components/dashboard-stats"
import { FloatingHearts } from "@/components/floating-hearts"
import { LoveCalendar } from "@/components/love-calendar"
import { LoveCounter } from "@/components/love-counter"
import { LoveLetterGenerator } from "@/components/love-letter-generator"
import { LoveQuoteWidget } from "@/components/love-quote-widget"
import { NavigationHeader } from "@/components/navigation-header"
import { RecentMemories } from "@/components/recent-memories"
import { RomanticNotifications } from "@/components/romantic-notifications"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const destinations = [
  {
    href: "/memories",
    title: "Recuerdos",
    description: "Historias, detalles y escenas que merecen volver.",
    icon: LibraryBig,
    accent: "text-primary",
  },
  {
    href: "/photos",
    title: "Fotos",
    description: "La galería viva de sus momentos favoritos.",
    icon: Camera,
    accent: "text-secondary",
  },
  {
    href: "/quotes",
    title: "Frases",
    description: "Palabras pequeñas con eco grande.",
    icon: Quote,
    accent: "text-accent",
  },
  {
    href: "/special-days",
    title: "Fechas",
    description: "Días que cambiaron el calendario.",
    icon: Sparkles,
    accent: "text-secondary",
  },
  {
    href: "/calendar",
    title: "Calendario",
    description: "Todo el mapa emocional por mes.",
    icon: CalendarDays,
    accent: "text-primary",
  },
  {
    href: "/love-letters",
    title: "Cartas",
    description: "Mensajes largos para leer despacio.",
    icon: Mail,
    accent: "text-accent",
  },
]

export default function HomePage() {
  return (
    <div className="romantic-page min-h-screen">
      <NavigationHeader />
      <FloatingHearts />
      <RomanticNotifications />

      <main className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8">
        <section className="grid min-h-[calc(100vh-8rem)] items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="letter-reveal">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.32em] text-secondary">bitácora de dos</p>
            <h1 className="script-title love-ribbon max-w-3xl text-6xl font-bold leading-none text-foreground md:text-8xl">
              Su universo, guardado con luz.
            </h1>
            <p className="mt-10 max-w-2xl text-lg leading-8 text-muted-foreground">
              Fotos, cartas, fechas y frases reunidas como constelaciones pequeñas: cada una apunta a una parte de ustedes.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <AddMemoryModal>
                <Button className="rounded-full bg-primary px-5 text-primary-foreground shadow-[0_0_38px_color-mix(in_oklch,var(--primary),transparent_68%)] hover:bg-primary/90">
                  <Plus data-icon="inline-start" />
                  Nuevo Recuerdo
                </Button>
              </AddMemoryModal>
              <AddPhotoModal>
                <Button variant="outline" className="rounded-full bg-transparent">
                  <Camera data-icon="inline-start" />
                  Subir Foto
                </Button>
              </AddPhotoModal>
              <LoveLetterGenerator>
                <Button variant="ghost" className="rounded-full text-secondary hover:bg-secondary/10 hover:text-secondary">
                  <Mail data-icon="inline-start" />
                  Carta
                </Button>
              </LoveLetterGenerator>
            </div>
          </div>

          <Card className="glass-panel overflow-hidden rounded-lg letter-reveal" style={{ animationDelay: "0.12s" }}>
            <CardContent className="p-5 md:p-7">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">ahora mismo</p>
                  <h2 className="script-title text-4xl font-bold text-foreground">Tiempo juntos</h2>
                </div>
                <div className="grid size-14 place-items-center rounded-full border border-secondary/30 bg-secondary/10 text-secondary candle-glow">
                  ♥
                </div>
              </div>
              <LoveCounter />
            </CardContent>
          </Card>
        </section>

        <section className="letter-reveal" style={{ animationDelay: "0.18s" }}>
          <DashboardStats />
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((item, index) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="letter-reveal" style={{ animationDelay: `${0.08 * index}s` }}>
                <Card className="romantic-card h-full rounded-lg">
                  <CardContent className="relative z-10 flex h-full flex-col gap-5 p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className={`grid size-12 place-items-center rounded-full border border-current/25 bg-current/10 ${item.accent}`}>
                        <Icon className="size-5" />
                      </div>
                      <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">abrir</span>
                    </div>
                    <div>
                      <h3 className="script-title text-3xl font-bold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <RecentMemories />
            <LoveQuoteWidget />
          </div>
          <div className="flex flex-col gap-6">
            <LoveCalendar />
            <ActivityFeed />
          </div>
        </section>

        <section className="glass-panel rounded-lg p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-secondary">guardar algo nuevo</p>
              <h2 className="script-title mt-2 text-4xl font-bold text-foreground">Una escena más para el archivo</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <AddMemoryModal>
                <Button>Recuerdo</Button>
              </AddMemoryModal>
              <AddQuoteModal>
                <Button variant="outline" className="bg-transparent">
                  Frase
                </Button>
              </AddQuoteModal>
              <AddPhotoModal>
                <Button variant="outline" className="bg-transparent">
                  Foto
                </Button>
              </AddPhotoModal>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
