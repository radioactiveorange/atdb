// TMX (Tiled Map Exchange) parser for Andor's Trail maps
import { inflate } from 'pako'

export interface TMXTileset {
  firstgid: number
  name: string
  tilewidth: number
  tileheight: number
  tilecount: number
  columns: number
  image: {
    source: string
    width: number
    height: number
  }
}

export interface TMXLayer {
  id: number
  name: string
  width: number
  height: number
  data: number[] // Decoded tile GIDs
}

export interface TMXObject {
  id: number
  name: string
  type: string
  x: number
  y: number
  width: number
  height: number
  properties: Record<string, string>
}

export interface TMXObjectGroup {
  id: number
  name: string
  objects: TMXObject[]
}

export interface TMXMap {
  width: number
  height: number
  tilewidth: number
  tileheight: number
  tilesets: TMXTileset[]
  layers: TMXLayer[]
  objectgroups: TMXObjectGroup[]
  properties: Record<string, string>
}

export interface TileInfo {
  tileset: TMXTileset
  localId: number // ID within the tileset (gid - firstgid)
  x: number // X position in tileset grid
  y: number // Y position in tileset grid
}

// Parse TMX XML data
export const parseTMX = async (mapId: string): Promise<TMXMap> => {
  const response = await fetch(`/atdb/dist/xml/${mapId}.tmx`)
  const xmlText = await response.text()

  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(xmlText, 'text/xml')

  const mapElement = xmlDoc.querySelector('map')
  if (!mapElement) throw new Error('Invalid TMX file')

  const map: TMXMap = {
    width: parseInt(mapElement.getAttribute('width') || '0'),
    height: parseInt(mapElement.getAttribute('height') || '0'),
    tilewidth: parseInt(mapElement.getAttribute('tilewidth') || '32'),
    tileheight: parseInt(mapElement.getAttribute('tileheight') || '32'),
    tilesets: [],
    layers: [],
    objectgroups: [],
    properties: {}
  }

  // Parse properties
  const propertiesEl = mapElement.querySelector('properties')
  if (propertiesEl) {
    propertiesEl.querySelectorAll('property').forEach(prop => {
      const name = prop.getAttribute('name')
      const value = prop.getAttribute('value')
      if (name && value) {
        map.properties[name] = value
      }
    })
  }

  // Parse tilesets
  mapElement.querySelectorAll('tileset').forEach(tilesetEl => {
    const imageEl = tilesetEl.querySelector('image')
    if (imageEl) {
      const tilewidth = parseInt(tilesetEl.getAttribute('tilewidth') || '32')
      const tileheight = parseInt(tilesetEl.getAttribute('tileheight') || '32')
      const imageWidth = parseInt(imageEl.getAttribute('width') || '0')
      const imageHeight = parseInt(imageEl.getAttribute('height') || '0')

      // Calculate tilecount and columns from image dimensions
      const columns = Math.floor(imageWidth / tilewidth)
      const rows = Math.floor(imageHeight / tileheight)
      const tilecount = columns * rows

      map.tilesets.push({
        firstgid: parseInt(tilesetEl.getAttribute('firstgid') || '0'),
        name: tilesetEl.getAttribute('name') || '',
        tilewidth,
        tileheight,
        tilecount,
        columns,
        image: {
          source: imageEl.getAttribute('source') || '',
          width: imageWidth,
          height: imageHeight
        }
      })
    }
  })

  // Parse layers
  mapElement.querySelectorAll('layer').forEach(layerEl => {
    const dataEl = layerEl.querySelector('data')
    if (dataEl) {
      const layer: TMXLayer = {
        id: parseInt(layerEl.getAttribute('id') || '0'),
        name: layerEl.getAttribute('name') || '',
        width: parseInt(layerEl.getAttribute('width') || '0'),
        height: parseInt(layerEl.getAttribute('height') || '0'),
        data: []
      }

      // Decode tile data
      const encoding = dataEl.getAttribute('encoding')
      const compression = dataEl.getAttribute('compression')

      if (encoding === 'base64') {
        layer.data = decodeBase64TileData(dataEl.textContent || '', compression)
      }

      map.layers.push(layer)
    }
  })

  // Parse object groups
  mapElement.querySelectorAll('objectgroup').forEach(groupEl => {
    const group: TMXObjectGroup = {
      id: parseInt(groupEl.getAttribute('id') || '0'),
      name: groupEl.getAttribute('name') || '',
      objects: []
    }

    groupEl.querySelectorAll('object').forEach(objEl => {
      const obj: TMXObject = {
        id: parseInt(objEl.getAttribute('id') || '0'),
        name: objEl.getAttribute('name') || '',
        type: objEl.getAttribute('type') || '',
        x: parseInt(objEl.getAttribute('x') || '0'),
        y: parseInt(objEl.getAttribute('y') || '0'),
        width: parseInt(objEl.getAttribute('width') || '0'),
        height: parseInt(objEl.getAttribute('height') || '0'),
        properties: {}
      }

      // Parse object properties
      const propsEl = objEl.querySelector('properties')
      if (propsEl) {
        propsEl.querySelectorAll('property').forEach(prop => {
          const name = prop.getAttribute('name')
          const value = prop.getAttribute('value')
          if (name && value) {
            obj.properties[name] = value
          }
        })
      }

      group.objects.push(obj)
    })

    map.objectgroups.push(group)
  })

  return map
}

