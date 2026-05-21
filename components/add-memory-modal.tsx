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
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { notifyRomanticDataChanged } from "@/hooks/use-romantic-data-version"
import type { RomanticMemory } from "@/lib/types"

interface AddMemoryModalProps {
  children: React.ReactNode
  memory?: RomanticMemory
}

export function AddMemoryModal({ children, memory }: AddMemoryModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = Boolean(memory)

  useEffect(() => {
    if (!open) return

    setTitle(memory?.title ?? "")
    setDescription(memory?.description ?? "")
    setDate(memory ? new Date(`${memory.date}T00:00:00`) : undefined)
    setTags(memory?.tags ?? [])
    setNewTag("")
  }, [memory, open])

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !date) return

    setIsSaving(true)

    try {
      const { createMemory, updateMemory } = await import("@/lib/supabase/queries")
      const payload = {
        title,
        description,
        date: date.toISOString().split('T')[0],
        type: 'memory',
        content: description,
        tags,
        is_favorite: false
      } as const

      if (memory) {
        await updateMemory(memory.id, {
          ...payload,
          is_favorite: memory.is_favorite,
        })
      } else {
        await createMemory({
          ...payload,
          created_by: user.id,
        })
      }

      // Resetear formulario
      setTitle("")
      setDescription("")
      setDate(undefined)
      setTags([])
      setOpen(false)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error('Error creating memory:', error)
      alert('Error al guardar el recuerdo. Intenta de nuevo.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            💭 <span>{isEditing ? "Editar Recuerdo" : "Crear Nuevo Recuerdo"}</span>
          </DialogTitle>
          <DialogDescription>Guarda un momento especial que quieras recordar para siempre</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título del recuerdo</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Nuestra primera cita"
              required
              className="border-primary/20 focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Cuéntanos todos los detalles de este momento especial..."
              rows={4}
              required
              className="border-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha del recuerdo</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-primary/20 hover:bg-primary/10 bg-transparent"
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
            <Label>Etiquetas</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Añadir etiqueta"
                className="border-primary/20 focus:border-primary"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="border-primary/20 hover:bg-primary/10 bg-transparent"
              >
                +
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSaving}
              className="flex-1 border-muted hover:bg-muted/10 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="flex-1 bg-primary hover:bg-primary/90">
              {isSaving ? "Guardando..." : isEditing ? "Guardar Cambios" : "💕 Guardar Recuerdo"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
