"use client"

import type React from "react"
import { useState } from "react"
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

interface AddPhotoModalProps {
  children: React.ReactNode
}

export function AddPhotoModal({ children }: AddPhotoModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [tags, setTags] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>("")

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
    
    if (!user || !date || !title.trim() || !file) return

    setIsUploading(true)
    try {
      const { uploadPhoto, getPhotoUrl, createMemory } = await import("@/lib/supabase/queries")
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      // Upload photo to Supabase Storage
      await uploadPhoto(file, fileName)
      
      // Get public URL
      const imageUrl = getPhotoUrl(fileName)
      
      // Create memory record
      await createMemory({
        title: title.trim(),
        description: description.trim(),
        content: description.trim(),
        type: 'photo',
        date: date.toISOString().split('T')[0],
        image_url: imageUrl,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        created_by: user.id,
        is_favorite: false
      })

      // Reset form
      setTitle("")
      setDescription("")
      setDate(undefined)
      setTags("")
      setFile(null)
      setPreviewUrl("")
      setOpen(false)
      
      // Reload page to show new photo
      window.location.reload()
    } catch (error) {
      console.error('Error uploading photo:', error)
      alert('Error al subir la foto. Intenta de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-card/95 backdrop-blur-sm border-secondary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-secondary-foreground">
            📸 <span>Subir Foto</span>
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
              required
              className="border-secondary/20 focus:border-secondary"
            />
            {previewUrl && (
              <div className="mt-2">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-md border border-secondary/20"
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
                <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
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
              disabled={isUploading || !file}
            >
              {isUploading ? "Subiendo..." : "📸 Subir Foto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}