// Decode base64 encoded tile data
const decodeBase64TileData = (data: string, compression?: string | null): number[] => {
  // Remove whitespace and decode base64
  const cleanData = data.replace(/\s/g, '')
  const binaryString = atob(cleanData)
  const bytes = new Uint8Array(binaryString.length)

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  let decompressed = bytes

  // Handle zlib compression if present
  if (compression === 'zlib') {
    try {
      decompressed = inflate(bytes)
    } catch (error) {
      console.error('Failed to decompress zlib data:', error)
      throw error
    }
  }

  // Convert bytes to 32-bit integers (tile GIDs)
  const tileGids: number[] = []
  for (let i = 0; i < decompressed.length; i += 4) {
    if (i + 3 < decompressed.length) {
      const gid = decompressed[i] |
                  (decompressed[i + 1] << 8) |
                  (decompressed[i + 2] << 16) |
                  (decompressed[i + 3] << 24)
      tileGids.push(gid)
    }
  }

  return tileGids
}

// Get tileset and position info for a tile GID
export const getTileInfo = (gid: number, tilesets: TMXTileset[]): TileInfo | null => {
  if (gid === 0) return null // 0 means no tile

  // Strip any tile flags (flip/rotation flags are in the upper bits)
  const cleanGid = gid & 0x0FFFFFFF

  // Find the tileset this GID belongs to
  let tileset: TMXTileset | null = null
  for (let i = tilesets.length - 1; i >= 0; i--) {
    if (cleanGid >= tilesets[i].firstgid) {
      tileset = tilesets[i]
      break
    }
  }

  if (!tileset) {
    console.warn(`No tileset found for GID: ${gid} (clean: ${cleanGid})`)
    return null
  }

  const localId = cleanGid - tileset.firstgid

  // Check if the localId is valid for this tileset
  if (localId >= tileset.tilecount) {
    console.warn(`Local ID ${localId} exceeds tileset ${tileset.name} tile count (${tileset.tilecount})`)
    return null
  }

  const x = localId % tileset.columns
  const y = Math.floor(localId / tileset.columns)

  return {
    tileset,
    localId,
    x,
    y
  }
}

// Get CSS styles for rendering a tile
export const getTileStyles = (tileInfo: TileInfo, tileSize: number = 32) => {
  const { tileset, x, y } = tileInfo

  // Convert relative path to absolute
  const imagePath = tileset.image.source.replace('../drawable/', '/atdb/drawable/')

  // Debug first few tiles only to avoid console spam
  if (Math.random() < 0.01) {
    console.log(`Sample tile: tileset=${tileset.name}, localId=${tileInfo.localId}, pos=(${x},${y}), path=${imagePath}`)
  }

  return {
    width: `${tileSize}px`,
    height: `${tileSize}px`,
    overflow: 'hidden',
    backgroundImage: `url(${imagePath})`,
    backgroundPosition: `-${x * tileSize}px -${y * tileSize}px`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${tileset.image.width}px ${tileset.image.height}px`
  }
}