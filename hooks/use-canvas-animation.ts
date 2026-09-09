"use client"

import { useEffect, useRef } from "react"

export function useCanvasAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const startTime = Date.now()

    const animate = () => {
      const elapsed = Date.now() - startTime
      const cycle = (elapsed % 2000) / 2000 // 2 second cycle

      // Oscillate between 25% and 75% gray
      const grayValue = Math.floor(64 + (127 * (Math.sin(cycle * Math.PI * 2) + 1)) / 2)

      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      ctx.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return canvasRef
}
