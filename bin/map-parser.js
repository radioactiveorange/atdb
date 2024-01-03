import pako from 'pako'
import atob from 'atob'

export const parseXMLMap = (xo, name) => {
  const newMap = {
    name,
    properties: [],
    tilesets: [],
    layers: {},
    layerList: [],
  }

  const { map } = xo

  const { layer, tileset, properties } = map

  layer.forEach((l) => parseLayer(l, newMap, name))
  tileset.forEach((t) => parseTileset(t, newMap))

  validateTilesets(newMap)
  mapLayers(newMap)
  return newMap
}

const parseLayer = (layer, map) => {
  map.layerList.push({
    name: layer.name.toLowerCase(),
    visible: layer.visible != '0',
  })
  map.width = parseInt(layer.width)
  map.height = parseInt(layer.height)
  try {
    const b64Data = layer.data['#text']
    const strData = atob(b64Data)
    const charData = strData.split('').map((x) => x.charCodeAt(0))
    const binData = new Uint8Array(charData)
    const tmp = pako.inflate(binData)
    map.layers[layer.name.toLowerCase()] = new Uint32Array(tmp.buffer)
  } catch (err) {
    console.log(err)
  }
}

const parseTileset = (t, map) => {
  const tileset = {
    height: parseInt(t.image.height),
    width: parseInt(t.image.width),
    name: t.name,
    firstgid: parseInt(t.firstgid),
    tileheight: parseInt(t.tileheight),
    tilewidth: parseInt(t.tilewidth),
  }
  tileset.columns = parseInt(tileset.width / tileset.tilewidth)
  tileset.tilecount = parseInt((tileset.height / tileset.tileheight) * tileset.columns)

  map.tilesets.push(tileset)
}

const validateTilesets = (map) => {
  map.tilesets.forEach((t) => {
    const id = t.firstgid
    const tileset = map.tilesets.find((e) => id >= e.firstgid && id < e.firstgid + e.tilecount)
    if (tileset && tileset != t) {
      tileset.firstgid = -9999 // current game use last tileset, so we disable previous ones
    }
  })
}

const mapLayers = (map) => {
  map.field = []
  for (let y = 0; y < map.height; y++) {
    map.field[y] = []
    for (let x = 0; x < map.width; x++) {
      map.field[y][x] = {}
      map.layerList.forEach((e) => setTileByLayerXY(map, e.name, x, y))
    }
  }
}

const setTileByLayerXY = (map, layer, x, y) => {
  if (map.layers[layer]) {
    map.field[y][x][layer] = getTileById(map, layer, map.layers[layer][y * map.width + x])
  }
}

const getTileById = (map, layer, id) => {
  if (id == 0) return
  const tileset = map.tilesets.find((e) => id >= e.firstgid && id < e.firstgid + e.tilecount)
  return {
    id,
    tileset: tileset,
    localid: id - tileset?.firstgid,
  }
}
