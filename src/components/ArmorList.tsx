import { Item } from '@/data'
import { sort } from 'fast-sort'
import { useMemo, useState } from 'preact/hooks'
import { GrAscend, GrDescend } from 'react-icons/gr'
import { ArmorCard } from './ArmorCard'

interface Props {
  items?: Item[]
}

const sortCategories = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Price',
    value: 'price',
  },
  {
    label: 'Rarity',
    value: 'rarity',
  },
  {
    label: 'Type',
    value: 'category',
  },
  {
    label: 'Attack Chance',
    value: 'attackChance',
  },
  {
    label: 'Attack Cost',
    value: 'attackCost',
  },
  {
    label: 'Attack Damage',
    value: 'attackDamage',
  },
  {
    label: 'Block Chance',
    value: 'blockChance',
  },
  {
    label: 'Crit',
    value: 'crit',
  },
  {
    label: 'Crit Multiplier',
    value: 'critMulti',
  },
  {
    label: 'Max HP',
    value: 'maxHP',
  },
  {
    label: 'Max AP',
    value: 'maxAP',
  },
  {
    label: 'Move Cost',
    value: 'moveCost',
  },
  {
    label: 'Use Cost',
    value: 'useCost',
  },
  {
    label: 'Re-equip Cost',
    value: 'reequipCost',
  },
  {
    label: 'Damage Modifier',
    value: 'damageMod',
  },
  {
    label: 'Damage Resistance',
    value: 'damageResist',
  },
]

const getRarity = (rarity: number) => {
  switch (rarity) {
    case 1: // normal
      return 0
    case -3: // rare
      return 1
    case -2: // extraordinary
      return 2
  }
}

const getAverage = (ad = { min: 0, max: 0 }) => {
  if (ad.min && ad.max) {
    const sum = ad.min + ad.max
    const average = Math.round(sum / 2)
    return average
  } else {
    return 0
  }
}

const getSortBy = (item: Item, category: string) => {
  switch (category) {
    case 'name':
      return item.name
    case 'price':
      return item.baseMarketCost
    case 'rarity':
      return getRarity(item.iconBg)
    case 'category':
      return item.categoryLink.name
    case 'attackCost':
      return item.equipEffect?.increaseAttackCost
    case 'attackChance':
      return item.equipEffect?.increaseAttackChance
    case 'attackDamage':
      return getAverage(item.equipEffect?.increaseAttackDamage)
    case 'blockChance':
      return item.equipEffect?.increaseBlockChance
    case 'crit':
      return item.equipEffect?.increaseCriticalSkill
    case 'critMulti':
      return item.equipEffect?.setCriticalMultiplier
    case 'maxHP':
      return item.equipEffect?.increaseMaxHP
    case 'maxAP':
      return item.equipEffect?.increaseMaxAP
    case 'moveCost':
      return item.equipEffect?.increaseMoveCost
    case 'useCost':
      return item.equipEffect?.increaseUseItemCost
    case 'reequipCost':
      return item.equipEffect?.increaseReequipCost
    case 'damageMod':
      return item.equipEffect?.setNonWeaponDamageModifier
    case 'damageResist':
      return item.equipEffect?.increaseDamageResistance
  }
}

export const ArmorList = ({ items }: Props) => {
  const [sortCategory, setSortCategory] = useState('name')
  const [sortType, setSortType] = useState(0)

  const changeCategory = (e: any) => {
    setSortCategory(e.currentTarget.value)
  }

  const sortedItems = useMemo(() => {
    if (items && items.length > 0) {
      let sorted = []
      if (sortType === 0) {
        sorted = sort(items).asc((u) => getSortBy(u, sortCategory))
      } else {
        sorted = sort(items).desc((u) => getSortBy(u, sortCategory))
      }
      return sorted
    }
  }, [sortType, sortCategory, items])

  return (
    <div className="flex flex-col overflow-auto flex-1 text-sm divide-y ">
      <div class="sticky top-0 dark:bg-slate-700 z-[2] grid grid-flow-col gap-2 p-1 shadow-lg">
        <input type="search" placeholder="Search" class="rounded-sm h-8 px-2 dark:bg-slate-600" />
        <select placeholder="Sort" onChange={(e) => changeCategory(e)} class="p-1 rounded-sm dark:bg-slate-600">
          {sortCategories.map(({ label, value }) => (
            <option value={value}>{label}</option>
          ))}
        </select>
        <button
          class="rounded-sm border p-1 w-8 h-8 flex items-center justify-center dark:border-slate-600"
          onClick={() => setSortType(sortType === 0 ? 1 : 0)}
        >
          {sortType === 0 ? <GrAscend /> : <GrDescend />}
        </button>
      </div>
      {sortedItems && sortedItems?.map((item) => <ArmorCard item={item} />)}
    </div>
  )
}
