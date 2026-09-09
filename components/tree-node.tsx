"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import type { Node } from "@/types/node"
import { Button } from "@/components/ui/button"

interface TreeNodeProps {
  node: Node
  selectedNodeId: string | null
  onNodeSelect: (node: Node, path: string[]) => void
  path: string[]
  expandedNodes: Set<string>
  onToggleExpanded: (nodeId: string) => void
}

export function TreeNode({ node, selectedNodeId, onNodeSelect, path, expandedNodes, onToggleExpanded }: TreeNodeProps) {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = expandedNodes.has(node.id)
  const isSelected = selectedNodeId === node.id
  const currentPath = [...path, node.type]

  return (
    <div className="select-none">
      <div
        className={`flex items-center gap-1 px-2 py-1 hover:bg-muted/50 cursor-pointer ${
          isSelected ? "bg-primary/20 border-l-2 border-primary" : ""
        }`}
        onClick={() => onNodeSelect(node, currentPath)}
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpanded(node.id)
            }}
          >
            {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        ) : (
          <div className="w-4" />
        )}
        <span className="text-sm">{node.type}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="ml-4 border-l border-muted">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onNodeSelect={onNodeSelect}
              path={currentPath}
              expandedNodes={expandedNodes}
              onToggleExpanded={onToggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  )
}
