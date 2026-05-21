"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Clapperboard,
  Coffee,
  Heart,
  MapPin,
  Pencil,
  Plus,
  Search,
  Soup,
  Star,
  Trash2,
  Utensils,
} from "lucide-react"
import { NavigationHeader } from "@/components/navigation-header"
import { TasteEntryModal } from "@/components/taste-entry-modal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/auth-context"
import { notifyRomanticDataChanged, useRomanticDataVersion } from "@/hooks/use-romantic-data-version"
import { deleteTasteEntry, getTasteEntries } from "@/lib/supabase/queries"
import type { TasteEntry } from "@/lib/types"
import { getCoupleAuthorLabel } from "@/lib/utils"

type TasteFilter = "all" | TasteEntry["type"] | "repeat" | "avoid"
type SortMode = "newest" | "best" | "worst"

const typeLabels: Record<TasteEntry["type"], string> = {
  movie: "Película",
  series: "Serie",
  restaurant: "Restaurante",
  food: "Comida",
  drink: "Bebida",
  place: "Lugar",
  activity: "Actividad",
  other: "Otro",
}

const typeIcons: Record<TasteEntry["type"], typeof Star> = {
  movie: Clapperboard,
  series: Clapperboard,
  restaurant: Utensils,
  food: Soup,
  drink: Coffee,
  place: MapPin,
  activity: Heart,
  other: Star,
}

const filterOptions: Array<{ value: TasteFilter; label: string }> = [
  { value: "all", label: "Todo" },
  { value: "movie", label: "Películas" },
  { value: "restaurant", label: "Restaurantes" },
  { value: "food", label: "Comidas" },
  { value: "place", label: "Lugares" },
  { value: "repeat", label: "Repetir" },
  { value: "avoid", label: "Evitar" },
]

function getRatingTone(rating: number) {
  if (rating >= 8.5) return "border-emerald-500/25 bg-emerald-500/10 text-emerald-700"
  if (rating >= 6.5) return "border-secondary/25 bg-secondary/10 text-secondary"
  if (rating >= 4.5) return "border-amber-500/25 bg-amber-500/10 text-amber-700"

  return "border-rose-500/25 bg-rose-500/10 text-rose-700"
}

function getAverage(entries: TasteEntry[]) {
  if (entries.length === 0) return 0

  const total = entries.reduce((sum, entry) => sum + Number(entry.rating), 0)
  return total / entries.length
}

