import { LoginForm } from "@/components/login-form"
import { Card, CardContent } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <main className="romantic-page flex min-h-screen items-center justify-center px-4 py-12">
      <div className="grid w-full max-w-5xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="letter-reveal">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-secondary">archivo privado</p>
          <h1 className="script-title love-ribbon mb-8 text-5xl font-bold leading-none text-foreground md:text-7xl">
            Nuestro pequeño universo
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Un lugar para volver a las fotos, cartas, fechas y frases que todavía hacen ruido bonito en el pecho.
          </p>

          <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
            {["recuerdos", "cartas", "fechas"].map((item, index) => (
              <div
                key={item}
                className="glass-panel rounded-lg px-4 py-5 text-center letter-reveal"
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                <p className="script-title text-2xl font-bold text-secondary">{index + 1}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <Card className="glass-panel letter-reveal overflow-hidden rounded-lg">
          <CardContent className="p-6 md:p-8">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full border border-primary/35 bg-primary/15 text-3xl candle-glow">
                ♥
              </div>
              <h2 className="script-title text-4xl font-bold text-foreground">Entrar</h2>
              <p className="mt-2 text-sm text-muted-foreground">Solo ustedes dos tienen la llave.</p>
            </div>
            <LoginForm />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
