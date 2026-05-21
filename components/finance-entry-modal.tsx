"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon, Landmark } from "lucide-react"
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
import type { FinanceEntry } from "@/lib/types"

interface FinanceEntryModalProps {
  children: React.ReactNode
  entry?: FinanceEntry
}

type FinanceEntryType = FinanceEntry["type"]

const categoriesByType: Record<FinanceEntryType, string[]> = {
  income: ["Salario", "Extra", "Regalo", "Ahorro", "Otro ingreso"],
  expense: ["Comida", "Casa", "Transporte", "Citas", "Salud", "Regalos", "Viajes", "Otro gasto"],
}

export function FinanceEntryModal({ children, entry }: FinanceEntryModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [type, setType] = useState<FinanceEntryType>("expense")
  const [category, setCategory] = useState(categoriesByType.expense[0])
  const [date, setDate] = useState<Date>(new Date())
  const [isSaving, setIsSaving] = useState(false)
  const isEditing = Boolean(entry)

  const syncFormFromEntry = () => {
    const nextType = entry?.type ?? "expense"
    setTitle(entry?.title ?? "")
    setDescription(entry?.description ?? "")
    setAmount(entry ? String(entry.amount) : "")
    setType(nextType)
    setCategory(entry?.category ?? categoriesByType[nextType][0])
    setDate(entry ? new Date(`${entry.entry_date}T00:00:00`) : new Date())
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      syncFormFromEntry()
    }

    setOpen(nextOpen)
  }

  const handleTypeChange = (nextType: FinanceEntryType) => {
    setType(nextType)
    setCategory(categoriesByType[nextType][0])
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!user || !title.trim()) return

    const parsedAmount = Number(amount)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      alert("Ingresa un monto válido mayor a 0.")
      return
    }

    setIsSaving(true)

    try {
      const { createFinanceEntry, updateFinanceEntry } = await import("@/lib/supabase/queries")
      const payload = {
        title: title.trim(),
        description: description.trim() || null,
        amount: parsedAmount,
        type,
        category,
        entry_date: date.toISOString().split("T")[0],
      }

      if (entry) {
        await updateFinanceEntry(entry.id, payload)
      } else {
        await createFinanceEntry({
          ...payload,
          created_by: user.id,
        })
      }

      setTitle("")
      setDescription("")
      setAmount("")
      setType("expense")
      setCategory(categoriesByType.expense[0])
      setDate(new Date())
      setOpen(false)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error saving finance entry:", error)
      alert("Error al guardar el movimiento. Intenta de nuevo.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-secondary/20 sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-secondary-foreground">
            <Landmark className="size-5" />
            <span>{isEditing ? "Editar Movimiento" : "Nuevo Movimiento"}</span>
          </DialogTitle>
          <DialogDescription>Registra ingresos y gastos como un mismo bolsillo compartido.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Button
              type="button"
              variant={type === "expense" ? "default" : "outline"}
              className="rounded-lg"
              onClick={() => handleTypeChange("expense")}
            >
              Gasto
            </Button>
            <Button
              type="button"
              variant={type === "income" ? "default" : "outline"}
              className="rounded-lg"
              onClick={() => handleTypeChange("income")}
            >
              Ingreso
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_0.75fr]">
            <div className="space-y-2">
              <Label htmlFor="finance-title">Detalle</Label>
              <Input
                id="finance-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ej: Cena juntos"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="finance-amount">Monto</Label>
              <Input
                id="finance-amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="finance-category">Categoría</Label>
              <select
                id="finance-category"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                {categoriesByType[type].map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="finance-description">Notas</Label>
            <Textarea
              id="finance-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Opcional: cómo se pagó, por qué fue, detalles útiles..."
              rows={3}
              className="resize-none"
            />
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
              {isSaving ? "Guardando..." : isEditing ? "Guardar Cambios" : "Guardar Movimiento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
