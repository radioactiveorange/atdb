import { MapData } from './map-utils'

export interface MapSegment {
  id: string
  name: string
  maps: MapData[]
  bounds: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
}

// Extract area name from map ID
const getAreaFromMapId = (mapId: string): string => {
  // Handle numbered variants (e.g., galmore_10a -> galmore)
  const baseId = mapId.replace(/[_\d]+[a-z]?$/, '')

  // Common area patterns
  if (mapId.startsWith('aidem')) return 'aidem'
  if (mapId.startsWith('galmore')) return 'galmore'
  if (mapId.startsWith('lake_shore')) return 'lake_shore'
  if (mapId.startsWith('way_to_sullengard')) return 'sullengard'
  if (mapId.startsWith('rat_mountain')) return 'rat_mountain'
  if (mapId.startsWith('blackwater')) return 'blackwater'
  if (mapId.startsWith('forest')) return 'forest'
  if (mapId.startsWith('mountain')) return 'mountain'
  if (mapId.startsWith('dungeon')) return 'dungeons'
  if (mapId.includes('cave') || mapId.includes('mine')) return 'caves'
  if (mapId.includes('town') || mapId.includes('village')) return 'settlements'

  // Default fallback - use first part of ID
  return baseId || 'other'
}

// Calculate bounds for a group of maps
const calculateBounds = (maps: MapData[]) => {
  if (maps.length === 0) {
    return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  }

  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  maps.forEach(map => {
    const mapMaxX = map.x + (map.width * 32)
    const mapMaxY = map.y + (map.height * 32)

    minX = Math.min(minX, map.x)
    maxX = Math.max(maxX, mapMaxX)
    minY = Math.min(minY, map.y)
    maxY = Math.max(maxY, mapMaxY)
  })

  return { minX, maxX, minY, maxY }
}

// Group maps into logical segments
export const createMapSegments = (maps: MapData[]): MapSegment[] => {
  const areaGroups = new Map<string, MapData[]>()

  // Group maps by area
  maps.forEach(map => {
    const area = getAreaFromMapId(map.id)
    if (!areaGroups.has(area)) {
      areaGroups.set(area, [])
    }
    areaGroups.get(area)!.push(map)
  })

  // Convert to segments with bounds
  const segments: MapSegment[] = []

  areaGroups.forEach((areaMaps, areaId) => {
    // Skip very small segments (likely isolated maps)
    if (areaMaps.length < 2) {
      // Add to 'other' segment instead
      if (!areaGroups.has('other')) {
        areaGroups.set('other', [])
      }
      areaGroups.get('other')!.push(...areaMaps)
      return
    }

    const bounds = calculateBounds(areaMaps)

    segments.push({
      id: areaId,
      name: formatSegmentName(areaId),
      maps: areaMaps,
      bounds
    })
  })

  // Handle 'other' segment if it exists
  if (areaGroups.has('other')) {
    const otherMaps = areaGroups.get('other')!
    if (otherMaps.length > 0) {
      segments.push({
        id: 'other',
        name: 'Other Areas',
        maps: otherMaps,
        bounds: calculateBounds(otherMaps)
      })
    }
  }

  // Sort segments by map count (largest first)
  segments.sort((a, b) => b.maps.length - a.maps.length)

  return segments
}

// Format segment name for display
const formatSegmentName = (segmentId: string): string => {
  const nameMap: Record<string, string> = {
    'aidem': 'Aidem',
    'galmore': 'Galmore',
    'lake_shore': 'Lake Shore Road',
    'sullengard': 'Way to Sullengard',
    'rat_mountain': 'Rat Mountain',
    'blackwater': 'Blackwater',
    'forest': 'Forest Areas',
    'mountain': 'Mountain Areas',
    'dungeons': 'Dungeons',
    'caves': 'Caves & Mines',
    'settlements': 'Towns & Villages',
    'other': 'Other Areas'
  }

  return nameMap[segmentId] || segmentId.charAt(0).toUpperCase() + segmentId.slice(1)
}

// Get default segment (largest area)
export const getDefaultSegment = (segments: MapSegment[]): string => {
  return segments.length > 0 ? segments[0].id : 'other'
}