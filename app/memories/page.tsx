"use client"

import { useState, useEffect } from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { deleteMemory, getMemories, updateMemory } from "@/lib/supabase/queries"
import type { RomanticMemory } from "@/lib/types"
import { AddMemoryModal } from "@/components/add-memory-modal"
import { useAuth } from "@/contexts/auth-context"
import { getCoupleAuthorIcon, getCoupleAuthorLabel } from "@/lib/utils"
import { notifyRomanticDataChanged, useRomanticDataVersion } from "@/hooks/use-romantic-data-version"
import { Heart, Pencil, Trash2 } from "lucide-react"

export default function MemoriesPage() {
  const { user } = useAuth()
  const dataVersion = useRomanticDataVersion()
  const [selectedMemory, setSelectedMemory] = useState<RomanticMemory | null>(null)
  const [memories, setMemories] = useState<RomanticMemory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFavorites, setShowFavorites] = useState(false)
  const [sortMode, setSortMode] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const data = await getMemories()
        setMemories(data)
      } catch (error) {
        console.error('Error fetching memories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMemories()
  }, [dataVersion])

  const filteredMemories = memories
    .filter((memory) => {
      const query = searchTerm.trim().toLowerCase()
      if (!query) return true

      return [memory.title, memory.description, memory.content, ...memory.tags]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    })
    .filter((memory) => (showFavorites ? memory.is_favorite : true))
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortMode === "newest" ? dateB - dateA : dateA - dateB
    })

  const handleToggleFavorite = async (memory: RomanticMemory) => {
    try {
      await updateMemory(memory.id, { is_favorite: !memory.is_favorite })
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error updating memory favorite:", error)
      alert("No pude actualizar el favorito. Intenta de nuevo.")
    }
  }

  const handleDeleteMemory = async (memory: RomanticMemory) => {
    const confirmed = window.confirm(`¿Eliminar "${memory.title}" de sus recuerdos?`)
    if (!confirmed) return

    try {
      await deleteMemory(memory.id)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error deleting memory:", error)
      alert("No pude eliminar el recuerdo. Intenta de nuevo.")
    }
  }

  return (
    <div className="romantic-page min-h-screen">
      <NavigationHeader />
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 text-center letter-reveal">
          <div className="mb-4 text-6xl candle-glow">📖</div>
          <h1 className="script-title love-ribbon mb-8 text-5xl font-bold text-foreground md:text-6xl">
            Nuestras Historias
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Cada recuerdo es una página de nuestra historia, escrita con amor y guardada para siempre
          </p>
        </div>

        <Card className="glass-panel mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-4 md:flex-row">
              <div className="flex-1">
                <Input
                  placeholder="Buscar en nuestras historias..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="romantic-input"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={showFavorites ? "default" : "outline"}
                  size="sm"
                  className="rounded-full border-primary/20 hover:bg-primary/10"
                  onClick={() => setShowFavorites((current) => !current)}
                >
                  💕 Favoritos
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-primary/20 bg-transparent hover:bg-primary/10"
                  onClick={() => setSortMode((current) => (current === "newest" ? "oldest" : "newest"))}
                >
                  📅 {sortMode === "newest" ? "Recientes" : "Antiguos"}
                </Button>
                <AddMemoryModal>
                  <Button className="rounded-full bg-primary hover:bg-primary/90">+ Nueva Historia</Button>
                </AddMemoryModal>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="h-6 bg-muted/20 rounded w-3/4"></div>
                      <div className="h-4 bg-muted/15 rounded w-1/2"></div>
                    </div>
                    <div className="w-8 h-8 bg-muted/20 rounded-full"></div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/20 rounded"></div>
                    <div className="h-4 bg-muted/15 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 animate-pulse-heart">📖</div>
            <h3 className="text-2xl font-semibold text-muted-foreground mb-4">Sin historias aún</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comienza escribiendo vuestra primera historia de amor
            </p>
            <AddMemoryModal>
              <Button className="bg-primary hover:bg-primary/90">
                📖 Escribir Primera Historia
              </Button>
            </AddMemoryModal>
          </div>
        ) : filteredMemories.length === 0 ? (
          <Card className="glass-panel">
            <CardContent className="p-10 text-center">
              <div className="mb-4 text-5xl">⌕</div>
              <h3 className="script-title mb-2 text-3xl text-foreground">No encontré esa historia</h3>
              <p className="text-muted-foreground">Prueba con otra palabra o cambia los filtros.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredMemories.map((memory) => (
              <Card
                key={memory.id}
                className="romantic-card"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="script-title text-3xl text-foreground transition-colors hover:text-secondary">
                          {memory.title}
                        </CardTitle>
                        {memory.is_favorite && <span className="text-xl animate-pulse-heart">💕</span>}
                      </div>
                      <CardDescription className="flex items-center gap-2 mb-2">
                        <span>Por {getCoupleAuthorLabel(memory.created_by, user?.id)}</span>
                        <span>•</span>
                        <span>{new Date(memory.date).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                    <div className="text-3xl">{getCoupleAuthorIcon(memory.created_by, user?.id)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">{memory.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {memory.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          className="rounded-full bg-primary hover:bg-primary/90"
                          onClick={() => setSelectedMemory(memory)}
                        >
                          📖 Leer historia completa
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-2xl text-primary mb-4">{selectedMemory?.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>📅 {selectedMemory?.date}</span>
                            <span>
                              👤{" "}
                              {selectedMemory
                                ? getCoupleAuthorLabel(selectedMemory.created_by, user?.id)
                                : "alguien especial"}
                            </span>
                          </div>
                          <div className="prose prose-lg max-w-none">
                            <p className="mb-4 leading-relaxed text-foreground">
                              {selectedMemory?.content}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <AddMemoryModal memory={memory}>
                      <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                        <Pencil data-icon="inline-start" />
                        Editar
                      </Button>
                    </AddMemoryModal>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full bg-transparent"
                      onClick={() => handleToggleFavorite(memory)}
                    >
                      <Heart data-icon="inline-start" className={memory.is_favorite ? "fill-current text-secondary" : ""} />
                      {memory.is_favorite ? "Quitar favorito" : "Favorito"}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleDeleteMemory(memory)}
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
          <AddMemoryModal>
            <Button size="lg" className="size-14 rounded-full bg-primary shadow-lg hover:bg-primary/90">
              <span className="text-2xl">+</span>
            </Button>
          </AddMemoryModal>
        </div>
      </div>
    </div>
  )
}
