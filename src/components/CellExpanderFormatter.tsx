import { IoCaretDown, IoCaretForward } from 'react-icons/io5'

interface CellExpanderFormatterProps {
  tabIndex: number
  expanded: boolean
  onCellExpand: () => void
}

export const CellExpanderFormatter = ({ tabIndex, expanded, onCellExpand }: CellExpanderFormatterProps) => {
  function handleKeyDown(e: any) {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onCellExpand()
    }
  }

  return (
    <div className="flex justify-center items-center h-full">
      <span onClick={onCellExpand} onKeyDown={handleKeyDown}>
        <span tabIndex={tabIndex}>{expanded ? <IoCaretDown /> : <IoCaretForward />}</span>
      </span>
    </div>
  )
}
