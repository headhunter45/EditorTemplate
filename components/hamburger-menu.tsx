"use client"

import { useState } from "react"
import { Menu, X, ChevronDown, ChevronRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { MenuItem } from "@/types/menu"

interface HamburgerMenuProps {
  menuItems: MenuItem[]
  onMenuItemClick?: (item: MenuItem) => void
  onMenuItemToggle?: (itemId: string) => void
  transitionDuration?: string
}

interface MenuItemComponentProps {
  item: MenuItem
  onItemClick?: (item: MenuItem) => void
  onItemToggle?: (itemId: string) => void
  transitionDuration: string
  depth?: number
}

function MenuItemComponent({ item, onItemClick, onItemToggle, transitionDuration, depth = 0 }: MenuItemComponentProps) {
  if (item.isVisible === false) return null

  const hasChildren = item.children && item.children.length > 0
  const isExpanded = item.isExpanded || false
  const paddingLeft = depth * 16 + 16 // 16px base + 16px per depth level

  const handleClick = () => {
    if (item.disabled) return

    if (hasChildren) {
      onItemToggle?.(item.id)
    } else if (item.onClick) {
      item.onClick()
      onItemClick?.(item)
    }
  }

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={item.disabled}
        className={`
          w-full flex items-center gap-2 py-2 px-4 text-left text-sm
          hover:bg-muted/50 transition-colors duration-150
          ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${item.isActive ? "bg-primary/20 border-l-2 border-primary" : ""}
          ${item.isSelected ? "bg-accent" : ""}
        `}
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        {hasChildren && (
          <div className="flex-shrink-0">
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </div>
        )}

        {!hasChildren && <div className="w-3" />}

        {item.icon && <div className="flex-shrink-0">{item.icon}</div>}

        <span className="flex-1 truncate">{item.label}</span>

        {item.isChecked && <Check className="h-3 w-3 flex-shrink-0" />}

        {item.isLoading && (
          <div className="h-3 w-3 flex-shrink-0 animate-spin rounded-full border border-current border-t-transparent" />
        )}
      </button>

      {hasChildren && (
        <div
          className="overflow-hidden"
          style={{
            height: isExpanded ? "auto" : "0px",
            transition: `height ${transitionDuration} ease-in-out`,
          }}
        >
          <div
            className="transition-opacity"
            style={{
              opacity: isExpanded ? 1 : 0,
              transition: `opacity ${transitionDuration} ease-in-out`,
            }}
          >
            {item.children?.map((child) => (
              <MenuItemComponent
                key={child.id}
                item={child}
                onItemClick={onItemClick}
                onItemToggle={onItemToggle}
                transitionDuration={transitionDuration}
                depth={depth + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function HamburgerMenu({
  menuItems,
  onMenuItemClick,
  onMenuItemToggle,
  transitionDuration = "300ms",
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (item: MenuItem) => {
    onMenuItemClick?.(item)
    // Close menu after clicking a leaf item (no children)
    if (!item.children || item.children.length === 0) {
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={toggleMenu} className="mr-2">
        <Menu className="h-4 w-4" />
      </Button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setIsOpen(false)} />}

      {/* Menu Panel */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-background border-r shadow-lg z-50
          transition-transform ease-in-out
        `}
        style={{
          width: "280px",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: `transform ${transitionDuration} ease-in-out`,
        }}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="overflow-y-auto h-full pb-16">
          {menuItems.map((item) => (
            <MenuItemComponent
              key={item.id}
              item={item}
              onItemClick={handleMenuItemClick}
              onItemToggle={onMenuItemToggle}
              transitionDuration={transitionDuration}
            />
          ))}
        </div>
      </div>
    </>
  )
}
