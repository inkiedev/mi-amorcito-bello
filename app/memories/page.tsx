"use client"

import { useState, useEffect } from "react"
import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getMemories } from "@/lib/supabase/queries"
import type { RomanticMemory } from "@/lib/types"
import { AddMemoryModal } from "@/components/add-memory-modal"

export default function MemoriesPage() {
  const [selectedMemory, setSelectedMemory] = useState<RomanticMemory | null>(null)
  const [memories, setMemories] = useState<RomanticMemory[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
  }, [])

  const getMoodEmoji = (mood: string) => {
    const moods = {
      "nervous-excited": "😊💕",
      "overwhelming-love": "🥰💖",
      "reflective-growth": "🤗💪",
    }
    return moods[mood as keyof typeof moods] || "💕"
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header de la página */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-pulse-heart">📖</div>
          <h1 className="font-serif text-4xl font-bold text-primary mb-2">Nuestras Historias de Amor</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Cada recuerdo es una página de nuestra historia, escrita con amor y guardada para siempre
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1">
                <Input
                  placeholder="Buscar en nuestras historias..."
                  className="border-primary/20 focus:border-primary"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 bg-transparent">
                  💕 Favoritos
                </Button>
                <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10 bg-transparent">
                  📅 Por fecha
                </Button>
                <AddMemoryModal>
                  <Button className="bg-primary hover:bg-primary/90">+ Nueva Historia</Button>
                </AddMemoryModal>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de recuerdos mejorada */}
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
        ) : (
          <div className="grid gap-6">
            {memories.map((memory) => (
              <Card
                key={memory.id}
                className="hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 hover:scale-[1.02]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl text-primary hover:text-primary/80 transition-colors">
                          {memory.title}
                        </CardTitle>
                        {memory.is_favorite && <span className="text-xl animate-pulse-heart">💕</span>}
                      </div>
                      <CardDescription className="flex items-center gap-2 mb-2">
                        <span>Por {memory.created_by === "him" ? "él" : "ella"}</span>
                        <span>•</span>
                        <span>{new Date(memory.date).toLocaleDateString()}</span>
                      </CardDescription>
                    </div>
                    <div className="text-3xl">{memory.created_by === "him" ? "👨" : "👩"}</div>
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
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-105"
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
                            <span>👤 {selectedMemory?.created_by === "him" ? "Él" : "Ella"}</span>
                          </div>
                          <div className="prose prose-lg max-w-none">
                            <p className="mb-4 leading-relaxed text-foreground">
                              {selectedMemory?.content}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105"
                    >
                      💕 {memory.is_favorite ? "Favorito" : "Me encanta"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:bg-muted/10 transition-all duration-300 hover:scale-105"
                    >
                      ✏️ Editar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Botón flotante para agregar */}
        <div className="fixed bottom-8 right-8">
          <AddMemoryModal>
            <Button size="lg" className="rounded-full h-14 w-14 bg-primary hover:bg-primary/90 shadow-lg">
              <span className="text-2xl">+</span>
            </Button>
          </AddMemoryModal>
        </div>
      </div>
    </div>
  )
}
