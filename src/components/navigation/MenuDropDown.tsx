import { useRef } from 'preact/hooks'
import { Link } from 'react-router-dom'
import { menuItems } from './menu-items'
interface Props {
  page: string
}

export const MenuDropDown = ({ page }: Props) => {
  const dropdownRef = useRef<HTMLDetailsElement>(null)

  const onClick = () => {
    dropdownRef.current?.removeAttribute('open')
  }

  return (
    <details className="dropdown" ref={dropdownRef}>
      <summary tabIndex={0} className="btn btn-ghost">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-6 h-6 stroke-current"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </summary>
      <ul className="p-2 shadow menu dropdown-content z-20 bg-base-200 rounded-box w-52">
        {menuItems.map(({ label, path, icon }) => {
          const active = page.includes(path) ? 'active' : ''
          return (
            <li>
              <Link to={`${path}`} className={active} onClick={onClick}>
                {icon}
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </details>
  )
}
