import { useEffect, useState } from 'preact/hooks'
import { useAtomValue } from 'jotai'
import { useNavigate } from 'react-router-dom'
import { databaseAtom } from '@/data'
import { parseTMX, getTileInfo, getTileStyles, TMXMap, TMXLayer, TMXObject } from '@/lib/tmx-parser'
import { createSpawnGroupsFromDatabase, getRandomInt, getMonsterSprite, SpawnData } from '@/lib/spawn-groups'

interface TileRendererProps {
  mapId: string
  className?: string
}

export const TileRenderer = ({ mapId, className = '' }: TileRendererProps) => {
  const [tmxMap, setTmxMap] = useState<TMXMap | null>(null)
  const [spawnData, setSpawnData] = useState<SpawnData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const database = useAtomValue(databaseAtom)
  const navigate = useNavigate()

  useEffect(() => {
    const loadMap = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log(`Loading TMX data for: ${mapId}`)

        const map = await parseTMX(mapId)
        console.log(`Loaded TMX map:`, map)
        console.log(`Tilesets:`, map.tilesets.map(ts => `${ts.name}: ${ts.firstgid}-${ts.firstgid + ts.tilecount - 1} (${ts.tilecount} tiles)`))

        // Debug: Check some tile GIDs from first layer
        if (map.layers.length > 0) {
          const firstLayer = map.layers[0]
          const sampleGids = firstLayer.data.slice(0, 20).filter(gid => gid !== 0)
          console.log(`Sample GIDs from ${firstLayer.name}:`, sampleGids)
        }
        setTmxMap(map)

        // Create spawn groups from database
        if (database) {
          const spawns = createSpawnGroupsFromDatabase(database)
          setSpawnData(spawns)
        }
      } catch (err) {
        console.error('Failed to load TMX map:', err)
        setError(err instanceof Error ? err.message : 'Failed to load map')
      } finally {
        setLoading(false)
      }
    }

    loadMap()
  }, [mapId, database])

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-gray-600 dark:text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading map tiles...</p>
        </div>
      </div>
    )
  }

  if (error || !tmxMap) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Error loading map: {error || 'Unknown error'}</p>
        </div>
      </div>
    )
  }

  const mapWidth = tmxMap.width * tmxMap.tilewidth
  const mapHeight = tmxMap.height * tmxMap.tileheight

  // Filter layers we want to render
  const renderLayers = ['Ground', 'Objects', 'Above']
  const layersToRender = tmxMap.layers.filter(layer =>
    renderLayers.includes(layer.name)
  )

  return (
    <div className={`relative overflow-auto bg-gray-900 ${className}`}>
      {/* Map Container */}
      <div
        className="relative mx-auto"
        style={{
          width: `${mapWidth}px`,
          height: `${mapHeight}px`,
          backgroundColor: 'white'
        }}
      >
        {/* Render Tile Layers */}
        {layersToRender.map(layer => (
          <TileLayer
            key={layer.id}
            layer={layer}
            tmxMap={tmxMap}
          />
        ))}

        {/* Render Object Groups */}
        {tmxMap.objectgroups.map((group, groupIndex) => (
          <ObjectGroup
            key={`${group.name}-${group.id}-${groupIndex}`}
            group={group}
            mapId={mapId}
            spawnData={spawnData}
            navigate={navigate}
          />
        ))}

        {/* Debug Info */}
        <div className="absolute top-2 left-2 bg-black bg-opacity-60 text-white text-xs p-2 rounded">
          <div>Map: {mapId}</div>
          <div>Size: {tmxMap.width}×{tmxMap.height}</div>
          <div>Layers: {layersToRender.length}</div>
          <div>Objects: {tmxMap.objectgroups.reduce((sum, g) => sum + g.objects.length, 0)}</div>
        </div>
      </div>
    </div>
  )
}

interface TileLayerProps {
  layer: TMXLayer
  tmxMap: TMXMap
}

