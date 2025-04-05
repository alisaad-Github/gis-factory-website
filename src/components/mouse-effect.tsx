"use client"

import { useEffect, useRef } from "react"

interface MouseEffectProps {
  mousePosition: { x: number; y: number }
}

export function MouseEffect({ mousePosition }: MouseEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const requestRef = useRef<number | undefined>(undefined)
  const previousTimeRef = useRef<number | undefined>(undefined)

  interface Particle {
    x: number
    y: number
    size: number
    speedX: number
    speedY: number
    life: number
    maxLife: number
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Create cursor follower
    const cursorSize = 20
    let lastX = mousePosition.x
    let lastY = mousePosition.y

    // Animation loop with requestAnimationFrame for better performance
    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time
      }

      // Store time difference but we're not using it right now
      previousTimeRef.current = time

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw cursor follower
      const dx = mousePosition.x - lastX
      const dy = mousePosition.y - lastY
      lastX += dx * 0.2
      lastY += dy * 0.2

      // Main cursor
      ctx.beginPath()
      ctx.arc(lastX, lastY, cursorSize / 2, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(0, 255, 157, 0.7)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Inner dot
      ctx.beginPath()
      ctx.arc(lastX, lastY, 2, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(0, 255, 157, 1)"
      ctx.fill()

      // Outer ring
      ctx.beginPath()
      ctx.arc(lastX, lastY, cursorSize, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(0, 255, 157, 0.3)"
      ctx.lineWidth = 1
      ctx.stroke()

      // Create particles on movement - limit particle creation for better performance
      if ((Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) && Math.random() > 0.7) {
        particlesRef.current.push({
          x: lastX + (Math.random() - 0.5) * 10,
          y: lastY + (Math.random() - 0.5) * 10,
          size: Math.random() * 3 + 1,
          speedX: (Math.random() - 0.5) * 2,
          speedY: (Math.random() - 0.5) * 2,
          life: 0,
          maxLife: Math.random() * 30 + 10,
        })
      }

      // Update and draw particles
      particlesRef.current.forEach((particle, index) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.life++

        const opacity = 1 - particle.life / particle.maxLife

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 255, 157, ${opacity})`
        ctx.fill()

        // Remove dead particles
        if (particle.life >= particle.maxLife) {
          particlesRef.current.splice(index, 1)
        }
      })

      // Limit particles array size for better performance
      if (particlesRef.current.length > 50) {
        particlesRef.current = particlesRef.current.slice(-50)
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [mousePosition])

  return (
    <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ mixBlendMode: "lighten" }} />
  )
}

