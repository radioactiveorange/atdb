import { Item } from '@/data'
import { useState } from 'preact/hooks'
import { GiTwoCoins } from 'react-icons/gi'
import { IoCaretDown, IoCaretForward } from 'react-icons/io5'
import { Sprite } from './Sprite'
interface CardProps {
  item: Item
}

const getBorderType = (type: number) => {
  switch (type) {
    case 1: // normal
      return 'border-slate-600 bg-slate-700'
    case -3: // rare
      return 'border-purple-700 bg-purple-950'
    case -2: // extraordinary
      return 'border-emerald-200 bg-emerald-950'
  }
}

const minMaxRender = (min: number, max: number) => {
  if (min && max) {
    return `${min}/${max}`
  } else if (min && !max) {
    return `${min}`
  } else if (!min && max) {
    return `${max}`
  } else {
    return ''
  }
}

export const ArmorCard = ({ item }: CardProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const bg = showDetails ? 'dark:bg-slate-800 border-4 dark:border-sky-600' : ''
  return (
    <div class={`p-2 dark:border-slate-600 cursor-pointer ${bg}`} onClick={() => setShowDetails(!showDetails)}>
      <div class="flex items-center space-x-2">
        <div class={`${getBorderType(item.iconBg)} border h-[34px] w-[34px] rounded-md`}>
          <Sprite iconID={item.iconID} iconBg={item.iconBg} displaytype={item.displaytype} />
        </div>
        <div className="flex-1 flex flex-col">
          <div class="flex justify-between">
            <span className="text-sm font-bold">{item.name}</span>
            <div class="flex flex-row items-center space-x-2">
              <span className="text-xs italic text-slate-500">{item.categoryLink.name}</span>
              <span className="text-xs italic text-slate-500">
                {showDetails ? <IoCaretDown /> : <IoCaretForward />}
              </span>
            </div>
          </div>
          {!showDetails && (
            <div class="grid grid-cols-6 grid-flow-row gap-1">
              <Stat icon="BC:" value={item.equipEffect?.increaseBlockChance} />
              <Stat icon="DR:" value={item.equipEffect?.increaseDamageResistance} />
              <Stat icon="HP:" value={item.equipEffect?.increaseMaxHP} />
              <Stat icon="AC:" value={item.equipEffect?.increaseAttackChance} />
              <Stat
                icon="AD:"
                value={minMaxRender(
                  item.equipEffect?.increaseAttackDamage?.min,
                  item.equipEffect?.increaseAttackDamage?.max
                )}
              />
              <Stat icon={<GiTwoCoins />} value={item.baseMarketCost} />
            </div>
          )}
        </div>
      </div>
      <ItemDetails show={showDetails} item={item} />
    </div>
  )
}

const Stat = ({ icon, value }: any) => {
  if (!value) return <span class="text-xs text-slate-500"></span>
  return (
    <span class="min-w-8 flex justify-start items-center gap-1">
      <div class="text-xs text-slate-500">{icon}</div>
      <div class="text-sm">{value}</div>
    </span>
  )
}

interface ItemDetailsProps {
  show: boolean
  item: Item
}

const ItemDetails = ({ show, item }: ItemDetailsProps) => {
  if (!show) return <></>

  return (
    <div class="border p-1 rounded-md mt-1 border-slate-600 text-xs flex flex-col">
      <div class="grid grid-cols-2">
        <div class="flex flex-col">
          <Details label="Block chance:" value={item.equipEffect?.increaseBlockChance} />
          <Details label="Dmg resistance:" value={item.equipEffect?.increaseDamageResistance} />
          <Details label="Max HP:" value={item.equipEffect?.increaseMaxHP} />
          <Details label="Crit:" value={item.equipEffect?.increaseCriticalSkill} />
          <Details label="Crit multiplier:" value={item.equipEffect?.setCriticalMultiplier} />
          <Details label="Attack cost:" value={item.equipEffect?.increaseAttackCost} />
          <Details
            label="Attack dmg:"
            value={minMaxRender(
              item.equipEffect?.increaseAttackDamage?.min,
              item.equipEffect?.increaseAttackDamage?.max
            )}
          />
          <Details label="Attack chance:" value={item.equipEffect?.increaseAttackChance} />
          <Details label="Move cost:" value={item.equipEffect?.increaseMoveCost} />
          <Details label="Use cost:" value={item.equipEffect?.increaseUseItemCost} />
          <Details label="Max AP:" value={item.equipEffect?.increaseMaxAP} />
        </div>
        <div>
          <div class="text-xs text-slate-500 w-24">Conditions</div>
          {item.equipEffect?.addedConditions?.map((value) => {
            return (
              <div>
                <Sprite iconID={value.link.iconID} iconBg={value.link.iconBg} width={32} height={32} />
                <span>
                  {value.link.name}
                  {value.magnitude}
                </span>
              </div>
            )
          })}
        </div>
      </div>
      <hr class="my-1 border-slate-600" />
    </div>
  )
}

const Details = ({ label, value }: any) => {
  if (!value) return <></>
  return (
    <span class="flex">
      <div class="text-xs text-slate-500 w-24">{label}</div>
      <div class="text-sm w-20 flex justify-end">{value}</div>
    </span>
  )
}
