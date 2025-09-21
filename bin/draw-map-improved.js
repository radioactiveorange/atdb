import fs from 'fs-extra'
import { createCanvas, loadImage } from 'canvas'

const { ensureFile, writeFile } = fs

const ZOOM = 32
const ZOOM_OUT = 12

let counter = 0
let counterSize = 0

// Image cache with size limit to prevent memory bloat
const imageCache = new Map()
const MAX_CACHE_SIZE = 50

const clearImageCache = () => {
  if (imageCache.size > MAX_CACHE_SIZE) {
    const entries = Array.from(imageCache.entries())
    // Remove oldest 25% of entries
    const toRemove = Math.floor(entries.length * 0.25)
    for (let i = 0; i < toRemove; i++) {
      imageCache.delete(entries[i][0])
    }
  }
}

const loadImageCached = async (imagePath) => {
  if (imageCache.has(imagePath)) {
    return imageCache.get(imagePath)
  }
  
  try {
    const image = await loadImage(imagePath)
    imageCache.set(imagePath, image)
    clearImageCache()
    return image
  } catch (error) {
    console.warn(`Failed to load image: ${imagePath}`)
    return null
  }
}

const saveCanvas = async (canvas, fileName) => {
  try {
    counter++
    console.log(`[${counter}/${counterSize}] ${fileName}`)
    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 })
    await ensureFile('./public/backgrounds/' + fileName + '.jpg')
    await writeFile('./public/backgrounds/' + fileName + '.jpg', buffer)
    
    // Force garbage collection hint
    if (global.gc && counter % 10 === 0) {
      global.gc()
    }
  } catch (error) {
    console.error(`Failed to save ${fileName}:`, error.message)
  }
}

const drawCellLayer = async (context, x, y, cell, mapName) => {
  if (!cell || !cell.tileset) return

  const tileset = cell.tileset
  const imagePath = `./public/drawable/${tileset.name}.png`
  
  try {
    const image = await loadImageCached(imagePath)
    if (!image) return

    const dx = cell.localid % tileset.columns
    const dy = Math.floor(cell.localid / tileset.columns)

    context.drawImage(
      image, 
      dx * ZOOM, dy * ZOOM, ZOOM, ZOOM,
      x * ZOOM_OUT, y * ZOOM_OUT, ZOOM_OUT, ZOOM_OUT
    )
  } catch (error) {
    console.warn(`Error drawing cell in ${mapName}:`, error.message)
  }
}

export const drawMap = async (fileName, map, size) => {
  try {
    counterSize = size
    const width = map.width * ZOOM_OUT
    const height = map.height * ZOOM_OUT

    const canvas = createCanvas(width, height)
    const context = canvas.getContext('2d')

    const layerList = map.layerList.filter((e) => validLayerName(e.name))

    // Draw sequentially to avoid memory issues
    for (const layer of layerList) {
      for (let y = 0; y < map.height; y++) {
        for (let x = 0; x < map.width; x++) {
          const cell = map.field[y][x]
          if (cell && cell[layer.name]) {
            await drawCellLayer(context, x, y, cell[layer.name], map.name)
          }
        }
      }
    }

    await saveCanvas(canvas, fileName)
    
    // Clear references to help GC
    context.clearRect(0, 0, width, height)
    
  } catch (error) {
    console.error(`Failed to draw map ${fileName}:`, error.message)
  }
}

const validLayerName = (name) => {
  switch (name) {
    case 'base':
    case 'ground':
    case 'objects':
    case 'objects_1':
    case 'above':
    case 'top':
      return true
    default:
      return false
  }
}