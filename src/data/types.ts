export type AndorsData = {
  actorconditions: any[]
  container: any[]
  conversations: any[]
  droplists: any[]
  itemcategories: any[]
  items: Item[]
  maps: any[]
  monsters: any[]
  scripts: any[]
}

export type Item = {
  baseMarketCost: number
  category: string
  categoryLink: CategoryLink
  conditionsCount: number
  conv_links: any
  displaytype: string
  equipEffect: EquipEffect
  hitEffect?: HitEffect
  killEffect?: KillEffect
  hitReceivedEffect?: HitReceivedEffect
  useEffect?: UseEffect
  iconBg: number
  iconID: string
  id: string
  name: string
  rootLink: string
  droplists: any[]
}

type EquipEffect = {
  increaseAttackDamage: { min: number; max: number }
  increaseMaxHP: number
  increaseMaxAP: number
  increaseMoveCost: number
  increaseUseItemCost: number
  increaseReequipCost: number
  increaseAttackCost: number
  increaseAttackChance: number
  increaseBlockChance: number
  increaseMinDamage: number
  increaseMaxDamage: number
  setNonWeaponDamageModifier: number
  increaseCriticalSkill: number
  setCriticalMultiplier: number
  increaseDamageResistance: number
  addedConditions: ConditionLink[]
}

type HitEffect = {
  conditionsTarget: any
  conditionsSource: any
  increaseCurrentHP: any
}

type KillEffect = {
  conditionsSource: any
  increaseCurrentHP: any
  increaseCurrentAP: any
}

type HitReceivedEffect = {
  conditionsSource: any
  conditionsTarget: any
}

type UseEffect = {
  conditionsSource: any
}

export type CategoryLink = {
  actionType: string
  id: string
  inventorySlot: string
  name: string
  size: string
}

export type ConditionLink = {
  condition: string
  magnitude: number
  link: Condition
}

export type Condition = {
  abilityEffect: any
  category: string
  iconBg: number
  iconID: string
  id: string
  links: any
  name: string
  rootLink: string
}

export enum ItemType {
  armor = 'body',
  weapon = 'weapon',
  shield = 'shield',
  helm = 'head',
  gloves = 'hand',
  boots = 'feet',
  ring = 'leftring',
  necklace = 'neck',
  usable = 'use',
  other = 'other',
}

export interface ItemDetails {
  id: string
  name: string
  price: number
  attackCost: number
  attackDamage: { min: number; max: number }
  attackChance: number
  blockChance: number
  criticalSkill: number
  criticalMultiplier: number
  maxHP: number
  maxAP: number
  moveCost: number
  useItemCost: number
  reEquipCost: number
  nonWeaponDamageModifier: number
  damageResistance: number
  conditions: any
  category: string
  iconID: string
  iconBg: number
  displaytype: string
}