export default function TastesPage() {
  const { user } = useAuth()
  const dataVersion = useRomanticDataVersion()
  const [entries, setEntries] = useState<TasteEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<TasteFilter>("all")
  const [sortMode, setSortMode] = useState<SortMode>("newest")
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const data = await getTasteEntries()
        setEntries(data)
      } catch (error) {
        console.error("Error fetching taste entries:", error)
        setErrorMessage("No pude cargar gustos. Si acabas de actualizar la app, ejecuta el SQL nuevo en Supabase.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [dataVersion])

  const visibleEntries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return entries
      .filter((entry) => {
        if (filter === "repeat") return entry.would_repeat
        if (filter === "avoid") return !entry.would_repeat
        if (filter !== "all") return entry.type === filter

        return true
      })
      .filter((entry) => {
        if (!query) return true

        return [entry.title, entry.location ?? "", entry.notes ?? "", ...entry.tags]
          .some((value) => value.toLowerCase().includes(query))
      })
      .sort((a, b) => {
        if (sortMode === "best") return Number(b.rating) - Number(a.rating)
        if (sortMode === "worst") return Number(a.rating) - Number(b.rating)

        return new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime()
      })
  }, [entries, filter, searchTerm, sortMode])

  const average = getAverage(entries)
  const favorite = entries.length > 0
    ? [...entries].sort((a, b) => Number(b.rating) - Number(a.rating))[0]
    : null
  const avoidCount = entries.filter((entry) => !entry.would_repeat || Number(entry.rating) < 5).length

  const handleDeleteEntry = async (entry: TasteEntry) => {
    const confirmed = window.confirm(`¿Eliminar "${entry.title}" de la bitácora de gustos?`)
    if (!confirmed) return

    try {
      await deleteTasteEntry(entry.id)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error deleting taste entry:", error)
      alert("No pude eliminar este gusto. Intenta de nuevo.")
    }
  }

  return (
    <div className="romantic-page min-h-screen">
      <NavigationHeader />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 text-center letter-reveal">
          <div className="mx-auto mb-4 grid size-20 place-items-center rounded-full border border-secondary/25 bg-secondary/10 text-secondary candle-glow">
            <Star className="size-9 fill-current" />
          </div>
          <h1 className="script-title love-ribbon mb-8 text-5xl font-bold text-foreground md:text-6xl">
            Bitácora de Gustos
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Películas, restaurantes, comidas y lugares con nota real: para recordar qué repetir y qué dejar como anécdota.
          </p>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="romantic-card">
            <CardContent className="flex items-center justify-between gap-4 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Promedio</p>
                <p className="mt-2 text-4xl font-bold text-secondary">{average.toFixed(1)}/10</p>
              </div>
              <Star className="size-10 fill-current text-secondary" />
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Favorito actual</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{favorite?.title ?? "Aún por descubrir"}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {favorite ? `${Number(favorite.rating).toFixed(1)}/10 · ${typeLabels[favorite.type]}` : "Guarden el primer gusto para empezar."}
              </p>
            </CardContent>
          </Card>

          <Card className="romantic-card">
            <CardContent className="p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">No repetir</p>
              <p className="mt-2 text-4xl font-bold text-rose-600">{avoidCount}</p>
              <p className="mt-1 text-sm text-muted-foreground">Cosas que no convencieron del todo.</p>
            </CardContent>
          </Card>
        </section>

        <Card className="glass-panel mb-8">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
              <div className="relative xl:max-w-sm xl:flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Buscar por nombre, lugar, nota o etiqueta..."
                  className="romantic-input pl-9"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {filterOptions.map((item) => (
                  <Button
                    key={item.value}
                    variant={filter === item.value ? "default" : "outline"}
                    size="sm"
                    className="rounded-full"
                    onClick={() => setFilter(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 xl:ml-auto">
                <Button
                  variant={sortMode === "newest" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSortMode("newest")}
                >
                  Recientes
                </Button>
                <Button
                  variant={sortMode === "best" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSortMode("best")}
                >
                  Mejor nota
                </Button>
                <Button
                  variant={sortMode === "worst" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setSortMode("worst")}
                >
                  Peor nota
                </Button>
                <TasteEntryModal>
                  <Button className="rounded-full bg-secondary hover:bg-secondary/90">
                    <Plus data-icon="inline-start" />
                    Gusto
                  </Button>
                </TasteEntryModal>
              </div>
            </div>
          </CardContent>
        </Card>

        {errorMessage ? (
          <Card className="glass-panel">
            <CardContent className="p-8 text-center text-rose-700">{errorMessage}</CardContent>
          </Card>
        ) : isLoading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card key={item} className="animate-pulse">
                <CardContent className="h-44 rounded-lg bg-muted/20" />
              </Card>
            ))}
          </div>
        ) : entries.length === 0 ? (
          <Card className="glass-panel">
            <CardContent className="p-12 text-center">
              <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-secondary/10 text-secondary">
                <Star className="size-8 fill-current" />
              </div>
              <h2 className="script-title text-3xl text-foreground">Todavía no hay gustos guardados</h2>
              <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                Empiecen con una película, una comida o un restaurante. La memoria futura se los va a agradecer.
              </p>
              <TasteEntryModal>
                <Button className="mt-6 rounded-full">Guardar Primer Gusto</Button>
              </TasteEntryModal>
            </CardContent>
          </Card>
        ) : visibleEntries.length === 0 ? (
          <Card className="glass-panel">
            <CardContent className="p-10 text-center">
              <h2 className="script-title text-3xl text-foreground">No encontré nada con esos filtros</h2>
              <p className="mt-2 text-muted-foreground">Prueba otra categoría o limpia la búsqueda.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleEntries.map((entry, index) => {
              const Icon = typeIcons[entry.type]
              const rating = Number(entry.rating)

              return (
                <Card
                  key={entry.id}
                  className="romantic-card overflow-hidden letter-reveal"
                  style={{ animationDelay: `${Math.min(index, 6) * 0.04}s` }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="bg-secondary/5 text-secondary">
                            <Icon className="mr-1 size-3" />
                            {typeLabels[entry.type]}
                          </Badge>
                          <Badge variant="outline" className={getRatingTone(rating)}>
                            {rating.toFixed(1)}/10
                          </Badge>
                        </div>
                        <CardTitle className="script-title text-3xl text-foreground">{entry.title}</CardTitle>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Por {getCoupleAuthorLabel(entry.created_by, user?.id)} ·{" "}
                          {new Date(`${entry.entry_date}T00:00:00`).toLocaleDateString()}
                        </p>
                      </div>
                      <Star className={`size-8 shrink-0 ${rating >= 8 ? "fill-current text-secondary" : "text-muted-foreground"}`} />
                    </div>
                  </CardHeader>

                  <CardContent>
                    {entry.location && (
                      <p className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="size-4 text-secondary" />
                        {entry.location}
                      </p>
                    )}
                    {entry.notes && <p className="mb-4 line-clamp-4 leading-6 text-muted-foreground">{entry.notes}</p>}
                    <div className="mb-4 flex flex-wrap gap-2">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="bg-primary/5 text-primary">
                          {tag}
                        </Badge>
                      ))}
                      <Badge className={entry.would_repeat ? "bg-emerald-600 text-white" : "bg-rose-600 text-white"}>
                        {entry.would_repeat ? "Repetir" : "No repetir"}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <TasteEntryModal entry={entry}>
                        <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                          <Pencil data-icon="inline-start" />
                          Editar
                        </Button>
                      </TasteEntryModal>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleDeleteEntry(entry)}
                      >
                        <Trash2 data-icon="inline-start" />
                        Eliminar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        <div className="fixed bottom-8 right-8">
          <TasteEntryModal>
            <Button size="lg" className="size-14 rounded-full bg-secondary shadow-lg hover:bg-secondary/90" aria-label="Nuevo gusto">
              <Star className="size-6 fill-current" />
            </Button>
          </TasteEntryModal>
        </div>
      </div>
    </div>
  )
}
