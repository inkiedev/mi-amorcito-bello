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
import { notifyRomanticDataChanged } from "@/hooks/use-romantic-data-version"

interface AddQuoteModalProps {
  children: React.ReactNode
}

export function AddQuoteModal({ children }: AddQuoteModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState("")
  const [author, setAuthor] = useState("")
  const [context, setContext] = useState("")
  const [date, setDate] = useState<Date>(new Date())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !text.trim()) return

    try {
      const { createQuote } = await import("@/lib/supabase/queries")
      
      await createQuote({
        text: text.trim(),
        author: author.trim() || undefined,
        context: context.trim() || undefined,
        date: date.toISOString().split('T')[0],
        created_by: user.id,
        is_favorite: false
      })

      // Resetear formulario
      setText("")
      setAuthor("")
      setContext("")
      setDate(new Date())
      setOpen(false)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error('Error creating quote:', error)
      alert('Error al guardar la frase. Intenta de nuevo.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border-accent/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-accent-foreground">
            💬 <span>Añadir Nueva Frase</span>
          </DialogTitle>
          <DialogDescription>Guarda una frase especial que quieras recordar para siempre</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Frase</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Escribe aquí vuestra frase de amor..."
              rows={3}
              required
              className="border-accent/20 focus:border-accent resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author">Autor (opcional)</Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Ej: Mi corazón, Nuestro amor..."
              className="border-accent/20 focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="context">Contexto (opcional)</Label>
            <Input
              id="context"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Ej: Durante nuestra cena romántica..."
              className="border-accent/20 focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-accent/20 hover:bg-accent/10 bg-transparent"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "PPP", { locale: es })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-muted hover:bg-muted/10 bg-transparent"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
              💕 Guardar Frase
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
