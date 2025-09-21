import { MapData } from './map-utils'
import { availableMapIds } from '@/data/available-maps'
import { worldMapData } from '@/data/world-coordinates'

// Load map data from parsed world coordinates
export const loadMapData = async (): Promise<MapData[]> => {
  try {
    console.log(`Loading ${worldMapData.length} maps from world coordinates...`)
    
    // Convert world map data to our MapData format
    const maps: MapData[] = worldMapData
      .filter(worldMap => availableMapIds.includes(worldMap.id)) // Only include maps we have images for
      .map(worldMap => ({
        id: worldMap.id,
        name: formatMapName(worldMap.id),
        x: worldMap.x,
        y: worldMap.y,
        width: worldMap.width,
        height: worldMap.height,
        imageUrl: `/atdb/backgrounds/${worldMap.id}.jpg`,
        connections: worldMap.connections,
      }))
    
    console.log(`Successfully loaded ${maps.length} positioned maps`)
    return maps
  } catch (error) {
    console.warn('Failed to load world coordinates, using fallback', error)
    return loadFallbackMaps()
  }
}

// Fallback to simple grid layout
const loadFallbackMaps = (): MapData[] => {
  const mapIds = availableMapIds.slice(0, 100) // Limit for fallback
  console.log(`Loading ${mapIds.length} maps in fallback grid...`)
  
  return mapIds.map((id, index) => {
    const mapsPerRow = 20
    const tileSize = 200
    
    return {
      id,
      name: formatMapName(id),
      x: (index % mapsPerRow) * tileSize,
      y: Math.floor(index / mapsPerRow) * tileSize,
      width: 50,
      height: 40,
      imageUrl: `/atdb/backgrounds/${id}.jpg`,
    }
  })
}

// Get all map IDs from generated list
const getAllMapIds = async (): Promise<string[]> => {
  return availableMapIds
}

// Helper function to format map names nicely
const formatMapName = (id: string): string => {
  return id
    .replace(/_/g, ' ')
    .replace(/(\d+)/g, ' $1')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Parse TMX file to get actual map dimensions and coordinates
// This will be implemented later for more accurate positioning
export const parseMapFromTMX = async (mapId: string): Promise<Partial<MapData> | null> => {
  try {
    const response = await fetch(`/atdb/xml/${mapId}.tmx`)
    if (!response.ok) return null
    
    const xmlText = await response.text()
    const parser = new DOMParser()
    const doc = parser.parseFromString(xmlText, 'text/xml')
    
    const mapElement = doc.querySelector('map')
    if (!mapElement) return null
    
    const width = parseInt(mapElement.getAttribute('width') || '0')
    const height = parseInt(mapElement.getAttribute('height') || '0')
    const tilewidth = parseInt(mapElement.getAttribute('tilewidth') || '32')
    const tileheight = parseInt(mapElement.getAttribute('tileheight') || '32')
    
    return {
      width,
      height,
      // TODO: Parse actual world coordinates from TMX properties
    }
  } catch (error) {
    console.warn(`Failed to parse TMX for ${mapId}:`, error)
    return null
  }
}

// Enhanced map loader that combines TMX data with generated images
export const loadEnhancedMapData = async (): Promise<MapData[]> => {
  const basicMaps = await loadMapData()
  
  // Enhance with TMX data where available
  const enhancedMaps = await Promise.all(
    basicMaps.map(async (map) => {
      const tmxData = await parseMapFromTMX(map.id)
      return tmxData ? { ...map, ...tmxData } : map
    })
  )
  
  return enhancedMaps
}