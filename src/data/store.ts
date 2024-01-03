import { atom } from 'jotai'
import { selectAtom } from 'jotai/utils'
import { AndorsData, ItemType } from '.'

export const databaseAtom = atom<AndorsData | undefined>(undefined)
export const itemsAtom = selectAtom(databaseAtom, (db) => db?.items)
export const bodyAtom = selectAtom(
  itemsAtom,
  (items) => items?.filter((i) => i.categoryLink.inventorySlot === ItemType.armor)
)
export const weaponAtom = selectAtom(
  itemsAtom,
  (items) => items?.filter((i) => i.categoryLink.inventorySlot === ItemType.weapon)
)
export const shieldAtom = selectAtom(
  itemsAtom,
  (items) => items?.filter((i) => i.categoryLink.inventorySlot === ItemType.shield)
)
export const helmAtom = selectAtom(
  itemsAtom,
  (items) => items?.filter((i) => i.categoryLink.inventorySlot === ItemType.helm)
)
export const glovesAtom = selectAtom(
  itemsAtom,
  (items) => items?.filter((i) => i.categoryLink.inventorySlot === ItemType.gloves)
)
export const bootsAtom = selectAtom(
  itemsAtom,
  (items) => items?.filter((i) => i.categoryLink.inventorySlot === ItemType.boots)
)
export const ringAtom = selectAtom(
  itemsAtom,
  (items) => items?.filter((i) => i.categoryLink.inventorySlot === ItemType.ring)
)
export const necklaceAtom = selectAtom(
  itemsAtom,
  (items) => items?.filter((i) => i.categoryLink.inventorySlot === ItemType.necklace)
)
export const usableAtom = selectAtom(
  itemsAtom,
  (items) => items?.filter((i) => i.categoryLink.actionType === ItemType.usable)
)
export const otherAtom = selectAtom(itemsAtom, (items) => items?.filter((i) => !i.categoryLink.actionType))
