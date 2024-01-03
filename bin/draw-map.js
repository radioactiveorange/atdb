import fs from 'fs-extra'
import { createCanvas, loadImage } from 'canvas'

const { ensureFile, writeFile } = fs

const ZOOM = 32
const ZOOM_OUT = 12

let counter = 0
let counterSize = 0

const saveCanvas = async (canvas, fileName) => {
  counter++
  console.log(`[${counter}/${counterSize}] ${fileName}`)
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.8 })
  ensureFile('./public/backgrounds/' + fileName + '.jpg')
  writeFile('./public/backgrounds/' + fileName + '.jpg', buffer)
}

const drawCell = async (context, x, y, cell, layerList, mapName, thenDo) => {
  layerList.forEach((e) => drawCellLayer(context, x, y, cell[e.name], mapName, thenDo))
}

function drawCellLayer(context, x, y, cell, mapName, thenDo) {
  if (!cell) return thenDo()

  const tileset = cell.tileset

  if (!tileset) {
    console.log(mapName)
    throw new Error()
  }

  if (tileset) {
    const imagePath = `./public/drawable/${tileset.name}.png`
    loadImage(imagePath).then((image) => {
      const dx = cell.localid % tileset.columns
      const dy = Math.floor(cell.localid / tileset.columns)

      context.drawImage(image, dx * ZOOM, dy * ZOOM, ZOOM, ZOOM, x * ZOOM_OUT, y * ZOOM_OUT, ZOOM_OUT, ZOOM_OUT)
      thenDo()
    })
  }
}

export const drawMap = async (fileName, map, size) => {
  counterSize = size
  const width = map.width * ZOOM_OUT
  const height = map.height * ZOOM_OUT

  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')

  let layerList = [...map.layerList.filter((e) => validLayerName(e.name))]

  let downcounter = { progress: map.width * map.height * layerList.length }
  const thenDo = async () => {
    downcounter.progress--
    if (downcounter.progress == 0) {
      await saveCanvas(canvas, fileName)
    }
  }

  const promises = []

  for (let x = 0; x < map.width; x++) {
    for (let y = 0; y < map.height; y++) {
      const cell = map.field[y][x]
      promises.push()
      drawCell(context, x, y, cell, layerList, map.name, thenDo)
    }
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
