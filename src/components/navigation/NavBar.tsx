import { Link } from 'react-router-dom'
import { menuItems } from './menu-items'

interface Props {
  page: string
}

export const NavBar = ({ page }: Props) => {
  return (
    <div className="flex justify-center w-full">
      <div role="tablist" className="tabs tabs-boxed sm:tabs-lg flex flex-wrap justify-center w-full">
        {menuItems.map(({ label, path, icon }) => {
          const active = page.includes(path) ? 'tab-active' : ''
          return (
            <Link to={`${path}`} role="tab" className={`tab ${active}`}>
              <div class="flex flex-col justify-center items-center">
                {icon}
                <span class="text-xs md:text-base">{label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
