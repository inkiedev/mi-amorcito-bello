"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import Image from "next/image"
import { notifyRomanticDataChanged } from "@/hooks/use-romantic-data-version"
import type { RomanticMemory } from "@/lib/types"

interface AddPhotoModalProps {
  children: React.ReactNode
  photo?: RomanticMemory
}

export function AddPhotoModal({ children, photo }: AddPhotoModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [tags, setTags] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const isEditing = Boolean(photo)

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const syncFormFromPhoto = () => {
    setTitle(photo?.title ?? "")
    setDescription(photo?.description ?? "")
    setDate(photo ? new Date(`${photo.date}T00:00:00`) : undefined)
    setTags(photo?.tags.join(", ") ?? "")
    setFile(null)
    setPreviewUrl(photo?.image_url ?? "")
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      syncFormFromPhoto()
    }

    setOpen(nextOpen)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !date || !title.trim() || (!file && !photo)) return

    setIsUploading(true)
    try {
      const { uploadPhoto, getPhotoUrl, createMemory, updateMemory } = await import("@/lib/supabase/queries")
      let imageUrl = photo?.image_url

      if (file) {
        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        // Upload photo to Supabase Storage
        await uploadPhoto(file, fileName)
        
        // Get public URL
        imageUrl = await getPhotoUrl(fileName)
      }
      
      const payload = {
        title: title.trim(),
        description: description.trim(),
        content: description.trim(),
        type: 'photo',
        date: date.toISOString().split('T')[0],
        image_url: imageUrl,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        is_favorite: false
      } as const

      if (photo) {
        await updateMemory(photo.id, {
          ...payload,
          is_favorite: photo.is_favorite,
        })
      } else {
        await createMemory({
          ...payload,
          created_by: user.id,
        })
      }

      // Reset form
      setTitle("")
      setDescription("")
      setDate(undefined)
      setTags("")
      setFile(null)
      setPreviewUrl("")
      setOpen(false)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Error al subir la foto. Intenta de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-sm border-secondary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-secondary-foreground">
            📸 <span>{isEditing ? "Editar Foto" : "Subir Foto"}</span>
          </DialogTitle>
          <DialogDescription>Añade una foto especial a vuestra galería de recuerdos</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo">Foto</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={!isEditing}
              className="border-secondary/20 focus:border-secondary"
            />
            {previewUrl && (
              <div className="relative mt-2 h-32 w-full overflow-hidden rounded-md border border-secondary/20">
                <Image
                  src={previewUrl}
                  alt="Vista previa de la foto"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Nuestro primer viaje juntos"
              required
              className="border-secondary/20 focus:border-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe este momento especial..."
              rows={3}
              required
              className="border-secondary/20 focus:border-secondary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-secondary/20 hover:bg-secondary/10 bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Etiquetas (separadas por comas)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ej: vacaciones, playa, primer viaje"
              className="border-secondary/20 focus:border-secondary"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-muted hover:bg-muted/10 bg-transparent"
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-secondary hover:bg-secondary/90"
              disabled={isUploading || (!file && !isEditing)}
            >
              {isUploading ? "Guardando..." : isEditing ? "Guardar Cambios" : "📸 Subir Foto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
