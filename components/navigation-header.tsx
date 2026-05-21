"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, Camera, Heart, Home, LibraryBig, Mail, Quote, Sparkles, Timeline, WalletCards } from "lucide-react"
import { UserProfile } from "@/components/user-profile"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/memories", label: "Recuerdos", icon: LibraryBig },
  { href: "/photos", label: "Fotos", icon: Camera },
  { href: "/quotes", label: "Frases", icon: Quote },
  { href: "/special-days", label: "Fechas", icon: Sparkles },
  { href: "/timeline", label: "Línea", icon: Timeline },
  { href: "/calendar", label: "Calendario", icon: CalendarDays },
  { href: "/love-letters", label: "Cartas", icon: Mail },
  { href: "/finances", label: "Finanzas", icon: WalletCards },
]

export function NavigationHeader() {
  const pathname = usePathname()

  return (
    <header className="nav-glass sticky top-0 z-50 w-full">
      <div className="mx-auto flex min-h-16 max-w-7xl flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-full border border-secondary/35 bg-secondary/10 text-secondary shadow-lg transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              <Heart className="size-5 fill-current" />
            </span>
            <span className="script-title text-2xl font-bold text-foreground">Nuestro Amor</span>
          </Link>

          <div className="lg:hidden">
            <UserProfile />
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto pb-1 lg:overflow-visible lg:pb-0" aria-label="Principal">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "shrink-0 rounded-full border border-transparent px-3 text-muted-foreground transition-all duration-300 hover:border-secondary/30 hover:bg-secondary/10 hover:text-foreground",
                    isActive && "border-secondary/40 bg-secondary/15 text-secondary shadow-[0_0_28px_color-mix(in_oklch,var(--secondary),transparent_76%)]",
                  )}
                >
                  <Icon data-icon="inline-start" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:block">
          <UserProfile />
        </div>
      </div>
    </header>
  )
}
