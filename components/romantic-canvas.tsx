"use client"

import { useEffect, useRef } from "react"

type Star = {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  hue: number
}

export function RomanticCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const context = canvas.getContext("2d")
    if (!context) return

    let animationFrame = 0
    let width = 0
    let height = 0
    const pointer = { x: 0, y: 0, active: false }
    let stars: Star[] = []

    const resize = () => {
      const pixelRatio = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * pixelRatio)
      canvas.height = Math.floor(height * pixelRatio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

      const starCount = Math.min(95, Math.max(44, Math.floor((width * height) / 19000)))
      stars = Array.from({ length: starCount }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        radius: 0.65 + Math.random() * 1.8,
        hue: index % 3 === 0 ? 42 : index % 3 === 1 ? 350 : 174,
      }))
    }

    const draw = () => {
      context.clearRect(0, 0, width, height)

      for (const star of stars) {
        star.x += star.vx
        star.y += star.vy

        if (star.x < -20) star.x = width + 20
        if (star.x > width + 20) star.x = -20
        if (star.y < -20) star.y = height + 20
        if (star.y > height + 20) star.y = -20

        if (pointer.active) {
          const dx = pointer.x - star.x
          const dy = pointer.y - star.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 150) {
            star.x -= dx * 0.0009
            star.y -= dy * 0.0009
          }
        }
      }

      for (let i = 0; i < stars.length; i += 1) {
        for (let j = i + 1; j < stars.length; j += 1) {
          const a = stars[i]
          const b = stars[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 118) {
            const alpha = (1 - distance / 118) * 0.28
            context.strokeStyle = `hsla(${a.hue}, 85%, 72%, ${alpha})`
            context.lineWidth = 0.7
            context.beginPath()
            context.moveTo(a.x, a.y)
            context.lineTo(b.x, b.y)
            context.stroke()
          }
        }
      }

      for (const star of stars) {
        context.fillStyle = `hsla(${star.hue}, 92%, 76%, 0.78)`
        context.beginPath()
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        context.fill()
      }

      animationFrame = requestAnimationFrame(draw)
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }

    const handlePointerLeave = () => {
      pointer.active = false
    }

    resize()
    draw()

    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerleave", handlePointerLeave)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerleave", handlePointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="romantic-canvas" aria-hidden="true" />
}
