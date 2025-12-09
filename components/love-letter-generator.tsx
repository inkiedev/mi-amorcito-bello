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
import { Card, CardContent } from "@/components/ui/card"

interface LoveLetterGeneratorProps {
  children: React.ReactNode
}

export function LoveLetterGenerator({ children }: LoveLetterGeneratorProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [partnerName, setPartnerName] = useState("")
  const [occasion, setOccasion] = useState("")
  const [personalMessage, setPersonalMessage] = useState("")
  const [generatedLetter, setGeneratedLetter] = useState("")

  const letterTemplates = {
    anniversary: `Mi querido/a ${partnerName || "[Nombre]"},

Hoy celebramos otro año juntos, y mi corazón se llena de gratitud por cada momento que hemos compartido. ${personalMessage || "[Tu mensaje personal]"}

Eres la luz que ilumina mis días y la calma que tranquiliza mis noches. Cada día contigo es una nueva aventura, una nueva oportunidad de amarte más profundamente.

Gracias por ser mi compañero/a de vida, mi mejor amigo/a y mi amor eterno.

Con todo mi amor,
${user?.name || "[Tu nombre]"}`,

    general: `Mi amor ${partnerName || "[Nombre]"},

Mientras escribo estas líneas, no puedo evitar sonreír pensando en ti. ${personalMessage || "[Tu mensaje personal]"}

Eres esa persona especial que hace que todo tenga sentido, que convierte los días ordinarios en extraordinarios simplemente con tu presencia.

Tu amor es el regalo más hermoso que la vida me ha dado, y prometo cuidarlo y valorarlo cada día.

Te amo más de lo que las palabras pueden expresar,
${user?.name || "[Tu nombre]"}`,

    apology: `Mi querido/a ${partnerName || "[Nombre]"},

Sé que he cometido un error y quiero pedirte perdón de corazón. ${personalMessage || "[Tu mensaje personal]"}

Nuestro amor es demasiado valioso para dejarlo dañar por malentendidos. Eres la persona más importante en mi vida, y haré todo lo posible para enmendar mi error.

Espero que puedas perdonarme y que podamos seguir construyendo juntos esta hermosa historia de amor.

Con arrepentimiento y amor infinito,
${user?.name || "[Tu nombre]"}`,
  }

  const generateLetter = () => {
    const template = letterTemplates[occasion as keyof typeof letterTemplates] || letterTemplates.general
    setGeneratedLetter(template)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-card/95 backdrop-blur-sm border-accent/20">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-accent-foreground">
            ✍️ <span>Generador de Cartas de Amor</span>
          </DialogTitle>
          <DialogDescription>Crea una carta personalizada para expresar tus sentimientos</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="partnerName">Nombre de tu pareja</Label>
              <Input
                id="partnerName"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Mi amor"
                className="border-accent/20 focus:border-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="occasion">Ocasión</Label>
              <select
                id="occasion"
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3 py-2 border border-accent/20 rounded-md bg-background focus:border-accent focus:outline-none"
              >
                <option value="general">Carta general</option>
                <option value="anniversary">Aniversario</option>
                <option value="apology">Disculpa</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalMessage">Mensaje personal</Label>
            <Textarea
              id="personalMessage"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              placeholder="Añade algo personal que quieras incluir..."
              rows={3}
              className="border-accent/20 focus:border-accent resize-none"
            />
          </div>

          <Button onClick={generateLetter} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            💌 Generar Carta
          </Button>

          {generatedLetter && (
            <Card className="bg-gradient-to-br from-accent/5 to-primary/5 border-accent/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-accent-foreground">Tu Carta de Amor</h3>
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="border-accent/20 hover:bg-accent/10 bg-transparent"
                  >
                    📋 Copiar
                  </Button>
                </div>
                <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground font-serif">
                  {generatedLetter}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
