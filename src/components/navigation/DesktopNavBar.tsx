import { Link } from 'react-router-dom'
import { menuItems } from './menu-items'
import { VersionInfo } from '../VersionInfo'

interface Props {
  page: string
}

interface TabProps {
  active: boolean
  first: boolean
  last: boolean
  children: any
}

const Tab = ({ active, first, last, children }: TabProps) => {
  const activeClass = active ? 'bg-blue-100 dark:bg-blue-800/50 text-blue-700 dark:text-blue-300' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
  const firstClass = first ? 'rounded-tl-lg' : ''
  const lastClass = last ? 'rounded-tr-lg' : ''

  return (
    <li className={`py-3 px-2 transition-colors border-r border-gray-200 dark:border-slate-600 last:border-r-0 ${activeClass} ${firstClass} ${lastClass}`}>
      {children}
    </li>
  )
}

export const DesktopNavBar = ({ page }: Props) => {
  return (
    <nav className="hidden sm:block mt-[2px] mr-[1px] border rounded-t-lg bg-white dark:bg-gray-800 dark:border-slate-500">
      <div className="flex items-center justify-between">
        <ul className="flex divide-x divide-gray-200 dark:divide-slate-600">
          {menuItems.map(({ label, path, icon, subMenu }, index) => {
            const active = page.includes(path)
            // If there's a submenu, link to the first subcategory, otherwise link to the main path
            const linkPath = subMenu && subMenu.length > 0 ? `/${path}/${subMenu[0].path}` : `/${path}`
            return (
              <Tab key={path} active={active} first={index === 0} last={false}>
                <Link to={linkPath} className="block">
                  <div className="flex flex-col justify-center items-center min-h-[44px] px-2">
                    <div className="text-xl mb-1">{icon}</div>
                    <span className="text-sm font-medium text-center leading-tight">{label}</span>
                  </div>
                </Link>
              </Tab>
            )
          })}
        </ul>

        {/* Version info on the right */}
        <div className="px-4 py-3">
          <VersionInfo />
        </div>
      </div>
    </nav>
  )
}