import type React from "react"

export interface MenuItem {
  id: string
  label: string
  children?: MenuItem[]
  onClick?: () => void
  icon?: React.ReactNode
  disabled?: boolean
  isActive?: boolean
  isVisible?: boolean
  isSelected?: boolean
  isExpanded?: boolean
  isLoading?: boolean
  isChecked?: boolean
}
