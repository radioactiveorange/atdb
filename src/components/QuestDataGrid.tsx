import { useMemo, useState } from 'preact/hooks'
import { DataGrid, SortColumn } from 'react-data-grid'
import { CellExpanderFormatter } from './CellExpanderFormatter'

interface Quest {
  id: string
  name?: string
  logText?: string
  rewardText?: string
  [key: string]: any
}

interface Row {
  id: string
  name: string
  logText: string
  rewardText: string
  stages?: QuestStage[]
  expanded?: boolean
  type?: string
}

interface QuestStage {
  progress: number
  logText: string
  rewardExperience?: number
  finishesQuest?: number
}

type Comparator = (a: Row, b: Row) => number

export const getComparator = (sortColumn: string): Comparator => {
  switch (sortColumn) {
    case 'name':
    case 'logText':
    case 'rewardText':
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

const defaultColumns = [
  {
    key: 'name',
    name: 'Quest Name',
    width: 280,
    minWidth: 280,
    renderCell: (props: any) => {
      const value = props.row.name
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-800 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-purple-600 dark:text-purple-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
          <div>
            <span className="font-bold">{value}</span>
          </div>
        </div>
      )
    },
  },
  {
    key: 'logText',
    name: 'Description',
    width: 350,
    minWidth: 200,
    renderCell: (props: any) => {
      const value = props.row.logText
      return (
        <div className="text-sm text-gray-600 dark:text-gray-400 truncate" title={value}>
          {value}
        </div>
      )
    },
  },
  {
    key: 'rewardText',
    name: 'Reward',
    width: 250,
    minWidth: 150,
    renderCell: (props: any) => {
      const value = props.row.rewardText
      return value ? (
        <div className="text-sm">
          <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded text-xs">
            {value}
          </span>
        </div>
      ) : null
    },
  },
]

interface Props {
  quests: Quest[] | undefined
  columns?: any
}

export const QuestDataGrid = ({ quests, columns }: Props) => {
  if (!quests) return <></>

  const [sortColumns, setSortColumns] = useState<readonly SortColumn[]>([])
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  
  const rows: Row[] = useMemo(() => {
    return quests.flatMap((quest) => {
      // Handle both complex and simple quest structures
      const hasStages = quest.stages && quest.stages.length > 0
      const questText = hasStages ? quest.stages[0]?.logText : quest.logText
      const totalXPReward = hasStages 
        ? quest.stages.filter(stage => stage.finishesQuest).reduce((sum, stage) => sum + (stage.rewardExperience || 0), 0)
        : 0
      
      const isExpanded = expandedRows.has(quest.id || '')
      
      const mainRow: Row = {
        id: quest.id || 'unknown',
        name: quest.name || quest.id || 'Unknown Quest',
        logText: questText || '',
        rewardText: totalXPReward > 0 ? `${totalXPReward} XP` : quest.rewardText || '',
        stages: quest.stages,
        expanded: isExpanded,
      }

      // For quests with stages, add detail row when expanded
      const detailRows: Row[] = []
      if (isExpanded && hasStages) {
        detailRows.push({
          id: `${quest.id}-detail`,
          name: '',
          logText: '',
          rewardText: '',
          type: 'DETAIL',
          parentId: quest.id,
        } as Row & { type: string; parentId: string })
      }

      return [mainRow, ...detailRows]
    })
  }, [quests, expandedRows])

  const handleRowChange = (row: Row) => {
    const newExpandedRows = new Set(expandedRows)
    if (expandedRows.has(row.id)) {
      newExpandedRows.delete(row.id)
    } else {
      newExpandedRows.add(row.id)
    }
    setExpandedRows(newExpandedRows)
  }

  const questColumns = columns || [
    {
      key: 'expanded',
      name: '',
      minWidth: 30,
      width: 30,
      colSpan(args: any) {
        return args.type === 'ROW' && args.row.type === 'DETAIL' ? 4 : undefined
      },
      cellClass(row: any) {
        return row.type === 'DETAIL'
          ? `padding: 24px;`
          : undefined
      },
      renderCell({ row, tabIndex }: any) {
        if (row.type === 'DETAIL') {
          // Find the parent quest to get stages
          const parentQuest = quests?.find(q => q.id === row.parentId)
          return (
            <div className="p-4 space-y-3">
              <h5 className="font-medium text-gray-900 dark:text-white mb-3">Quest Stages:</h5>
              {parentQuest?.stages?.map((stage: any, index: number) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Progress: {stage.progress}%
                    </span>
                    <div className="flex items-center space-x-2">
                      {stage.rewardExperience && (
                        <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded">
                          +{stage.rewardExperience} XP
                        </span>
                      )}
                      {stage.finishesQuest && (
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded font-medium">
                          Complete
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {stage.logText}
                  </p>
                </div>
              ))}
            </div>
          )
        }

        // Only show expander for quests with stages
        if (!row.stages || row.stages.length <= 1) {
          return null
        }

        return (
          <CellExpanderFormatter
            expanded={row.expanded}
            tabIndex={tabIndex}
            onCellExpand={() => {
              handleRowChange(row)
            }}
          />
        )
      },
    },
    ...defaultColumns.slice(1) // Take all columns except the first one (expanded)
  ]

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
        columns={questColumns}
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