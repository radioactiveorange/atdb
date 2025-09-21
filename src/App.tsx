import 'react-data-grid/lib/styles.css'
import { Outlet, useLocation } from 'react-router-dom'
import { DesktopNavBar, MobileNavBar, SubNav } from './components'

export const App = () => {
  const location = useLocation()

  return (
    <main className="flex flex-col min-h-screen">
      {/* Desktop Navigation */}
      <DesktopNavBar page={location.pathname} />
      
      {/* Sub Navigation (responsive) */}
      <SubNav page={location.pathname} />
      
      {/* Main Content with mobile bottom padding */}
      <div id="container" className="flex flex-col flex-1 pb-16 sm:pb-0">
        <Outlet />
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNavBar page={location.pathname} />
    </main>
  )
}
