"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Pencil, Plus, Scale, Trash2, TrendingDown, TrendingUp, WalletCards } from "lucide-react"
import { FinanceEntryModal } from "@/components/finance-entry-modal"
import { NavigationHeader } from "@/components/navigation-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { notifyRomanticDataChanged, useRomanticDataVersion } from "@/hooks/use-romantic-data-version"
import { deleteFinanceEntry, getFinanceEntries } from "@/lib/supabase/queries"
import type { FinanceEntry } from "@/lib/types"

type FinanceFilter = "all" | FinanceEntry["type"]

const currencyFormatter = new Intl.NumberFormat("es-EC", {
  style: "currency",
  currency: "USD",
})

function formatMoney(value: number) {
  return currencyFormatter.format(value)
}

function getMonthKey(date: string) {
  return date.slice(0, 7)
}

export default function FinancesPage() {
  const dataVersion = useRomanticDataVersion()
  const [entries, setEntries] = useState<FinanceEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<FinanceFilter>("all")
  const [selectedMonth, setSelectedMonth] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true)
      setErrorMessage("")

      try {
        const data = await getFinanceEntries()
        setEntries(data)
      } catch (error) {
        console.error("Error fetching finance entries:", error)
        setErrorMessage("No pude cargar las finanzas. Si acabas de crear la base, vuelve a ejecutar el SQL actualizado.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchEntries()
  }, [dataVersion])

  const totals = useMemo(() => {
    return entries.reduce(
      (accumulator, entry) => {
        const amount = Number(entry.amount)

        if (entry.type === "income") {
          accumulator.income += amount
        } else {
          accumulator.expense += amount
        }

        return accumulator
      },
      { income: 0, expense: 0 },
    )
  }, [entries])

  const visibleEntries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return entries.filter((entry) => {
      const matchesType = filter === "all" || entry.type === filter
      const matchesMonth = !selectedMonth || getMonthKey(entry.entry_date) === selectedMonth
      const matchesSearch =
        !query ||
        [entry.title, entry.description ?? "", entry.category]
          .some((value) => value.toLowerCase().includes(query))

      return matchesType && matchesMonth && matchesSearch
    })
  }, [entries, filter, searchTerm, selectedMonth])

  const visibleTotals = useMemo(() => {
    return visibleEntries.reduce(
      (accumulator, entry) => {
        const amount = Number(entry.amount)

        if (entry.type === "income") {
          accumulator.income += amount
        } else {
          accumulator.expense += amount
        }

        return accumulator
      },
      { income: 0, expense: 0 },
    )
  }, [visibleEntries])

  const balance = totals.income - totals.expense
  const visibleBalance = visibleTotals.income - visibleTotals.expense

  const handleDeleteEntry = async (entry: FinanceEntry) => {
    const confirmed = window.confirm(`¿Eliminar "${entry.title}" de las finanzas conjuntas?`)
    if (!confirmed) return

    try {
      await deleteFinanceEntry(entry.id)
      notifyRomanticDataChanged()
    } catch (error) {
      console.error("Error deleting finance entry:", error)
      alert("No pude eliminar el movimiento. Intenta de nuevo.")
    }
  }

  return (
    <div className="romantic-page min-h-screen">
      <NavigationHeader />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 text-center letter-reveal">
          <div className="mb-4 inline-grid size-20 place-items-center rounded-full border border-secondary/25 bg-secondary/10 text-secondary candle-glow">
            <WalletCards className="size-9" />
          </div>
          <h1 className="script-title love-ribbon mb-8 text-5xl font-bold text-foreground md:text-6xl">
            Finanzas Juntos
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Un solo registro para lo que entra, lo que sale y lo que están construyendo entre los dos.
          </p>
        </div>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="romantic-card">
            <CardContent className="flex items-center justify-between gap-4 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Ingresos</p>
                <p className="mt-2 text-3xl font-bold text-emerald-600">{formatMoney(totals.income)}</p>
              </div>
              <div className="grid size-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
                <TrendingUp className="size-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="romantic-card">
            <CardContent className="flex items-center justify-between gap-4 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Gastos</p>
                <p className="mt-2 text-3xl font-bold text-rose-600">{formatMoney(totals.expense)}</p>
              </div>
              <div className="grid size-12 place-items-center rounded-full bg-rose-500/10 text-rose-600">
                <TrendingDown className="size-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardContent className="flex items-center justify-between gap-4 p-6">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Balance conjunto</p>
                <p className={`mt-2 text-3xl font-bold ${balance >= 0 ? "text-secondary" : "text-rose-600"}`}>
                  {formatMoney(balance)}
                </p>
              </div>
              <div className="grid size-12 place-items-center rounded-full border border-secondary/30 bg-secondary/10 text-secondary">
                <Scale className="size-6" />
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="glass-panel mb-8">
          <CardContent className="p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar por detalle, nota o categoría..."
                className="romantic-input lg:max-w-sm"
              />

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filter === "all" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setFilter("all")}
                >
                  Todo
                </Button>
                <Button
                  variant={filter === "income" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setFilter("income")}
                >
                  Ingresos
                </Button>
                <Button
                  variant={filter === "expense" ? "default" : "outline"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setFilter("expense")}
                >
                  Gastos
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 lg:ml-auto">
                <Input
                  type="month"
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="w-40"
                  aria-label="Filtrar por mes"
                />
                {selectedMonth && (
                  <Button variant="outline" size="sm" className="rounded-full bg-transparent" onClick={() => setSelectedMonth("")}>
                    Ver todo
                  </Button>
                )}
                <FinanceEntryModal>
                  <Button className="rounded-full bg-secondary hover:bg-secondary/90">
                    <Plus data-icon="inline-start" />
                    Movimiento
                  </Button>
                </FinanceEntryModal>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <Card className="romantic-card h-fit">
            <CardHeader>
              <CardTitle className="script-title flex items-center gap-3 text-3xl text-foreground">
                <CalendarDays className="size-6 text-secondary" />
                Vista actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-emerald-500/15 bg-emerald-500/5 p-4">
                <p className="text-sm text-muted-foreground">Ingresos filtrados</p>
                <p className="mt-1 text-2xl font-bold text-emerald-600">{formatMoney(visibleTotals.income)}</p>
              </div>
              <div className="rounded-lg border border-rose-500/15 bg-rose-500/5 p-4">
                <p className="text-sm text-muted-foreground">Gastos filtrados</p>
                <p className="mt-1 text-2xl font-bold text-rose-600">{formatMoney(visibleTotals.expense)}</p>
              </div>
              <div className="rounded-lg border border-secondary/20 bg-secondary/5 p-4">
                <p className="text-sm text-muted-foreground">Balance filtrado</p>
                <p className={`mt-1 text-2xl font-bold ${visibleBalance >= 0 ? "text-secondary" : "text-rose-600"}`}>
                  {formatMoney(visibleBalance)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="script-title text-3xl text-foreground">Detalle por fecha</CardTitle>
            </CardHeader>
            <CardContent>
              {errorMessage ? (
                <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 p-5 text-rose-700">{errorMessage}</div>
              ) : isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="h-20 animate-pulse rounded-lg bg-muted/20" />
                  ))}
                </div>
              ) : visibleEntries.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-secondary/10 text-secondary">
                    <WalletCards className="size-8" />
                  </div>
                  <h2 className="script-title text-3xl text-foreground">Aún no hay movimientos</h2>
                  <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                    Cuando registren ingresos o gastos, aquí aparecerá el historial conjunto con fecha y detalle.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleEntries.map((entry) => {
                    const amount = Number(entry.amount)
                    const isIncome = entry.type === "income"

                    return (
                      <div
                        key={entry.id}
                        className="grid gap-4 rounded-lg border border-foreground/10 bg-background/45 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/30 sm:grid-cols-[1fr_auto] sm:items-center"
                      >
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={isIncome ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : "border-rose-500/30 bg-rose-500/10 text-rose-700"}
                            >
                              {isIncome ? "Ingreso" : "Gasto"}
                            </Badge>
                            <Badge variant="outline" className="bg-secondary/5 text-secondary">
                              {entry.category}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {new Date(`${entry.entry_date}T00:00:00`).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-foreground">{entry.title}</h3>
                          {entry.description && <p className="mt-1 text-sm leading-6 text-muted-foreground">{entry.description}</p>}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                          <p className={`mr-2 text-xl font-bold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                            {isIncome ? "+" : "-"}
                            {formatMoney(amount)}
                          </p>
                          <FinanceEntryModal entry={entry}>
                            <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                              <Pencil data-icon="inline-start" />
                              Editar
                            </Button>
                          </FinanceEntryModal>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-full"
                            onClick={() => handleDeleteEntry(entry)}
                          >
                            <Trash2 data-icon="inline-start" />
                            Eliminar
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
