"use client"

import React, { useEffect, useRef, useState } from "react"

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)
    
    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mediaQuery.addEventListener("change", listener)
    return () => mediaQuery.removeEventListener("change", listener)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{ x: number; y: number; radius: number; angle: number; speed: number; orbitRadius: number }> = []

    const resize = () => {
      // Need devicePixelRatio for crisp rendering on retina displays
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      initParticles()
    }

    const initParticles = () => {
      particles = []
      const numParticles = 80 // Keep count low
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      
      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: cx,
          y: cy,
          radius: Math.random() * 2 + 0.5,
          angle: Math.random() * Math.PI * 2,
          speed: (Math.random() * 0.002 + 0.0005) * (Math.random() > 0.5 ? 1 : -1),
          // Orbit radius spread across the screen
          orbitRadius: Math.random() * (Math.max(window.innerWidth, window.innerHeight) * 0.6) + 50,
        })
      }
    }

    const draw = () => {
      if (!isVisible || prefersReducedMotion) {
        // Just draw static and stop updating
        renderParticles()
        return
      }

      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2

      // Clear with very slight trailing effect (needs to match background, using transparent clear for clean look)
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      // Update and draw
      particles.forEach((p) => {
        p.angle += p.speed
        p.x = cx + Math.cos(p.angle) * p.orbitRadius
        p.y = cy + Math.sin(p.angle) * (p.orbitRadius * 0.7) // Elliptical orbit

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        // Emerald/neutral tones
        ctx.fillStyle = "rgba(5, 150, 105, 0.15)"
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    const renderParticles = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2

      particles.forEach((p) => {
        p.x = cx + Math.cos(p.angle) * p.orbitRadius
        p.y = cy + Math.sin(p.angle) * (p.orbitRadius * 0.7)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(5, 150, 105, 0.15)"
        ctx.fill()
      })
    }

    window.addEventListener("resize", resize)
    resize()
    
    // Start loop
    if (isVisible && !prefersReducedMotion) {
      draw()
    } else {
      renderParticles()
    }

    return () => {
      window.removeEventListener("resize", resize)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [isVisible, prefersReducedMotion])

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, var(--color-background) 70%)"
        }}
      />
    </div>
  )
}
