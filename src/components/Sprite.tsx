import { useEffect, useState } from 'preact/hooks'
import { getSpriteIndex, getSpritePosition, getSpritesheet } from '../lib'

interface Props {
  iconID: string
  iconBg?: number
  displaytype?: string
  width?: number
  height?: number
}

export const Sprite = ({ iconID, iconBg = 1, displaytype, width = 32, height = 32 }: Props) => {
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [bgImage, setBGImage] = useState('')
  const [iconImage, setIconImage] = useState('')

  const bgStyle = {
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: `${iconBg * 32}px 0px`,
    backgroundRepeat: 'no-repeat',
    width,
    height,
  }

  const iconStyle = {
    backgroundImage: `url(${iconImage})`,
    backgroundPosition: `${x * -1}px ${y * -1}px`,
    backgroundRepeat: 'no-repeat',
    width,
    height,
  }

  const getMeta = async (url: string) => {
    const img = new Image()
    img.src = url
    await img.decode()
    return img
  }

  useEffect(() => {
    const filename = getSpritesheet(iconID)
    const index = getSpriteIndex(iconID)
    getMeta(filename).then((img): void => {
      const position = getSpritePosition(index, img.naturalWidth / width)
      setIconImage(filename)
      setX(position.x)
      setY(position.y)
    })
  }, [iconID])

  useEffect(() => {
    if (iconBg && iconBg !== 1) {
      const filename = getSpritesheet('ui_selections:0')
      setBGImage(filename)
    }
  }, [iconBg])

  return (
    <div class="relative">
      <div style={bgStyle} />
      <div style={iconStyle} class="absolute top-0 left-0" />
    </div>
  )
}
