"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Star } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { notifyRomanticDataChanged } from "@/hooks/use-romantic-data-version"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import type { TasteEntry } from "@/lib/types"

interface TasteEntryModalProps {
  children: React.ReactNode
  entry?: TasteEntry
}

type TasteEntryType = TasteEntry["type"]

const tasteTypes: Array<{ value: TasteEntryType; label: string }> = [
  { value: "movie", label: "Película" },
  { value: "series", label: "Serie" },
  { value: "restaurant", label: "Restaurante" },
  { value: "food", label: "Comida" },
  { value: "drink", label: "Bebida" },
  { value: "place", label: "Lugar" },
  { value: "activity", label: "Actividad" },
  { value: "other", label: "Otro" },
]

function normalizeRating(value: string) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return null

  return Math.round(Math.min(10, Math.max(0, parsed)) * 10) / 10
}

export function TasteEntryModal({ children, entry }: TasteEntryModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [type, setType] = useState<TasteEntryType>("movie")
  const [rating, setRating] = useState("8.0")
  const [date, setDate] = useState<Date>(new Date())
  const [location, setLocation] = useState("")
  const [notes, setNotes] = useState("")
  const [tags, setTags] = useState("")
  const [wouldRepeat, setWouldRepeat] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = Boolean(entry)

  const syncFormFromEntry = () => {
    setTitle(entry?.title ?? "")
    setType(entry?.type ?? "movie")
    setRating(entry ? Number(entry.rating).toFixed(1) : "8.0")
    setDate(entry ? new Date(`${entry.entry_date}T00:00:00`) : new Date())
    setLocation(entry?.location ?? "")
    setNotes(entry?.notes ?? "")
    setTags(entry?.tags.join(", ") ?? "")
    setWouldRepeat(entry?.would_repeat ?? true)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      syncFormFromEntry()
    }

    setOpen(nextOpen)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!user || !title.trim()) return

    const normalizedRating = normalizeRating(rating)
    if (normalizedRating === null) {
      alert("Ingresa una nota válida entre 0 y 10.")
      return
    }

    setIsSaving(true)

    try {
      const { createTasteEntry, updateTasteEntry } = await import("@/lib/supabase/queries")
      const payload = {
        title: title.trim(),
        type,
        rating: normalizedRating,
        entry_date: date.toISOString().split("T")[0],
        location: location.trim() || null,
        notes: notes.trim() || null,
        tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        would_repeat: wouldRepeat,
      }

      if (entry) {
        await updateTasteEntry(entry.id, payload)
      } else {
        await createTasteEntry({
          ...payload,
          created_by: user.id,
        })
      }

      setTitle("")
      setType("movie")
      setRating("8.0")
      setDate(new Date())
      setLocation("")
      setNotes("")
      setTags("")
      setWouldRepeat(true)
      setOpen(false)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error saving taste entry:", error)
      alert("Error al guardar este gusto. Intenta de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-secondary/20 sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-secondary-foreground">
            <Star className="size-5 fill-current" />
            <span>{isEditing ? "Editar Gusto" : "Nuevo Gusto"}</span>
          </DialogTitle>
          <DialogDescription>
            Guarda una película, comida, lugar o experiencia con una nota para decidir qué repetir.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[1fr_0.48fr]">
            <div className="space-y-2">
              <Label htmlFor="taste-title">Nombre</Label>
              <Input
                id="taste-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej: Pastas de aquel restaurante"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taste-rating">Nota /10</Label>
              <Input
                id="taste-rating"
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-4">
            {tasteTypes.map((item) => (
              <Button
                key={item.value}
                type="button"
                variant={type === item.value ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setType(item.value)}
              >
                {item.label}
              </Button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Fecha</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start bg-transparent text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(date, "PPP", { locale: es })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={(selectedDate) => selectedDate && setDate(selectedDate)} />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taste-location">Lugar o contexto</Label>
              <Input
                id="taste-location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Ej: Quito, Netflix, casa..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="taste-notes">Notas</Label>
            <Textarea
              id="taste-notes"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Qué les gustó, qué no, si volverían, qué pedir de nuevo..."
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="taste-tags">Etiquetas</Label>
            <Input
              id="taste-tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="Ej: cita, italiano, drama, barato"
            />
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-secondary/15 bg-secondary/5 p-3">
            <input
              id="taste-repeat"
              type="checkbox"
              checked={wouldRepeat}
              onChange={(event) => setWouldRepeat(event.target.checked)}
              className="size-4 rounded border-secondary/30"
            />
            <Label htmlFor="taste-repeat" className="text-sm">
              Lo repetiríamos o lo recomendamos para otra vez
            </Label>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isSaving} className="flex-1 bg-transparent">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Guardar Gusto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
