"use client"

import { useState } from "react"
import {
  PanelLeft,
  PanelRight,
  PanelBottom,
  File,
  Folder,
  Settings,
  Save,
  FolderOpen,
  ImageIcon,
  Music,
  Users,
} from "lucide-react"
import { type Node, NodeType } from "@/types/node"
import type { MenuItem } from "@/types/menu"
import { TreeNode } from "@/components/tree-node"
import { ResizablePanel } from "@/components/resizable-panel"
import { HamburgerMenu } from "@/components/hamburger-menu"
import { useCanvasAnimation } from "@/hooks/use-canvas-animation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Animation duration constant
const PANEL_TRANSITION_DURATION = "300ms"

// Mock menu data
const mockMenuItems: MenuItem[] = [
  {
    id: "file",
    label: "File",
    icon: <File className="h-4 w-4" />,
    isExpanded: false,
    children: [
      {
        id: "new",
        label: "New Project",
        icon: <File className="h-4 w-4" />,
        onClick: () => console.log("New Project clicked"),
      },
      {
        id: "open",
        label: "Open Project",
        icon: <FolderOpen className="h-4 w-4" />,
        onClick: () => console.log("Open Project clicked"),
      },
      {
        id: "save",
        label: "Save Project",
        icon: <Save className="h-4 w-4" />,
        onClick: () => console.log("Save Project clicked"),
        isChecked: true,
      },
      {
        id: "recent",
        label: "Recent Files",
        icon: <Folder className="h-4 w-4" />,
        isExpanded: false,
        children: [
          {
            id: "recent1",
            label: "Project Alpha.vnp",
            onClick: () => console.log("Recent 1 clicked"),
          },
          {
            id: "recent2",
            label: "Story Beta.vnp",
            onClick: () => console.log("Recent 2 clicked"),
          },
          {
            id: "recent3",
            label: "Demo Game.vnp",
            onClick: () => console.log("Recent 3 clicked"),
            disabled: true,
          },
        ],
      },
    ],
  },
  {
    id: "assets",
    label: "Assets",
    icon: <ImageIcon className="h-4 w-4" />,
    isExpanded: true,
    children: [
      {
        id: "images",
        label: "Images",
        icon: <ImageIcon className="h-4 w-4" />,
        onClick: () => console.log("Images clicked"),
      },
      {
        id: "audio",
        label: "Audio",
        icon: <Music className="h-4 w-4" />,
        isExpanded: false,
        children: [
          {
            id: "music",
            label: "Background Music",
            onClick: () => console.log("Music clicked"),
          },
          {
            id: "sfx",
            label: "Sound Effects",
            onClick: () => console.log("SFX clicked"),
          },
        ],
      },
      {
        id: "characters",
        label: "Characters",
        icon: <Users className="h-4 w-4" />,
        onClick: () => console.log("Characters clicked"),
      },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    icon: <Settings className="h-4 w-4" />,
    children: [
      {
        id: "preferences",
        label: "Preferences",
        onClick: () => console.log("Preferences clicked"),
      },
      {
        id: "export",
        label: "Export Game",
        onClick: () => console.log("Export clicked"),
      },
    ],
  },
  {
    id: "hidden-item",
    label: "This should be hidden",
    isVisible: false,
    onClick: () => console.log("Hidden clicked"),
  },
]

// Mock data (same as before)
const mockTree: Node = {
  id: "root",
  type: NodeType.Episode,
  actions: [
    {
      name: "Play",
      imageUrl: "/placeholder.svg?height=24&width=24",
      description: "Play this episode",
      onClick: () => console.log("Play clicked"),
    },
    {
      name: "Edit",
      imageUrl: "/placeholder.svg?height=24&width=24",
      description: "Edit this episode",
      onClick: () => console.log("Edit clicked"),
    },
  ],
  properties: {
    title: {
      id: "title",
      label: "Title",
      type: "string",
      value: "Episode 1",
    },
    duration: {
      id: "duration",
      label: "Duration",
      type: "number",
      value: 120,
      readOnly: true,
    },
  },
  children: [
    {
      id: "scene1",
      type: NodeType.Scene,
      actions: [
        {
          name: "Preview",
          imageUrl: "/placeholder.svg?height=24&width=24",
          description: "Preview this scene",
          onClick: () => console.log("Preview clicked"),
        },
      ],
      properties: {
        name: {
          id: "name",
          label: "Scene Name",
          type: "string",
          value: "Opening Scene",
        },
      },
      children: [
        {
          id: "dialogue1",
          type: NodeType.Dialogue,
          actions: [],
          properties: {
            text: {
              id: "text",
              label: "Dialogue Text",
              type: "string",
              value: "Hello, welcome to our story!",
            },
            character: {
              id: "character",
              label: "Character",
              type: "string",
              value: "Narrator",
            },
          },
        },
        {
          id: "image1",
          type: NodeType.Image,
          actions: [
            {
              name: "Delete",
              imageUrl: "/placeholder.svg?height=24&width=24",
              description: "Delete this image",
              onClick: () => console.log("Delete clicked"),
            },
          ],
          properties: {
            src: {
              id: "src",
              label: "Image Source",
              type: "string",
              value: "/images/background.jpg",
            },
          },
        },
      ],
    },
  ],
}

export default function VisualNovelEditor() {
  const [leftPanelVisible, setLeftPanelVisible] = useState(true)
  const [rightPanelVisible, setRightPanelVisible] = useState(true)
  const [bottomPanelVisible, setBottomPanelVisible] = useState(true)
  const [bottomPanelBetweenSidePanes, setBottomPanelBetweenSidePanes] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [leftPanelWidth, setLeftPanelWidth] = useState(300)
  const [rightPanelWidth, setRightPanelWidth] = useState(300)
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200)

  // Track when panels are transitioning to enable/disable transitions
  const [leftPanelTransitioning, setLeftPanelTransitioning] = useState(false)
  const [rightPanelTransitioning, setRightPanelTransitioning] = useState(false)
  const [bottomPanelTransitioning, setBottomPanelTransitioning] = useState(false)

  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedPath, setSelectedPath] = useState<string[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(["root", "scene1"]))

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)

  const canvasRef = useCanvasAnimation()

  // Handle panel visibility changes with transition states
  const toggleLeftPanel = () => {
    setLeftPanelTransitioning(true)
    setLeftPanelVisible(!leftPanelVisible)
    setTimeout(() => setLeftPanelTransitioning(false), 300)
  }

  const toggleRightPanel = () => {
    setRightPanelTransitioning(true)
    setRightPanelVisible(!rightPanelVisible)
    setTimeout(() => setRightPanelTransitioning(false), 300)
  }

  const toggleBottomPanel = () => {
    setBottomPanelTransitioning(true)
    setBottomPanelVisible(!bottomPanelVisible)
    setTimeout(() => setBottomPanelTransitioning(false), 300)
  }

  const handleNodeSelect = (node: Node, path: string[]) => {
    setSelectedNode(node)
    setSelectedPath(path)
  }

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.id === "preferences") {
      setPreferencesOpen(true)
      return
    }

    console.log("Menu item clicked:", item.label)
  }

  const handleMenuItemToggle = (itemId: string) => {
    const updateMenuItems = (items: MenuItem[]): MenuItem[] => {
      return items.map((item) => {
        if (item.id === itemId) {
          return { ...item, isExpanded: !item.isExpanded }
        }
        if (item.children) {
          return { ...item, children: updateMenuItems(item.children) }
        }
        return item
      })
    }
    setMenuItems(updateMenuItems(menuItems))
  }

  const pathString = selectedPath.join(" > ")

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Main Menu */}
      <div className="h-12 bg-muted border-b flex items-center px-4 flex-shrink-0">
        <HamburgerMenu
          menuItems={menuItems}
          onMenuItemClick={handleMenuItemClick}
          onMenuItemToggle={handleMenuItemToggle}
          transitionDuration={PANEL_TRANSITION_DURATION}
        />
        <h1 className="text-lg font-semibold">Visual Novel Editor</h1>
        <div className="ml-auto flex gap-2">
          <Button variant="ghost" size="sm" onClick={toggleLeftPanel}>
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleBottomPanel}>
            <PanelBottom className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleRightPanel}>
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        className="flex-1 min-h-0 overflow-hidden"
        style={
          bottomPanelBetweenSidePanes
            ? {
                display: "grid",
                gridTemplateColumns: `${leftPanelVisible ? leftPanelWidth : 0}px minmax(0, 1fr) ${rightPanelVisible ? rightPanelWidth : 0}px`,
                gridTemplateRows: `minmax(0, 1fr) ${bottomPanelVisible ? bottomPanelHeight : 0}px`,
                gridTemplateAreas: `"left main right" "left bottom right"`,
              }
            : undefined
        }
      >
        {/* Top Section - Left, Main, Right Panels */}
        <div
          className={bottomPanelBetweenSidePanes ? "contents" : "flex flex-1 min-h-0 overflow-hidden"}
          style={
            bottomPanelBetweenSidePanes
              ? undefined
              : {
                  height: bottomPanelVisible ? `calc(100% - ${bottomPanelHeight}px)` : "100%",
                  transition: bottomPanelTransitioning ? `height ${PANEL_TRANSITION_DURATION} ease-in-out` : "none",
                }
          }
        >
          {/* Left Panel - Node Tree */}
          <div
            className="bg-muted/30 border-r overflow-hidden flex-shrink-0"
            style={{
              gridArea: "left",

              width: leftPanelVisible ? `${leftPanelWidth}px` : "0px",
              transition: leftPanelTransitioning ? `width ${PANEL_TRANSITION_DURATION} ease-in-out` : "none",
            }}
          >
            <div
              className="h-full"
              style={{
                width: `${leftPanelWidth}px`,
                transform: leftPanelVisible ? "translateX(0)" : `translateX(-${leftPanelWidth}px)`,
                transition: leftPanelTransitioning ? `transform ${PANEL_TRANSITION_DURATION} ease-in-out` : "none",
              }}
            >
              <ResizablePanel
                direction="horizontal"
                initialSize={leftPanelWidth}
                minSize={200}
                maxSize={500}
                className="h-full"
                handlePosition="end"
                onResize={setLeftPanelWidth}
              >
                <div className="p-4 h-full overflow-auto">
                  <h2 className="text-sm font-semibold mb-4">Node Tree</h2>
                  <TreeNode
                    node={mockTree}
                    selectedNodeId={selectedNode?.id || null}
                    onNodeSelect={handleNodeSelect}
                    path={[]}
                    expandedNodes={expandedNodes}
                    onToggleExpanded={toggleExpanded}
                  />
                </div>
              </ResizablePanel>
            </div>
          </div>

          {/* Main Panel */}
          <div className="flex-1 flex flex-col relative min-w-0 overflow-hidden" style={bottomPanelBetweenSidePanes ? { gridArea: "main" } : undefined}>
            <div className="h-full flex flex-col p-4">
              {/* Action Buttons */}
              {selectedNode && selectedNode.actions.length > 0 && (
                <div className="mb-4 flex-shrink-0">
                  <div className="flex gap-2">
                    {selectedNode.actions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="flex flex-col h-auto p-2 bg-transparent"
                        onClick={action.onClick}
                        title={action.description}
                      >
                        <img
                          src={action.imageUrl || "/placeholder.svg"}
                          alt={action.description}
                          className="w-6 h-6 mb-1"
                        />
                        <span className="text-xs">{action.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview Canvas */}
              <div className="flex-1 relative border rounded-lg overflow-hidden min-h-0">
                <canvas ref={canvasRef} className="w-full h-full" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-black/50 text-white p-4 rounded-lg text-center">
                    <h3 className="text-lg font-semibold mb-2">Preview</h3>
                    <p className="text-sm opacity-80">
                      {selectedNode ? `Selected: ${pathString}` : "No node selected"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Info */}
          <div
            className="bg-muted/30 border-l overflow-hidden flex-shrink-0"
            style={{
              gridArea: "right",

              width: rightPanelVisible ? `${rightPanelWidth}px` : "0px",
              transition: rightPanelTransitioning ? `width ${PANEL_TRANSITION_DURATION} ease-in-out` : "none",
            }}
          >
            <div className="h-full" style={{ width: `${rightPanelWidth}px` }}>
              <ResizablePanel
                direction="horizontal"
                initialSize={rightPanelWidth}
                minSize={200}
                maxSize={500}
                className="h-full"
                handlePosition="start"
                onResize={setRightPanelWidth}
              >
                <div className="p-4 h-full overflow-auto">
                  <h2 className="text-sm font-semibold mb-4">Node Information</h2>

                  {selectedNode ? (
                    <>
                      <p className="text-sm mb-4">
                        <strong>Node Type:</strong> {selectedNode.type}
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        This section contains help information about {selectedNode.type} nodes and how they work within
                        the visual novel engine. Each node type has specific properties and behaviors that affect how
                        the story flows.
                      </p>

                      <Separator className="my-4" />

                      <p className="text-sm">
                        <strong>Current Path:</strong> {pathString}
                      </p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Select a node to view information about it.</p>
                  )}
                </div>
              </ResizablePanel>
            </div>
          </div>
        </div>

        {/* Bottom Panel - Object Properties (Full Width) */}
        <div
          className="bg-muted/30 border-t overflow-hidden flex-shrink-0"
          style={{
            gridArea: bottomPanelBetweenSidePanes ? "bottom" : undefined,
            gridColumn: bottomPanelBetweenSidePanes ? "2" : undefined,
            height: bottomPanelBetweenSidePanes
              ? bottomPanelVisible
                ? `${bottomPanelHeight}px`
                : "0px"
              : bottomPanelVisible
                ? `${bottomPanelHeight}px`
                : "0px",
            transition: bottomPanelTransitioning ? `height ${PANEL_TRANSITION_DURATION} ease-in-out` : "none",
          }}
        >
          <div className="w-full" style={{ height: `${bottomPanelHeight}px` }}>
            <ResizablePanel
              direction="vertical"
              initialSize={bottomPanelHeight}
              minSize={150}
              maxSize={400}
              className="w-full"
              handlePosition="start"
              onResize={setBottomPanelHeight}
            >
              <div className="p-4 h-full overflow-auto">
                <h1 className="text-lg font-semibold mb-2">{selectedNode?.type || "No Selection"}</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedNode ? pathString : "Select a node to view its properties"}
                </p>

                {selectedNode && Object.keys(selectedNode.properties).length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-2">
                      {Object.entries(selectedNode.properties).map(([key, property]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-sm font-medium">{property.label}:</span>
                          <span className="text-sm text-muted-foreground">{String(property.value)}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </ResizablePanel>
          </div>
        </div>
      </div>

      <Dialog open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preferences</DialogTitle>
            <DialogDescription>Customize how the editor panels are arranged.</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="bottom-panel-position" className="text-sm font-medium">
                Place bottom pane between side panes
              </label>
              <p className="text-sm text-muted-foreground">
                Keep the side panes full height and place the properties pane below the preview.
              </p>
            </div>
            <Switch
              id="bottom-panel-position"
              checked={bottomPanelBetweenSidePanes}
              onCheckedChange={setBottomPanelBetweenSidePanes}
              aria-label="Place bottom pane between side panes"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
