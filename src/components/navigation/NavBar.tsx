import { Link } from 'react-router-dom'
import { menuItems } from './menu-items'

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
  const activeClass = active ? 'dark:bg-sky-800' : ''
  const fisrtClass = first ? 'rounded-tl-lg' : ''
  const lastClass = last ? 'rounded-tr-lg' : ''

  return <li class={`py-1 dark:border-slate-500 ${activeClass} ${fisrtClass} ${lastClass}`}>{children}</li>
}

export const NavBar = ({ page }: Props) => {
  return (
    <nav class="mt-[2px] mr-[1px] border rounded-t-lg dark:border-slate-500">
      <ul className="grid grid-cols-7 divide-x">
        {menuItems.map(({ label, path, icon }, index) => {
          const active = page.includes(path)
          return (
            <Tab active={active} first={index === 0} last={index === menuItems.length - 1}>
              <Link to={`${path}`}>
                <div class="flex flex-col justify-center items-center">
                  {icon}
                  <span class="text-xs md:text-base">{label}</span>
                </div>
              </Link>
            </Tab>
          )
        })}
      </ul>
    </nav>
  )
}
