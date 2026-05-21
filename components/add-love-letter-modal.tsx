"use client"

import type React from "react"
import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
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

interface AddLoveLetterModalProps {
  children: React.ReactNode
}

export function AddLoveLetterModal({ children }: AddLoveLetterModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user || !title.trim() || !content.trim()) return

    setIsSaving(true)

    try {
      const { createMemory } = await import("@/lib/supabase/queries")

      await createMemory({
        title: title.trim(),
        description: content.trim().slice(0, 180),
        content: content.trim(),
        date: date.toISOString().split("T")[0],
        type: "memory",
        tags: ["carta"],
        created_by: user.id,
        is_favorite: false,
      })

      setTitle("")
      setContent("")
      setDate(new Date())
      setOpen(false)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error creating love letter:", error)
      alert("Error al guardar la carta. Intenta de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[620px] bg-card/95 backdrop-blur-sm border-accent/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-accent-foreground">
            💌 <span>Guardar Carta</span>
          </DialogTitle>
          <DialogDescription>Escribe una carta para conservarla junto a sus recuerdos.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="letter-title">Título</Label>
            <Input
              id="letter-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ej: Para cuando extrañes mi voz"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="letter-content">Carta</Label>
            <Textarea
              id="letter-content"
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder="Escribe lo que quieres que tu amor pueda volver a leer..."
              rows={8}
              required
              className="resize-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP", { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(selectedDate) => selectedDate && setDate(selectedDate)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSaving}
              className="flex-1 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="flex-1">
              {isSaving ? "Guardando..." : "Guardar Carta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
