"use client"

import type React from "react"

import { type ReactNode, useRef, useEffect, useState } from "react"

interface ResizablePanelProps {
  children: ReactNode
  direction: "horizontal" | "vertical"
  initialSize: number
  minSize: number
  maxSize: number
  onResize?: (size: number) => void
  className?: string
  handlePosition?: "start" | "end"
}

export function ResizablePanel({
  children,
  direction,
  initialSize,
  minSize,
  maxSize,
  onResize,
  className = "",
  handlePosition = "end",
}: ResizablePanelProps) {
  const [size, setSize] = useState(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !panelRef.current) return

      e.preventDefault()

      const rect = panelRef.current.getBoundingClientRect()
      let newSize: number

      if (direction === "horizontal") {
        if (handlePosition === "start") {
          newSize = rect.right - e.clientX
        } else {
          newSize = e.clientX - rect.left
        }
      } else {
        if (handlePosition === "start") {
          newSize = rect.bottom - e.clientY
        } else {
          newSize = rect.bottom - e.clientY
        }
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize))
      setSize(newSize)
      onResize?.(newSize)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
      document.body.style.userSelect = ""
      document.body.style.cursor = ""
    }

    if (isResizing) {
      document.body.style.userSelect = "none"
      document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize"
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, direction, minSize, maxSize, onResize, handlePosition])

  // Update size when initialSize changes (for panel visibility changes)
  useEffect(() => {
    setSize(initialSize)
  }, [initialSize])

  const style = direction === "horizontal" ? { width: `${size}px` } : { height: `${size}px` }

  const getHandleClasses = () => {
    const baseClasses = "absolute bg-border hover:bg-primary/50 transition-colors z-10"
    const cursorClass = direction === "horizontal" ? "cursor-col-resize" : "cursor-row-resize"

    if (direction === "horizontal") {
      return handlePosition === "start"
        ? `${baseClasses} ${cursorClass} top-0 left-0 w-1 h-full`
        : `${baseClasses} ${cursorClass} top-0 right-0 w-1 h-full`
    } else {
      return handlePosition === "start"
        ? `${baseClasses} ${cursorClass} top-0 left-0 w-full h-1`
        : `${baseClasses} ${cursorClass} bottom-0 left-0 w-full h-1`
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
  }

  return (
    <div ref={panelRef} className={`relative ${className}`} style={style}>
      {children}
      <div className={getHandleClasses()} onMouseDown={handleMouseDown} />
    </div>
  )
}
