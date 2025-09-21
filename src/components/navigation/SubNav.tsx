import { useMemo } from 'preact/hooks'
import { Link } from 'react-router-dom'
import { menuItems } from './menu-items'
import { VersionInfo } from '../VersionInfo'

interface Props {
  page: string
}

interface TabProps {
  active: boolean
  children: any
}

const Tab = ({ active, children }: TabProps) => {
  return (
    <li className={`min-h-[44px] transition-colors whitespace-nowrap
      ${active 
        ? 'bg-cyan-100 dark:bg-cyan-800/50 text-cyan-700 dark:text-cyan-300 border-b-2 border-cyan-500' 
        : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
      }`}>
      {children}
    </li>
  )
}

export const SubNav = ({ page }: Props) => {
  const currentPage = page.split('/')[1]

  const subMenuItems = useMemo(() => {
    const menu = menuItems.filter((m) => m.path === currentPage)[0]
    if (menu) {
      const { subMenu } = menu
      return subMenu
    }
    return []
  }, [currentPage])

  if (!subMenuItems || subMenuItems.length === 0) {
    // Show version info on mobile when there's no sub-navigation
    return (
      <div className="border-b border-gray-200 dark:border-slate-600 bg-white dark:bg-gray-800 sticky top-0 z-30 sm:hidden">
        <div className="flex justify-end px-4 py-3">
          <VersionInfo />
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-gray-200 dark:border-slate-600 bg-white dark:bg-gray-800 sticky top-0 z-30 sm:relative sm:z-auto">
      <div className="overflow-x-auto sm:scrollbar-hide">
        <div className="flex justify-between items-center">
          <ul className="flex">
            {subMenuItems.map(({ path, label }) => {
              const active = page.includes(path)
              return (
                <Tab key={path} active={active}>
                  <Link to={`${currentPage}/${path}`} className="block w-full h-full px-4 py-2">
                    <div className="flex justify-center items-center h-full">
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  </Link>
                </Tab>
              )
            })}
          </ul>

          {/* Version info on mobile when there is sub-navigation */}
          <div className="px-4 py-3 sm:hidden">
            <VersionInfo />
          </div>
        </div>
      </div>
    </div>
  )
}
