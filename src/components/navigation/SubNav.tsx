import { useMemo } from 'preact/hooks'
import { Link } from 'react-router-dom'
import { menuItems } from './menu-items'

interface Props {
  page: string
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
    <div className="flex justify-center w-full">
      <div role="tablist" className="tabs tabs-boxed flex flex-wrap justify-center tabs-sm md:tabs-md w-full">
        {subMenuItems &&
          subMenuItems.map(({ path, label }) => (
            <Link role="tab" to={`${currentPage}/${path}`} className={`tab ${page.includes(path) ? 'tab-active' : ''}`}>
              {label}
            </Link>
          ))}
      </div>
    </div>
  )
}
