import {
  GiBlackBook,
  GiCharacter,
  GiFishMonster,
  GiHeartBeats,
  GiPerspectiveDiceSixFacesOne,
  GiPiercingSword,
  GiScrollUnfurled,
} from 'react-icons/gi'

export const menuItems = [
  {
    label: 'Items',
    path: 'items',
    icon: <GiPiercingSword />,
    subMenu: [
      {
        label: 'Armor',
        path: 'body',
      },
      {
        label: 'Weapon',
        path: 'weapon',
      },
      {
        label: 'Shield',
        path: 'shield',
      },
      {
        label: 'Helm',
        path: 'head',
      },
      {
        label: 'Gloves',
        path: 'hand',
      },
      {
        label: 'Boots',
        path: 'feet',
      },
      {
        label: 'Ring',
        path: 'leftring',
      },
      {
        label: 'Necklace',
        path: 'neck',
      },
      {
        label: 'Usable',
        path: 'use',
      },
      {
        label: 'Other',
        path: 'other',
      },
    ],
  },
  {
    label: 'Monsters',
    path: 'monsters',
    icon: <GiFishMonster />,
    subMenu: [
      {
        label: 'Animal',
        path: 'animal',
      },
      {
        label: 'Insect',
        path: 'insect',
      },
      {
        label: 'Reptile',
        path: 'reptile',
      },
      {
        label: 'Undead',
        path: 'undead',
      },
      {
        label: 'Giant',
        path: 'giant',
      },
      {
        label: 'Ghost',
        path: 'ghost',
      },
      {
        label: 'Construct',
        path: 'construct',
      },
      {
        label: 'Humanoid',
        path: 'humanoid',
      },
      {
        label: 'Demon',
        path: 'demon',
      },
      {
        label: 'Other',
        path: 'other',
      },
    ],
  },
  {
    label: 'NPC',
    path: 'npc',
    icon: <GiCharacter />,
    subMenu: [
      {
        label: 'Merchant',
        path: 'merchant',
      },
      {
        label: 'A-G',
        path: 'a-g',
      },
      {
        label: 'H-R',
        path: 'h-r',
      },
      {
        label: 'S-Z',
        path: 's-z',
      },
    ],
  },
  {
    label: 'Conditions',
    path: 'conditions',
    icon: <GiHeartBeats />,
    subMenu: [
      {
        label: 'Positive',
        path: 'positive',
      },
      {
        label: 'Negative',
        path: 'negative',
      },
    ],
  },
  {
    label: 'Quests',
    icon: <GiBlackBook />,
    path: 'quests',
  },
  {
    label: 'Categories',
    icon: <GiPerspectiveDiceSixFacesOne />,
    path: 'categories',
  },
  {
    label: 'Map',
    icon: <GiScrollUnfurled />,
    path: 'map',
  },
]
