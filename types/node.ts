export enum NodeType {
  Episode = "Episode",
  Image = "Image",
  SoundEffect = "SoundEffect",
  Song = "Song",
  Action = "Action",
  Scene = "Scene",
  InventoryItem = "InventoryItem",
  Character = "Character",
  Dialogue = "Dialogue",
  Actions = "Actions",
}

export interface NodeAction {
  name: string
  imageUrl: string
  description: string
  onClick: () => void
}

export interface NodeProperty {
  id: string
  label: string
  type: string
  value: any
  readOnly?: boolean
}

export interface Node {
  id: string
  type: NodeType
  actions: NodeAction[]
  children?: Node[]
  properties: Record<string, NodeProperty>
}