const TileLayer = ({ layer, tmxMap }: TileLayerProps) => {
  const tiles = []

  for (let y = 0; y < layer.height; y++) {
    for (let x = 0; x < layer.width; x++) {
      const index = y * layer.width + x
      const gid = layer.data[index]

      if (gid === 0) continue // No tile

      const tileInfo = getTileInfo(gid, tmxMap.tilesets)
      if (!tileInfo) {
        // Add a placeholder for missing tiles during debugging
        tiles.push(
          <div
            key={`${layer.name}-${x}-${y}-missing`}
            className="absolute bg-gray-400 opacity-30"
            style={{
              left: `${x * tmxMap.tilewidth}px`,
              top: `${y * tmxMap.tileheight}px`,
              width: `${tmxMap.tilewidth}px`,
              height: `${tmxMap.tileheight}px`
            }}
            title={`Missing tile GID: ${gid}`}
          />
        )
        continue
      }

      const tileStyles = getTileStyles(tileInfo, tmxMap.tilewidth)

      tiles.push(
        <div
          key={`${layer.name}-${x}-${y}`}
          className="absolute"
          style={{
            left: `${x * tmxMap.tilewidth}px`,
            top: `${y * tmxMap.tileheight}px`,
            ...tileStyles
          }}
        />
      )
    }
  }

  return <>{tiles}</>
}

interface ObjectGroupProps {
  group: { id: number; name: string; objects: TMXObject[] }
  mapId: string
  spawnData: SpawnData | null
  navigate: (path: string) => void
}

const ObjectGroup = ({ group, mapId, spawnData, navigate }: ObjectGroupProps) => {
  if (group.name === 'Mapevents') {
    return (
      <>
        {group.objects.map((obj, objIndex) => (
          <MapEvent key={`mapevent-${obj.id}-${objIndex}`} obj={obj} navigate={navigate} />
        ))}
      </>
    )
  }

  if (group.name === 'Spawn') {
    return (
      <>
        {group.objects.map((obj, objIndex) => (
          <SpawnArea key={`spawn-${obj.id}-${objIndex}`} obj={obj} spawnData={spawnData} navigate={navigate} />
        ))}
      </>
    )
  }

  if (group.name === 'Keys') {
    return (
      <>
        {group.objects.map((obj, objIndex) => (
          <ScriptArea key={`script-${obj.id}-${objIndex}`} obj={obj} />
        ))}
      </>
    )
  }

  return null
}

const MapEvent = ({ obj, navigate }: { obj: TMXObject; navigate: (path: string) => void }) => {
  const targetMap = obj.properties.map

  const handleClick = () => {
    if (targetMap) {
      navigate(`/map/${targetMap}`)
    }
  }

  // Determine type of entrance based on naming patterns
  const isBasement = targetMap && (
    targetMap.includes('_basement') ||
    targetMap.includes('_cellar') ||
    obj.name?.toLowerCase().includes('stairs') ||
    obj.name?.toLowerCase().includes('basement') ||
    obj.name?.toLowerCase().includes('cellar')
  )

  const isDoor = targetMap && (
    targetMap.includes('_interior') ||
    targetMap.includes('_house') ||
    targetMap.includes('_inn') ||
    targetMap.includes('_shop') ||
    targetMap.includes('_cave') ||
    obj.name?.toLowerCase().includes('door') ||
    obj.name?.toLowerCase().includes('enter')
  )

  const isRegularExit = !isDoor && !isBasement

  return (
    <div
      className={`absolute border-2 cursor-pointer transition-colors ${
        isBasement
          ? 'border-purple-500 bg-purple-500 hover:bg-purple-500 hover:bg-opacity-30'
          : isDoor
          ? 'border-blue-500 bg-blue-500 hover:bg-blue-500 hover:bg-opacity-30'
          : 'border-red-500 bg-red-500 hover:bg-red-500 hover:bg-opacity-30'
      } bg-opacity-20`}
      style={{
        left: `${obj.x}px`,
        top: `${obj.y}px`,
        width: `${obj.width}px`,
        height: `${obj.height}px`,
        zIndex: 5
      }}
      title={
        isBasement ? `Go to basement: ${targetMap}` :
        isDoor ? `Enter ${targetMap}` :
        `Exit to ${targetMap}`
      }
      onClick={handleClick}
    />
  )
}

