import fs from 'fs-extra'
import path from 'path'
import { XMLParser } from 'fast-xml-parser'

const { readdir, readFile, writeFile } = fs
const tmxFolder = './public/xml/'
const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
})

const parseWorldCoordinates = async () => {
  try {
    const files = await readdir(tmxFolder)
    const mapFiles = files.filter((file) => path.extname(file) === '.tmx')
    
    console.log(`Parsing world coordinates and connections from ${mapFiles.length} TMX files...`)
    
    const worldMaps = []
    const mapConnections = new Map()
    
    for (const file of mapFiles) {
      const mapId = path.basename(file, '.tmx')
      const resource = `${tmxFolder}${file}`
      
      try {
        const data = await readFile(resource, 'utf8')
        const xmlString = data.replace(/<!--.*-->/g, '')
        const mapXML = parser.parse(xmlString)
        
        const map = mapXML.map
        if (!map) continue
        
        // Extract basic map properties
        const mapData = {
          id: mapId,
          width: parseInt(map.width) || 0,
          height: parseInt(map.height) || 0,
          tilewidth: parseInt(map.tilewidth) || 32,
          tileheight: parseInt(map.tileheight) || 32,
          connections: [],
        }
        
        // Parse map connections from objectgroups
        if (map.objectgroup) {
          const objectGroups = Array.isArray(map.objectgroup) ? map.objectgroup : [map.objectgroup]
          
          for (const group of objectGroups) {
            if (group.name === 'Mapevents' && group.object) {
              const objects = Array.isArray(group.object) ? group.object : [group.object]
              
              for (const obj of objects) {
                if (obj.type === 'mapchange' && obj.properties && obj.properties.property) {
                  const properties = Array.isArray(obj.properties.property) 
                    ? obj.properties.property 
                    : [obj.properties.property]
                  
                  let targetMap = null
                  let targetPlace = null
                  
                  for (const prop of properties) {
                    if (prop.name === 'map') targetMap = prop.value
                    if (prop.name === 'place') targetPlace = prop.value
                  }
                  
                  if (targetMap) {
                    mapData.connections.push({
                      targetMap,
                      targetPlace,
                      x: parseInt(obj.x) || 0,
                      y: parseInt(obj.y) || 0,
                      width: parseInt(obj.width) || 32,
                      height: parseInt(obj.height) || 32,
                    })
                  }
                }
              }
            }
          }
        }
        
        // Calculate pixel dimensions
        mapData.pixelWidth = mapData.width * mapData.tilewidth
        mapData.pixelHeight = mapData.height * mapData.tileheight
        
        worldMaps.push(mapData)
        mapConnections.set(mapId, mapData.connections)
        
        if (worldMaps.length % 100 === 0) {
          console.log(`Processed ${worldMaps.length} maps...`)
        }
        
      } catch (error) {
        console.warn(`Failed to parse ${mapId}:`, error.message)
      }
    }
    
    // Build connected world layout
    const connectedMaps = buildConnectedWorld(worldMaps, mapConnections)
    const bounds = findWorldBounds(connectedMaps)
    
    console.log(`Successfully parsed ${worldMaps.length} maps`)
    console.log(`World bounds:`, bounds)
    console.log(`Sample connections:`, Array.from(mapConnections.entries()).slice(0, 3))
    
    // Save the world coordinate data
    const jsContent = `// Auto-generated world coordinates from TMX files
export const worldMapData = ${JSON.stringify(connectedMaps, null, 2)}

export const worldBounds = ${JSON.stringify(bounds, null, 2)}

export const mapConnections = ${JSON.stringify(Array.from(mapConnections.entries()), null, 2)}
`
    
    await writeFile('./src/data/world-coordinates.ts', jsContent)
    console.log('Generated src/data/world-coordinates.ts')
    
    return connectedMaps
  } catch (error) {
    console.error('Failed to parse world coordinates:', error)
    return []
  }
}

