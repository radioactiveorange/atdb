import { ResponsiveList, ItemsDataGrid } from '@/components'
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
import { MobileItemCard } from '@/components'

// Sort options for items
const itemSortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Price', value: 'baseMarketCost' },
  { label: 'Category', value: 'categoryLink.name' },
  { label: 'HP Bonus', value: 'equipEffect.increaseMaxHP' },
  { label: 'AP Bonus', value: 'equipEffect.increaseMaxAP' },
  { label: 'Attack Damage', value: 'equipEffect.increaseAttackDamage' },
  { label: 'Attack Chance', value: 'equipEffect.increaseAttackChance' },
  { label: 'Block Chance', value: 'equipEffect.increaseBlockChance' },
]

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

  const getItemsForType = (type: string) => {
    switch (type) {
      case ItemType.armor: return armors
      case ItemType.weapon: return weapons
      case ItemType.shield: return shields
      case ItemType.helm: return helms
      case ItemType.gloves: return gloves
      case ItemType.boots: return boots
      case ItemType.ring: return rings
      case ItemType.necklace: return necklaces
      case ItemType.usable: return usables
      case ItemType.other: return others
      default: return []
    }
  }

  const items = getItemsForType(item || '')

  return (
    <ResponsiveList
      entities={items}
      entityName="items"
      sortOptions={itemSortOptions}
      searchFields={['name', 'categoryLink.name']}
      renderCard={(item) => (
        <MobileItemCard
          item={item}
          onClick={() => {/* Handle item click */}}
        />
      )}
      renderGrid={(items) => (
        <ItemsDataGrid items={items} />
      )}
    />
  )
}