const SpawnArea = ({ obj, spawnData, navigate }: { obj: TMXObject; spawnData: SpawnData | null; navigate: (path: string) => void }) => {
  const spawngroup = obj.properties.spawngroup
  const quantity = parseInt(obj.properties.quantity || '1')

  if (!spawnData || !spawngroup) {
    return (
      <div
        className="absolute border border-yellow-500 bg-yellow-500 bg-opacity-10"
        style={{
          left: `${obj.x}px`,
          top: `${obj.y}px`,
          width: `${obj.width}px`,
          height: `${obj.height}px`
        }}
        title={`Spawn: ${spawngroup} (${quantity}) - No data`}
      />
    )
  }

  const spawnGroup = spawnData.spawngroups[spawngroup.toLowerCase()]
  if (!spawnGroup || spawnGroup.monsters.length === 0) {
    console.log(`No spawn group found for: ${spawngroup}`, {
      available: Object.keys(spawnData.spawngroups).slice(0, 10),
      spawngroup: spawngroup.toLowerCase()
    })
    return (
      <div
        className="absolute border border-yellow-500 bg-yellow-500 bg-opacity-10"
        style={{
          left: `${obj.x}px`,
          top: `${obj.y}px`,
          width: `${obj.width}px`,
          height: `${obj.height}px`
        }}
        title={`Spawn: ${spawngroup} (${quantity}) - No monsters found`}
      />
    )
  }

  console.log(`Rendering ${quantity} monsters for spawn group: ${spawngroup}`, spawnGroup.monsters.length)
  console.log('Sample monster data:', spawnGroup.monsters[0])

  // Render individual monsters within the spawn area
  const monsters = []
  for (let i = 0; i < quantity; i++) {
    const monster = spawnGroup.monsters[i % spawnGroup.monsters.length]
    const sprite = getMonsterSprite(monster)
    console.log(`Monster ${monster.id}:`, { monster, sprite })

    // Random position within the spawn area (with padding for 32px sprite)
    const randomX = obj.x + getRandomInt(Math.max(1, obj.width - 32))
    const randomY = obj.y + getRandomInt(Math.max(1, obj.height - 32))

    monsters.push(
      <div
        key={`${spawngroup}-${i}`}
        className="absolute cursor-pointer hover:brightness-110"
        style={{
          left: `${randomX}px`,
          top: `${randomY}px`,
          width: '32px',
          height: '32px',
          zIndex: 10
        }}
        title={monster.name}
        onClick={(e) => {
          e.stopPropagation()
          console.log('Clicked monster/NPC:', monster)
          // Navigate to the specific monster/NPC page with hash anchor
          if (monster.isNPC || monster.monsterClass === 'npc') {
            navigate(`/npc#${monster.id}`)
          } else {
            // For monsters, we might need to determine the category
            // For now, navigate to monsters page with the monster ID
            navigate(`/monsters#${monster.id}`)
          }
        }}
      >
        <div
          className="relative"
          style={{
            width: '32px',
            height: '32px'
          }}
          title={`${monster.name}`}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundImage: `url(${sprite.src})`,
              backgroundPosition: `-${sprite.x}px -${sprite.y}px`,
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated'
            }}
          />
        </div>
      </div>
    )
  }

  return <>{monsters}</>
}

const ScriptArea = ({ obj }: { obj: TMXObject }) => {
  return (
    <div
      className="absolute border border-blue-500 bg-blue-500 bg-opacity-10"
      style={{
        left: `${obj.x}px`,
        top: `${obj.y}px`,
        width: `${obj.width}px`,
        height: `${obj.height}px`
      }}
      title={`Script: ${obj.name}`}
    />
  )
}