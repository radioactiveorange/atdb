export interface MapData {
  id: string
  name: string
  x: number // Global world coordinates
  y: number
  width: number
  height: number
  imageUrl: string
  connections?: MapConnection[]
}

export interface MapConnection {
  targetMapId: string
  exitX: number
  exitY: number
  entryX: number
  entryY: number
}

export interface GlobalMapState {
  zoom: number
  centerX: number
  centerY: number
  selectedMap?: string
  showOverlays: boolean
}

export interface ViewportBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

// Calculate zoom level based on map count (from reference implementation)
export const calculateZoomLevel = (mapCount: number): number => {
  if (mapCount > 100) return 2
  if (mapCount >= 19) return 6
  if (mapCount >= 4) return 8
  return 10
}

// Calculate tile position with zoom (using absolute positioning like original)
export const calculateTilePosition = (
  x: number,
  y: number,
  zoom: number,
  width: number = 50,
  height: number = 40
) => ({
  left: x,
  top: y,
  width: width * 32, // Use actual map dimensions (32px tiles)
  height: height * 32,
})

// Check if a tile is within viewport bounds
export const isTileInViewport = (
  tileX: number,
  tileY: number,
  tileWidth: number,
  tileHeight: number,
  viewport: ViewportBounds
): boolean => {
  return (
    tileX + tileWidth >= viewport.minX &&
    tileX <= viewport.maxX &&
    tileY + tileHeight >= viewport.minY &&
    tileY <= viewport.maxY
  )
}

// Get map image URL
export const getMapImageUrl = (mapId: string): string => {
  return `/atdb/backgrounds/${mapId}.jpg`
}

// Convert screen coordinates to world coordinates
export const screenToWorld = (
  screenX: number,
  screenY: number,
  zoom: number,
  centerX: number,
  centerY: number
) => ({
  worldX: (screenX / zoom) + centerX,
  worldY: (screenY / zoom) + centerY,
})

// Convert world coordinates to screen coordinates
export const worldToScreen = (
  worldX: number,
  worldY: number,
  zoom: number,
  centerX: number,
  centerY: number
) => ({
  screenX: (worldX - centerX) * zoom,
  screenY: (worldY - centerY) * zoom,
})