import { Item } from '@/data'
import { useMemo, useState } from 'preact/hooks'

import { ItemIcon } from '@/components'
import DataGrid, { SortColumn } from 'react-data-grid'
import { CellExpanderFormatter } from './CellExpanderFormatter'

interface Row {
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

type Comparator = (a: Row, b: Row) => number

export const getComparator = (sortColumn: string): Comparator => {
  switch (sortColumn) {
    case 'name':
    case 'category':
      return (a, b) => {
        return a[sortColumn].localeCompare(b[sortColumn])
      }
    case 'attackCost':
    case 'attackChance':
    case 'blockChance':
    case 'criticalSkill':
    case 'criticalMultiplier':
    case 'maxHP':
    case 'maxAP':
    case 'moveCost':
    case 'useItemCost':
    case 'reEquipCost':
    case 'nonWeaponDamageModifier':
    case 'damageResistance':
    case 'price':
      return (a, b) => {
        if (a[sortColumn] && !b[sortColumn]) {
          return a[sortColumn]
        } else if (!a[sortColumn] && b[sortColumn]) {
          return b[sortColumn]
        } else if (!a[sortColumn] && b[sortColumn]) {
          return -1
        } else {
          return a[sortColumn] - b[sortColumn]
        }
      }
    case 'attackDamage':
      return (a, b) => {
        if (a[sortColumn]?.max && !b[sortColumn]?.max) {
          return a[sortColumn]?.max
        } else if (!a[sortColumn]?.max && b[sortColumn]?.max) {
          return b[sortColumn]?.max
        } else if (!a[sortColumn]?.max && !b[sortColumn]?.max) {
          return -99999
        } else {
          return a[sortColumn].max - b[sortColumn].max
        }
      }
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`)
  }
}

const numberRender = (value: any) => {
  return <span className="flex justify-end">{value}</span>
}

export const rowKeyGetter = (row: Row) => {
  return row.id
}

const columnWidth = 80

export const defaultColumns = [
  {
    key: 'expanded',
    name: '',
    minWidth: 30,
    width: 30,
    colSpan(args: any) {
      return args.type === 'ROW' && args.row.type === 'DETAIL' ? 3 : undefined
    },
    cellClass(row: any) {
      return row.type === 'DETAIL'
        ? `
            padding: 24px;
          `
        : undefined
    },
    renderCell({ row, tabIndex, onRowChange }: any) {
      if (row.type === 'DETAIL') {
        // return <ProductGrid parentId={row.parentId} direction={direction} />;
        return <></>
      }

      return (
        <CellExpanderFormatter
          expanded={row.expanded}
          tabIndex={tabIndex}
          onCellExpand={() => {
            onRowChange({ ...row, expanded: !row.expanded })
          }}
        />
      )
    },
  },
  {
    key: 'name',
    name: 'Name',
    width: 240,
    minWidth: 240,
    renderCell: (props: any) => {
      const value = props.row.name
      return (
        <div className="flex items-center space-x-3">
          <ItemIcon item={props.row} />
          <div>
            <span className="font-bold">{value}</span>
          </div>
        </div>
      )
    },
  },
  {
    key: 'attackCost',
    name: 'Atk Cost',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = props.row.attackCost
      return numberRender(value)
    },
  },
  {
    key: 'attackDamage',
    name: 'Atk Dmg',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const min = props.row.attackDamage?.min
      const max = props.row.attackDamage?.max
      if (min === undefined && max === undefined) {
        return undefined
      }
      if (min === max && min !== 0 && max !== 0) {
        return numberRender(min)
      }
      return numberRender(`${min}-${max}`)
    },
  },
  {
    key: 'attackChance',
    name: 'AC',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).attackChance
      return numberRender(value)
    },
  },
  {
    key: 'blockChance',
    name: 'BC',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).blockChance
      return numberRender(value)
    },
  },
  {
    key: 'criticalSkill',
    name: 'Crit',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).criticalSkill
      return numberRender(value)
    },
  },
  {
    key: 'criticalMultiplier',
    name: 'Crit *',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).criticalMultiplier
      return numberRender(value)
    },
  },
  {
    key: 'maxHP',
    name: 'Max HP',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).maxHP
      return numberRender(value)
    },
  },
  {
    key: 'maxAP',
    name: 'Max AP',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).maxAP
      return numberRender(value)
    },
  },
  {
    key: 'moveCost',
    name: 'Move Cost',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).moveCost
      return numberRender(value)
    },
  },
  {
    key: 'useItemCost',
    name: 'Use Cost',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).useItemCost
      return numberRender(value)
    },
  },
  {
    key: 'reEquipCost',
    name: 'Re-equip Cost',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).reEquipCost
      return numberRender(value)
    },
  },
  {
    key: 'nonWeaponDamageModifier',
    name: 'Dmg Mod',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).nonWeaponDamageModifier
      return numberRender(value)
    },
  },
  {
    key: 'damageResistance',
    name: 'Dmg Res',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).damageResistance
      return numberRender(value)
    },
  },
  {
    key: 'price',
    name: 'Price',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = (props.row as Row).price
      return numberRender(value)
    },
  },
  { key: 'category', name: 'Category', width: 200, minWidth: 200 },
]

interface Props {
  items: Item[] | undefined
  columns?: any
}

export const ItemsDataGrid = ({ items, columns = defaultColumns }: Props) => {
  if (!items) return <></>

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const rows: Row[] = useMemo(() => {
    return items.map((value) => {
      return {
        id: value.id,
        iconID: value.iconID,
        iconBg: value.iconBg,
        name: value.name,
        attackCost: value.equipEffect?.increaseAttackCost,
        attackDamage: value.equipEffect?.increaseAttackDamage,
        attackChance: value.equipEffect?.increaseAttackChance,
        blockChance: value.equipEffect?.increaseBlockChance,
        criticalSkill: value.equipEffect?.increaseCriticalSkill,
        criticalMultiplier: value.equipEffect?.setCriticalMultiplier,
        maxHP: value.equipEffect?.increaseMaxHP,
        maxAP: value.equipEffect?.increaseMaxAP,
        moveCost: value.equipEffect?.increaseMoveCost,
        useItemCost: value.equipEffect?.increaseUseItemCost,
        reEquipCost: value.equipEffect?.increaseReequipCost,
        nonWeaponDamageModifier: value.equipEffect?.setNonWeaponDamageModifier,
        damageResistance: value.equipEffect?.increaseDamageResistance,
        price: value.baseMarketCost,
        category: value.categoryLink.name,
        displaytype: value.displaytype,
        conditions: value.conditionsCount,
      } as Row
    })
  }, [items])

  const sortedRows = useMemo((): readonly Row[] => {
    if (sortColumns.length === 0) return rows

    return [...rows].sort((a, b) => {
      for (const sort of sortColumns) {
        const comparator = getComparator(sort.columnKey)
        const compResult = comparator(a, b)
        if (compResult !== 0) {
          return sort.direction === 'ASC' ? compResult : -compResult
        }
      }
      return 0
    })
  }, [rows, sortColumns])

  return (
    <DataGrid
      className="rdg-dark data-grid flex-1"
      columns={columns}
      rows={sortedRows}
      rowKeyGetter={rowKeyGetter}
      defaultColumnOptions={{
        sortable: true,
        resizable: true,
      }}
      sortColumns={sortColumns}
      onSortColumnsChange={setSortColumns}
      rowHeight={42}
    />
  )
}
