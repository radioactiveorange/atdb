import { serverURL } from '.'

export const getSpritesheet = (value: string): string => {
  const imageName = value.split(':')[0]
  return `${serverURL}/drawable/${imageName}.png`
}

export const getSpriteIndex = (value: string): number => {
  const index = value.split(':')[1]
  return parseInt(index)
}

type Position = {
  x: number
  y: number
}

export const getSpritePosition = (index: number, width: number, tileSize: number = 32): Position => {
  const x = (index % width) * tileSize
  const y = (index * tileSize - x) / width
  return { x, y }
  // const xTiles = Math.floor(w / tileSize)
  // const xIndex = index % xTiles
  // const x = xIndex * tileSize

  // const yIndex = index % w
  // const y = Math.floor(Math.abs(index - yIndex * tileSize) / w) * tileSize
  // return {
  //   x: x,
  //   y: y,
  // }
}

// const getSpritePosition = (index: number, width: number, d: { x: number; y: number }) => {
//   const x = (index % width) * d.x
//   const y = (index * d.y - x) / width
//   return { x, y }
// }
