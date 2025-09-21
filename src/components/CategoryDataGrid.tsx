import { useMemo, useState } from 'preact/hooks'
import { DataGrid, SortColumn } from 'react-data-grid'

interface Category {
  id: string
  name?: string
  size?: string
  inventorySlot?: string
  actionType?: string
  [key: string]: any
}

interface Row {
  id: string
  name: string
  size: string
  inventorySlot: string
  actionType: string
}

type Comparator = (a: Row, b: Row) => number

export const getComparator = (sortColumn: string): Comparator => {
  switch (sortColumn) {
    case 'name':
    case 'size':
    case 'inventorySlot':
    case 'actionType':
      return (a, b) => {
        return (a[sortColumn] || '').localeCompare(b[sortColumn] || '')
      }
    default:
      throw new Error(`unsupported sortColumn: "${sortColumn}"`)
  }
}

export const rowKeyGetter = (row: Row) => {
  return row.id
}

const columns = [
  {
    key: 'name',
    name: 'name',
    width: 200,
    minWidth: 150,
    renderCell: (props: any) => {
      const value = props.row.name
      return (
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {value}
        </div>
      )
    },
  },
  {
    key: 'id',
    name: 'id',
    width: 150,
    minWidth: 100,
    renderCell: (props: any) => {
      const value = props.row.id
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {value}
        </div>
      )
    },
  },
  {
    key: 'size',
    name: 'size',
    width: 100,
    minWidth: 80,
    renderCell: (props: any) => {
      const value = props.row.size
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {value || '-'}
        </div>
      )
    },
  },
  {
    key: 'inventorySlot',
    name: 'inventorySlot',
    width: 150,
    minWidth: 120,
    renderCell: (props: any) => {
      const value = props.row.inventorySlot
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {value || '-'}
        </div>
      )
    },
  },
  {
    key: 'actionType',
    name: 'actionType',
    width: 120,
    minWidth: 100,
    renderCell: (props: any) => {
      const value = props.row.actionType
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {value || '-'}
        </div>
      )
    },
  },
]

interface Props {
  categories: Category[] | undefined
}

export const CategoryDataGrid = ({ categories }: Props) => {
  if (!categories) return <></>

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  
  const rows: Row[] = useMemo(() => {
    return categories.map((category) => ({
      id: category.id || 'unknown',
      name: category.name || category.id || 'Unknown Category',
      size: category.size || '',
      inventorySlot: category.inventorySlot || '',
      actionType: category.actionType || '',
    }))
  }, [categories])

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