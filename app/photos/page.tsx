"use client"

import { NavigationHeader } from "@/components/navigation-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { getPhotos } from "@/lib/supabase/queries"
import type { RomanticMemory } from "@/lib/types"
import { AddPhotoModal } from "@/components/add-photo-modal"

export default function PhotosPage() {
  const [photos, setPhotos] = useState<RomanticMemory[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header de la página */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">📸</div>
          <h1 className="font-serif text-4xl font-bold text-secondary-foreground mb-2">Galería de Fotos</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Una colección visual de nuestros momentos más preciados y hermosos
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button variant="outline" size="sm" className="border-secondary/20 hover:bg-secondary/10 bg-transparent">
            Todas las fotos
          </Button>
          <Button variant="outline" size="sm" className="border-secondary/20 hover:bg-secondary/10 bg-transparent">
            Favoritas
          </Button>
          <Button variant="outline" size="sm" className="border-secondary/20 hover:bg-secondary/10 bg-transparent">
            Por él
          </Button>
          <Button variant="outline" size="sm" className="border-secondary/20 hover:bg-secondary/10 bg-transparent">
            Por ella
          </Button>
          <AddPhotoModal>
            <Button className="bg-secondary hover:bg-secondary/90">+ Subir Foto</Button>
          </AddPhotoModal>
        </div>

        {/* Grid de fotos */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <Card
                key={photo.id}
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-secondary/10 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={photo.image_url || "/placeholder.svg"}
                    alt={photo.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-secondary/90 text-secondary-foreground">
                      {photo.created_by === "him" ? "👨" : "👩"}
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
                  <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" className="text-secondary hover:bg-secondary/10 p-0">
                      💕 {photo.is_favorite ? "Favorita" : ""}
                    </Button>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/10 p-2">
                        🔗
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-muted/10 p-2">
                        ⬇️
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Botón flotante para subir foto */}
        <div className="fixed bottom-8 right-8">
          <AddPhotoModal>
            <Button size="lg" className="rounded-full h-14 w-14 bg-secondary hover:bg-secondary/90 shadow-lg">
              <span className="text-2xl">📸</span>
            </Button>
          </AddPhotoModal>
        </div>
      </div>
    </div>
  )
}
