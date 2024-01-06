import 'react-data-grid/lib/styles.css'
import { Outlet, useLocation } from 'react-router-dom'
import { NavBar, SubNav } from './components'

export const App = () => {
  const location = useLocation()

  return (
    <main className="flex flex-col ">
      <NavBar page={location.pathname} />
      <SubNav page={location.pathname} />
      <div id="container" className="flex flex-col">
        <Outlet />
      </div>
    </main>
  )
}
