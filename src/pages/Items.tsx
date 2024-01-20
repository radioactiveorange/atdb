import { ArmorList, ItemsDataGrid } from '@/components'
import {
  ItemType,
  bodyAtom,
  bootsAtom,
  glovesAtom,
  helmAtom,
  necklaceAtom,
  otherAtom,
  ringAtom,
  shieldAtom,
  usableAtom,
  weaponAtom,
} from '@/data'
import { useAtomValue } from 'jotai'
import { useLocation } from 'react-router-dom'

export const Items = () => {
  const armors = useAtomValue(bodyAtom)
  const weapons = useAtomValue(weaponAtom)
  const shields = useAtomValue(shieldAtom)
  const helms = useAtomValue(helmAtom)
  const gloves = useAtomValue(glovesAtom)
  const boots = useAtomValue(bootsAtom)
  const rings = useAtomValue(ringAtom)
  const necklaces = useAtomValue(necklaceAtom)
  const usables = useAtomValue(usableAtom)
  const others = useAtomValue(otherAtom)

  const location = useLocation()

  const item = location.pathname.split('/').pop()

  switch (item) {
    case ItemType.armor:
      return <ArmorList items={armors} />
    case ItemType.weapon:
      return <ItemsDataGrid items={weapons} />
    case ItemType.shield:
      return <ItemsDataGrid items={shields} />
    case ItemType.helm:
      return <ItemsDataGrid items={helms} />
    case ItemType.gloves:
      return <ItemsDataGrid items={gloves} />
    case ItemType.boots:
      return <ItemsDataGrid items={boots} />
    case ItemType.ring:
      return <ItemsDataGrid items={rings} />
    case ItemType.necklace:
      return <ItemsDataGrid items={necklaces} />
    case ItemType.usable:
      return <ItemsDataGrid items={usables} />
    case ItemType.other:
      return <ItemsDataGrid items={others} />
    default:
      return <></>
  }
}
