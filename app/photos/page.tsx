"use client"

import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getPhotos } from "@/lib/supabase/queries"
import type { RomanticMemory } from "@/lib/types"
import { AddPhotoModal } from "@/components/add-photo-modal"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { getCoupleAuthorIcon } from "@/lib/utils"
import { useRomanticDataVersion } from "@/hooks/use-romantic-data-version"

export default function PhotosPage() {
  const { user } = useAuth()
  const dataVersion = useRomanticDataVersion()
  const [photos, setPhotos] = useState<RomanticMemory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "favorites" | "mine" | "theirs">("all")

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getPhotos()
        setPhotos(data)
      } catch (error) {
        console.error('Error fetching photos:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPhotos()
  }, [dataVersion])

  const filteredPhotos = photos.filter((photo) => {
    if (filter === "favorites") return photo.is_favorite
    if (filter === "mine") return photo.created_by === user?.id
    if (filter === "theirs") return photo.created_by !== user?.id
    return true
  })

  return (
    <div className="romantic-page min-h-screen">
      <NavigationHeader />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 text-center letter-reveal">
          <div className="mb-4 text-6xl animate-float">📸</div>
          <h1 className="script-title love-ribbon mb-8 text-5xl font-bold text-foreground md:text-6xl">Galería de Fotos</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Una colección visual de nuestros momentos más preciados y hermosos
          </p>
        </div>

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-secondary/20 hover:bg-secondary/10"
            onClick={() => setFilter("all")}
          >
            Todas las fotos
          </Button>
          <Button
            variant={filter === "favorites" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-secondary/20 hover:bg-secondary/10"
            onClick={() => setFilter("favorites")}
          >
            Favoritas
          </Button>
          <Button
            variant={filter === "mine" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-secondary/20 hover:bg-secondary/10"
            onClick={() => setFilter("mine")}
          >
            Por mí
          </Button>
          <Button
            variant={filter === "theirs" ? "default" : "outline"}
            size="sm"
            className="rounded-full border-secondary/20 hover:bg-secondary/10"
            onClick={() => setFilter("theirs")}
          >
            Por mi amor
          </Button>
          <AddPhotoModal>
            <Button className="rounded-full bg-secondary hover:bg-secondary/90">+ Subir Foto</Button>
          </AddPhotoModal>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-64 bg-muted/20 animate-pulse"></div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted/20 rounded animate-pulse"></div>
                    <div className="h-3 bg-muted/15 rounded animate-pulse w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6 animate-float">📸</div>
            <h3 className="text-2xl font-semibold text-muted-foreground mb-4">Sin fotos aún</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Comienza subiendo vuestra primera foto especial juntos
            </p>
            <AddPhotoModal>
              <Button className="bg-secondary hover:bg-secondary/90">
                📸 Subir Primera Foto
              </Button>
            </AddPhotoModal>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <Card className="glass-panel">
            <CardContent className="p-10 text-center">
              <div className="mb-4 text-5xl">⌕</div>
              <h3 className="script-title mb-2 text-3xl text-foreground">No hay fotos en este filtro</h3>
              <p className="text-muted-foreground">Cambia el filtro o sube una nueva foto.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => (
              <Card
                key={photo.id}
                className="romantic-card group overflow-hidden p-0"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={photo.image_url || "/file.svg"}
                    alt={photo.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-secondary/90 text-secondary-foreground">
                      {getCoupleAuthorIcon(photo.created_by, user?.id)}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="font-medium text-lg mb-1">{photo.title}</h3>
                    <p className="text-sm opacity-90">{new Date(photo.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-wrap gap-1 mb-3">
                    {photo.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-secondary/5 border-secondary/20">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  {photo.is_favorite && <Badge className="bg-secondary text-secondary-foreground">Favorita</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="fixed bottom-8 right-8">
          <AddPhotoModal>
            <Button size="lg" className="size-14 rounded-full bg-secondary shadow-lg hover:bg-secondary/90">
              <span className="text-2xl">📸</span>
            </Button>
          </AddPhotoModal>
        </div>
      </div>
    </div>
  )
}