// Build connected world by analyzing map connections
const buildConnectedWorld = (worldMaps, mapConnections) => {
  const positionedMaps = new Map()
  const TILE_SIZE = 32 // Use actual tile size from TMX files
  
  // Start with the first map that has outdoor-sounding connections
  let startMap = worldMaps.find(m => 
    m.connections.some(c => 
      c.targetMap.includes('galmore') || 
      c.targetMap.includes('field') || 
      c.targetMap.includes('mountain') ||
      !c.targetMap.includes('_')
    )
  ) || worldMaps[0]
  
  // Place the starting map at origin
  positionedMaps.set(startMap.id, {
    ...startMap,
    x: 0,
    y: 0,
  })
  
  console.log(`Starting world build from: ${startMap.id}`)
  
  // Queue for processing connected maps
  const queue = [startMap.id]
  const processed = new Set([startMap.id])
  
  while (queue.length > 0) {
    const currentMapId = queue.shift()
    const currentMap = positionedMaps.get(currentMapId)
    
    if (!currentMap) continue
    
    // Process all connections from this map
    for (const connection of currentMap.connections) {
      const targetMapId = connection.targetMap
      
      if (processed.has(targetMapId)) continue
      
      // Find the target map data
      const targetMapData = worldMaps.find(m => m.id === targetMapId)
      if (!targetMapData) continue
      
      // Calculate position based on connection direction
      let newX, newY
      
      // Determine direction based on connection position within current map
      const connX = connection.x / currentMap.tilewidth
      const connY = connection.y / currentMap.tileheight
      const centerX = currentMap.width / 2
      const centerY = currentMap.height / 2
      
      if (connX < centerX / 2) {
        // Left side - place target to the left
        newX = currentMap.x - (targetMapData.width * TILE_SIZE)
        newY = currentMap.y
      } else if (connX > centerX * 1.5) {
        // Right side - place target to the right
        newX = currentMap.x + (currentMap.width * TILE_SIZE)
        newY = currentMap.y
      } else if (connY < centerY / 2) {
        // Top side - place target above
        newX = currentMap.x
        newY = currentMap.y - (targetMapData.height * TILE_SIZE)
      } else if (connY > centerY * 1.5) {
        // Bottom side - place target below
        newX = currentMap.x
        newY = currentMap.y + (currentMap.height * TILE_SIZE)
      } else {
        // Center connection - probably indoor/special
        // Place nearby with slight offset
        newX = currentMap.x + (currentMap.width * TILE_SIZE * 0.1)
        newY = currentMap.y + (currentMap.height * TILE_SIZE * 0.1)
      }
      
      positionedMaps.set(targetMapId, {
        ...targetMapData,
        x: newX,
        y: newY,
      })
      
      queue.push(targetMapId)
      processed.add(targetMapId)
    }
  }
  
  console.log(`Positioned ${positionedMaps.size} connected maps`)
  
  // Place remaining unconnected maps in a grid
  const connectedMaps = Array.from(positionedMaps.values())
  const unconnectedMaps = worldMaps.filter(m => !positionedMaps.has(m.id))
  
  if (unconnectedMaps.length > 0) {
    console.log(`Placing ${unconnectedMaps.length} unconnected maps in grid`)
    
    // Find bounds of connected world
    const bounds = findWorldBounds(connectedMaps)
    let gridX = bounds.maxX + 500
    let gridY = bounds.minY
    const mapsPerRow = 20
    
    unconnectedMaps.forEach((map, index) => {
      const col = index % mapsPerRow
      const row = Math.floor(index / mapsPerRow)
      
      connectedMaps.push({
        ...map,
        x: gridX + (col * 200),
        y: gridY + (row * 150),
      })
    })
  }
  
  return connectedMaps
}

const findWorldBounds = (maps) => {
  if (maps.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 }
  
  let minX = Infinity, maxX = -Infinity
  let minY = Infinity, maxY = -Infinity
  
  for (const map of maps) {
    if (map.x !== undefined && map.y !== undefined) {
      minX = Math.min(minX, map.x)
      maxX = Math.max(maxX, map.x + (map.width * 32)) // 32 = TILE_SIZE
      minY = Math.min(minY, map.y)
      maxY = Math.max(maxY, map.y + (map.height * 32))
    }
  }
  
  // If no positioned maps found, return default bounds
  if (minX === Infinity) {
    return { minX: 0, maxX: 1000, minY: 0, maxY: 1000 }
  }
  
  return { minX, maxX, minY, maxY }
}


await parseWorldCoordinates()