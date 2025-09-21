import { atom } from 'jotai'
import { MapData, GlobalMapState } from '@/lib/map-utils'
import { WorldMapData, WorldMapSegment, parseWorldMapXML, getDefaultSegmentId } from '@/lib/worldmap-parser'
import { worldBounds } from '@/data/world-coordinates'

// Map data atom - will be populated from TMX parsing
export const mapDataAtom = atom<MapData[]>([])

// Official worldmap data atom - parsed from worldmap.xml
export const worldMapDataAtom = atom<WorldMapData>(async () => {
  return await parseWorldMapXML()
})

// Current segment maps atom - merges worldmap segment with our map data
export const currentSegmentMapsAtom = atom<MapData[]>((get) => {
  const allMaps = get(mapDataAtom)
  const worldMapData = get(worldMapDataAtom)
  const currentSegmentId = get(currentSegmentAtom)

  const segment = worldMapData.segmentsMap[currentSegmentId]
  if (!segment) return []

  // Find maps that belong to this segment
  const segmentMapIds = new Set(segment.maps.map(m => m.id))
  return allMaps.filter(map => segmentMapIds.has(map.id))
})

// Current selected segment - primitive atom
const _currentSegmentAtom = atom<string>('')

// Current selected segment (with default fallback)
export const currentSegmentAtom = atom<string>(
  (get) => {
    const current = get(_currentSegmentAtom)
    if (current) return current

    const worldMapData = get(worldMapDataAtom)
    return getDefaultSegmentId(worldMapData.segments)
  }
)

// Action to update current segment
export const updateCurrentSegmentAtom = atom(
  null,
  (get, set, newSegmentId: string) => {
    set(_currentSegmentAtom, newSegmentId)
  }
)

// Current segment data
export const currentSegmentDataAtom = atom<WorldMapSegment | null>((get) => {
  const worldMapData = get(worldMapDataAtom)
  const currentSegmentId = get(currentSegmentAtom)
  return worldMapData.segmentsMap[currentSegmentId] || null
})

// Global map state for zoom, pan, and view
export const globalMapStateAtom = atom<GlobalMapState>({
  zoom: 1, // Fixed zoom like original
  centerX: 0, // No panning for now
  centerY: 0,
  selectedMap: undefined,
  showOverlays: true,
})

// Derived atom for current viewport bounds
export const viewportBoundsAtom = atom((get) => {
  const state = get(globalMapStateAtom)
  const viewportWidth = 1200 // Default viewport width
  const viewportHeight = 800 // Default viewport height
  
  const halfWidth = (viewportWidth / 2) / state.zoom
  const halfHeight = (viewportHeight / 2) / state.zoom
  
  return {
    minX: state.centerX - halfWidth,
    maxX: state.centerX + halfWidth,
    minY: state.centerY - halfHeight,
    maxY: state.centerY + halfHeight,
  }
})

// Maps that exist in worldmap.xml with worldmap coordinates
export const worldmapPositionedMapsAtom = atom(async (get) => {
  const allMaps = get(mapDataAtom)
  const worldMapData = await get(worldMapDataAtom)

  // Create a map of worldmap coordinates by map ID
  const worldmapCoords = new Map<string, { x: number; y: number }>()

  worldMapData.segments.forEach(segment => {
    segment.maps.forEach(mapEntry => {
      worldmapCoords.set(mapEntry.id, { x: mapEntry.x, y: mapEntry.y })
    })
  })

  // Filter to only maps that exist in worldmap.xml and update their coordinates
  const positionedMaps = allMaps.filter(map => worldmapCoords.has(map.id))
    .map(map => {
      const worldCoords = worldmapCoords.get(map.id)!
      return {
        ...map,
        x: worldCoords.x,
        y: worldCoords.y
      }
    })

  console.log(`Total maps: ${allMaps.length}, Worldmap positioned: ${positionedMaps.length}`)
  console.log(`Sample worldmap coords:`, Array.from(worldmapCoords.entries()).slice(0, 5))
  console.log(`Sample positioned maps:`, positionedMaps.slice(0, 3))

  return positionedMaps
})

// Derived atom for visible maps (viewport culling from worldmap positioned maps)
export const visibleMapsAtom = atom(async (get) => {
  const worldmapMaps = await get(worldmapPositionedMapsAtom)
  const viewport = get(viewportBoundsAtom)

  if (worldmapMaps.length === 0) {
    return []
  }

  // For debugging, let's make viewport culling less aggressive
  const expandedViewport = {
    minX: viewport.minX - 1000,
    maxX: viewport.maxX + 1000,
    minY: viewport.minY - 1000,
    maxY: viewport.maxY + 1000,
  }

  const visibleMaps = worldmapMaps.filter(map => {
    const tileSize = 32 // Actual tile size (32px tiles)
    const scaledWidth = map.width * tileSize
    const scaledHeight = map.height * tileSize

    const isVisible = (
      map.x + scaledWidth >= expandedViewport.minX &&
      map.x <= expandedViewport.maxX &&
      map.y + scaledHeight >= expandedViewport.minY &&
      map.y <= expandedViewport.maxY
    )

    return isVisible
  })

  // Debug logging
  console.log(`Worldmap maps: ${worldmapMaps.length}, Visible: ${visibleMaps.length}`)
  if (visibleMaps.length > 0) {
    console.log(`First visible map:`, visibleMaps[0])
  }

  return visibleMaps
})

// Actions for updating map state
export const updateMapZoomAtom = atom(
  null,
  (get, set, zoom: number) => {
    const current = get(globalMapStateAtom)
    set(globalMapStateAtom, { ...current, zoom: Math.max(0.1, Math.min(20, zoom)) })
  }
)

export const updateMapCenterAtom = atom(
  null,
  (get, set, center: { x: number; y: number }) => {
    const current = get(globalMapStateAtom)
    set(globalMapStateAtom, { ...current, centerX: center.x, centerY: center.y })
  }
)

export const updateSelectedMapAtom = atom(
  null,
  (get, set, mapId: string | undefined) => {
    const current = get(globalMapStateAtom)
    set(globalMapStateAtom, { ...current, selectedMap: mapId })
  }
)

export const toggleOverlaysAtom = atom(
  null,
  (get, set) => {
    const current = get(globalMapStateAtom)
    set(globalMapStateAtom, { ...current, showOverlays: !current.showOverlays })
  }
)