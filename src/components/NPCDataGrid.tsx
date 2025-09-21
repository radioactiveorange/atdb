import { NPC } from '@/data'
import { useMemo, useState } from 'preact/hooks'
import { Sprite, ItemIcon } from '@/components'
import { DataGrid, SortColumn } from 'react-data-grid'
import { CellExpanderFormatter } from './CellExpanderFormatter'

interface Row {
  id: string
  name: string
  location: string
  conversations: number
  iconID: string
  merchantItems: number
}

type Comparator = (a: Row, b: Row) => number

export const getComparator = (sortColumn: string): Comparator => {
  switch (sortColumn) {
    case 'name':
    case 'location':
      return (a, b) => {
        return (a[sortColumn] || '').localeCompare(b[sortColumn] || '')
      }
    case 'conversations':
    case 'merchantItems':
      return (a, b) => {
        return (a[sortColumn] || 0) - (b[sortColumn] || 0)
      }
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`)
  }
}

const numberRender = (value: any) => {
  return <span className="flex justify-end">{value || ''}</span>
}

export const rowKeyGetter = (row: Row) => {
  return row.id
}

const columnWidth = 100

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
    width: 280,
    minWidth: 280,
    renderCell: (props: any) => {
      const value = props.row.name
      return (
        <div className="flex items-center space-x-3">
          <ItemIcon iconID={props.row.iconID} iconBg={1} />
          <div>
            <span className="font-bold">{value}</span>
          </div>
        </div>
      )
    },
  },
  {
    key: 'location',
    name: 'Locations',
    width: 200,
    minWidth: 200,
    renderCell: (props: any) => {
      const value = props.row.location
      return (
        <div className="text-sm">
          {value && (
            <a 
              href={`#${value}`}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
            >
              {value}
            </a>
          )}
        </div>
      )
    },
  },
  {
    key: 'conversations',
    name: 'Conversations',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = props.row.conversations
      return numberRender(value)
    },
  },
  {
    key: 'merchantItems',
    name: 'Items',
    width: columnWidth,
    minWidth: columnWidth,
    renderCell: (props: any) => {
      const value = props.row.merchantItems
      return numberRender(value)
    },
  },
]

interface Props {
  npcs: NPC[] | undefined
  columns?: any
}

export const NPCDataGrid = ({ npcs, columns = defaultColumns }: Props) => {
  if (!npcs) return <></>

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const rows: Row[] = useMemo(() => {
    return npcs.map((npc) => {
      return {
        id: npc.id || 'unknown',
        iconID: npc.iconID || 'npc_1:0',
        name: npc.name || npc.id || 'Unknown NPC',
        location: npc.location || '',
        conversations: npc.conversations?.length || 0,
        merchantItems: npc.merchantItems?.length || 0,
      } as Row
    })
  }, [npcs])

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
    <div className="flex-1 min-h-0">
      <DataGrid
        className="rdg-dark data-grid"
        style={{ height: '100%' }}
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
    </div>
  )
}