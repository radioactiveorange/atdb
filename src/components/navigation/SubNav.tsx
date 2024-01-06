import { useMemo } from 'preact/hooks'
import { Link } from 'react-router-dom'
import { menuItems } from './menu-items'

interface Props {
  page: string
}

interface TabProps {
  active: boolean
  children: any
}

const Tab = ({ active, children }: TabProps) => {
  return <li class={`p-2 dark:border-slate-600 ${active ? 'dark:bg-cyan-600 dark:text-slate-950' : ''}`}>{children}</li>
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

  if (!subMenuItems || subMenuItems.length === 0) return <></>

  return (
    <div class="border border-x-0 dark:border-slate-600">
      <ul className="overflow-x-auto grid grid-flow-col divide-x">
        {subMenuItems.map(({ path, label }) => {
          const active = page.includes(path)
          return (
            <Tab active={active}>
              <Link to={`${currentPage}/${path}`}>
                <div class="flex flex-col justify-center items-center">
                  <span class="text-xs sm:font-bold sm:text-base">{label}</span>
                </div>
              </Link>
            </Tab>
          )
        })}
      </ul>
    </div>
  )
}
