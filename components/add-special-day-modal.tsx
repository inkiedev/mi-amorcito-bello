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

interface AddSpecialDayModalProps {
  children: React.ReactNode
}

type SpecialDayCategory = "anniversary" | "first-time" | "milestone" | "celebration"

export function AddSpecialDayModal({ children }: AddSpecialDayModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState<Date>()
  const [category, setCategory] = useState<SpecialDayCategory>("milestone")
  const [isRecurring, setIsRecurring] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user || !date || !title.trim()) return

    try {
      const { createSpecialDay } = await import("@/lib/supabase/queries")
      
      await createSpecialDay({
        title: title.trim(),
        description: description.trim(),
        date: date.toISOString().split('T')[0],
        category,
        is_recurring: isRecurring,
        created_by: user.id
      })

      // Resetear formulario
      setTitle("")
      setDescription("")
      setDate(undefined)
      setCategory("milestone")
      setIsRecurring(false)
      setOpen(false)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error('Error creating special day:', error)
      alert('Error al guardar el día especial. Intenta de nuevo.')
    }
  }

  const categories: Array<{ value: SpecialDayCategory; label: string; description: string }> = [
    { value: "anniversary", label: "💕 Aniversario", description: "Fechas de aniversario importantes" },
    { value: "first-time", label: "⭐ Primera vez", description: "Primeras experiencias juntos" },
    { value: "milestone", label: "🏆 Hito", description: "Logros y momentos importantes" },
    { value: "celebration", label: "🎉 Celebración", description: "Fiestas y celebraciones especiales" }
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-card/95 backdrop-blur-sm border-primary/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            🎉 <span>Añadir Día Especial</span>
          </DialogTitle>
          <DialogDescription>Marca una fecha importante en vuestra historia de amor</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Nuestro primer beso"
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
              placeholder="Describe qué hace especial este día..."
              rows={3}
              required
              className="border-primary/20 focus:border-primary resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label>Fecha</Label>
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
            <Label>Categoría</Label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  type="button"
                  variant={category === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategory(cat.value)}
                  className={`text-left justify-start h-auto p-3 ${
                    category === cat.value 
                      ? "bg-primary text-primary-foreground" 
                      : "border-primary/20 hover:bg-primary/10 bg-transparent"
                  }`}
                >
                  <div>
                    <div className="font-medium text-sm">{cat.label}</div>
                    <div className="text-xs opacity-70">{cat.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded border-primary/20"
            />
            <Label htmlFor="isRecurring" className="text-sm">
              🔄 Este día se repite cada año
            </Label>
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
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
              🎉 Guardar Día Especial
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
