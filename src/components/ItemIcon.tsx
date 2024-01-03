import { Item } from '@/data'
import { useEffect, useState } from 'react'
import { serverURL } from '../lib'

type Props = {
  item: Item
}

// const custom: any = {
// 	monsters_demon1: { x: 64, y: 64 },
// 	monsters_demon2: { x: 64, y: 64 },
// 	monsters_hydra1: { x: 64, y: 64 },
// 	monsters_cyclops: { x: 64, y: 96 },
// 	monsters_bosses_2x2: { x: 64, y: 64 },
// 	monsters_giantbasilisk: { x: 64, y: 64 },
// };

// const getDimensionById = (id: string) => getDimension(id?.split(":")[0]);
// const getDimension = (file: any) => custom[file] || { x: 32, y: 32 };

const getSrc = (file: string) => {
  if (!file) return
  return `${serverURL}/drawable/${file}.png`
}

const getPosition = (index: number, width: number, d: { x: number; y: number }) => {
  const x = (index % width) * d.x
  const y = (index * d.y - x) / width
  return { x, y }
}

export const ItemIcon = ({ item }: Props) => {
  const [style1, setStyle1] = useState({})
  const [src, setSrc] = useState('')
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const tmp = item.iconID?.split(':')
    const file = tmp[0]
    const index = tmp[1]
    const src = getSrc(file)
    const image = document.createElement('img')
    image.onload = () => {
      const pos = getPosition(parseInt(index), image.naturalWidth / 32, {
        x: 32,
        y: 32,
      })
      setPosition(pos)
    }
    image.src = src as string
    setSrc(src as string)
  }, [item.iconID])

  useEffect(() => {
    if (item) {
      let style = {}
      if (item.iconBg !== 1) {
        style = {
          width: '32px',
          height: '32px',
          backgroundImage: `url('${serverURL}/drawable/ui_selections.png')`,
          backgroundPosition: `${item.iconBg * 32}px 0px`,
        }
      } else {
        style = {
          width: '32px',
          height: '32px',
        }
      }
      setStyle1(style)
    }
  }, [item])

  return (
    // <div style={{ width: 16, height: 16 }} className="flex">
    // 	<img
    // 		style={{ objectFit: "none", objectPosition: `${-position.x}px ${-position.y}px`, width: 32, height: 32 }}
    // 		src={src}></img>
    // </div>
    <div className="tooltip tooltip-right relative" data-tip={item.displaytype}>
      <div style={style1} />
      <div
        className="absolute left-0 top-0"
        style={{
          width: '32px',
          height: '32px',
          backgroundImage: `url('${src}')`,
          backgroundPosition: `${-position.x}px ${-position.y}px`,
        }}
      />
    </div>
  )
}
