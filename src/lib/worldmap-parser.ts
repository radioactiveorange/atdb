export interface WorldMapSegment {
  id: string
  name: string
  x: number
  y: number
  maps: WorldMapEntry[]
  bounds: {
    minX: number
    maxX: number
    minY: number
    maxY: number
  }
}

export interface WorldMapEntry {
  id: string
  x: number
  y: number
}

export interface WorldMapData {
  segments: WorldMapSegment[]
  segmentsMap: Record<string, WorldMapSegment>
}

// Parse the official worldmap.xml file
export const parseWorldMapXML = async (): Promise<WorldMapData> => {
  try {
    const response = await fetch('/atdb/worldmap.xml')
    const xmlText = await response.text()

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

    const segments: WorldMapSegment[] = []
    const segmentsMap: Record<string, WorldMapSegment> = {}

    const segmentElements = xmlDoc.querySelectorAll('segment')

    segmentElements.forEach(segmentEl => {
      const id = segmentEl.getAttribute('id') || ''
      const x = parseInt(segmentEl.getAttribute('x') || '0')
      const y = parseInt(segmentEl.getAttribute('y') || '0')

      const maps: WorldMapEntry[] = []
      const mapElements = segmentEl.querySelectorAll('map')

      mapElements.forEach(mapEl => {
        const mapId = mapEl.getAttribute('id') || ''
        const mapX = parseInt(mapEl.getAttribute('x') || '0')
        const mapY = parseInt(mapEl.getAttribute('y') || '0')

        maps.push({
          id: mapId,
          x: mapX,
          y: mapY
        })
      })

      // Calculate bounds for this segment
      const bounds = calculateSegmentBounds(maps, x, y)

      const segment: WorldMapSegment = {
        id,
        name: formatSegmentName(id),
        x,
        y,
        maps,
        bounds
      }

      segments.push(segment)
      segmentsMap[id] = segment
    })

    // Sort segments by map count (largest first)
    segments.sort((a, b) => b.maps.length - a.maps.length)

    return {
      segments,
      segmentsMap
    }
  } catch (error) {
    console.error('Failed to parse worldmap.xml:', error)
    return {
      segments: [],
      segmentsMap: {}
    }
  }
}

// Calculate bounds for a segment - we'll compute this from the actual map data later
const calculateSegmentBounds = (maps: WorldMapEntry[], segmentX: number, segmentY: number) => {
  if (maps.length === 0) {
    return { minX: segmentX, maxX: segmentX, minY: segmentY, maxY: segmentY }
  }

  // For now, return a simple bounds calculation
  // This will be updated when we integrate with actual map data
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity

  maps.forEach(map => {
    minX = Math.min(minX, map.x)
    maxX = Math.max(maxX, map.x + 50) // Placeholder - will use actual map width
    minY = Math.min(minY, map.y)
    maxY = Math.max(maxY, map.y + 50) // Placeholder - will use actual map height
  })

  return { minX, maxX, minY, maxY }
}

// Format segment name for display
const formatSegmentName = (segmentId: string): string => {
  // Convert underscore_case to Title Case
  return segmentId
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Get default segment (world1 if available, otherwise first segment)
export const getDefaultSegmentId = (segments: WorldMapSegment[]): string => {
  // Look for main world segment first
  const mainSegment = segments.find(s =>
    s.id === 'world1' ||
    s.id === 'main' ||
    s.id.includes('world')
  )

  if (mainSegment) return mainSegment.id

  // Otherwise return the largest segment
  return segments.length > 0 ? segments[0].id : ''
}