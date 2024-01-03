import { ItemIcon } from '@/components'
import { Item } from '@/data'
import { sort } from 'fast-sort'
import { useMemo, useState } from 'preact/hooks'
import { GiBroadsword, GiCheckedShield, GiTemplarShield, GiTwoCoins } from 'react-icons/gi'
import { GrAscend, GrDescend } from 'react-icons/gr'

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

const getBorderType = (type: number) => {
  switch (type) {
    case 1: // normal
      return 'border-neutral-700'
    case -3: // rare
      return 'border-purple-800'
    case -2: // extraordinary
      return 'border-emerald-200'
  }
}

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
    return Math.round(ad.min / ad.max)
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

export const ArmorCards = ({ items }: Props) => {
  const [sortCategory, setSortCategory] = useState('')
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
    <div className="flex flex-col overflow-auto flex-1 shadow-lg mt-2">
      <div class="sticky top-0 bg-base-100 z-[2] p-2 items-center flex justify-between">
        <div class="items-center flex">
          <select className="select select-bordered select-sm" placeholder="Sort" onChange={(e) => changeCategory(e)}>
            {sortCategories.map(({ label, value }) => (
              <option value={value}>{label}</option>
            ))}
          </select>
          <button class="btn btn-sm btn-outline ml-2" onClick={() => setSortType(sortType === 0 ? 1 : 0)}>
            {sortType === 0 ? <GrAscend /> : <GrDescend />}
          </button>
        </div>
        <div class="flex-1 grid grid-cols-4 max-w-36">
          <div className="tooltip tooltip-left" data-tip="Block Chance">
            <GiCheckedShield />
          </div>
          <div className="tooltip tooltip-left" data-tip="Attack Chance">
            <GiBroadsword />
          </div>
          <div className="tooltip tooltip-left" data-tip="Damage Resistance">
            <GiTemplarShield />
          </div>
          <div className="tooltip tooltip-left" data-tip="Price">
            <GiTwoCoins />
          </div>
        </div>
      </div>
      {sortedItems && sortedItems?.map((item) => <ArmorCard item={item} />)}
    </div>
  )
}

interface CardProps {
  item: Item
}

const minMaxRender = (min: number, max: number) => {
  if (min && max) {
    return <span>{`${min}-${max}`}</span>
  } else if (min && !max) {
    return <span>{`${min}`}</span>
  } else if (!min && max) {
    return <span>{`${max}`}</span>
  } else {
    return <></>
  }
}

const ArmorCard = ({ item }: CardProps) => {
  const [showDetails, setShowDetails] = useState(false)
  return (
    <>
      <div className={`mb-2 rounded-md p-2 bg-base-300`} role="button" onClick={() => setShowDetails(!showDetails)}>
        <div className="flex items-center space-x-2">
          <div class={`${getBorderType(item.iconBg)} border h-[32px] w-[32px] rounded-md`}>
            <ItemIcon item={item} />
          </div>
          <div className="flex justify-between flex-1">
            <div class="flex flex-col justify-start">
              <span className="text-sm font-bold">{item.name}</span>
              <span className="text-xs italic text-slate-600">{item.categoryLink.name}</span>
            </div>
            <div class="grid grid-cols-4 grid-flow-row gap-1">
              <span class="text-xs min-w-8">{item.equipEffect?.increaseBlockChance}</span>
              <span class="text-xs min-w-8">{item.equipEffect?.increaseAttackChance}</span>
              <span class="text-xs min-w-8">{item.equipEffect?.increaseDamageResistance}</span>
              <span class="text-xs min-w-8">{item.baseMarketCost}</span>
            </div>
          </div>
        </div>
        <div class={showDetails ? 'grid grid-cols-4 p-1 border rounded-md mt-2 border-neutral-600 text-xs' : 'hidden'}>
          <span>Attack cost:</span>
          <span>{item.equipEffect?.increaseAttackCost}</span>
          <span>Attack damage:</span>
          <span>
            {minMaxRender(item.equipEffect?.increaseAttackDamage?.min, item.equipEffect?.increaseAttackDamage?.max)}
          </span>
          <span>Attack chance:</span>
          <span>{item.equipEffect?.increaseAttackChance}</span>
        </div>
      </div>
    </>
  )
}
