import { Link } from 'react-router-dom'
import { menuItems } from './menu-items'
import { useState } from 'preact/hooks'

interface MobileNavBarProps {
  page: string
}

export const MobileNavBar = ({ page }: MobileNavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Primary tabs for bottom navigation (most important items)
  const primaryTabs = [
    menuItems.find(item => item.path === 'items')!,
    menuItems.find(item => item.path === 'monsters')!, 
    menuItems.find(item => item.path === 'npc')!,
    menuItems.find(item => item.path === 'conditions')!
  ]

  // Secondary items for overflow menu
  const secondaryTabs = menuItems.filter(item => 
    !primaryTabs.some(primary => primary.path === item.path)
  )

  const TabButton = ({ item, isActive }: { item: typeof menuItems[0], isActive: boolean }) => {
    // If there's a submenu, link to the first subcategory, otherwise link to the main path
    const linkPath = item.subMenu && item.subMenu.length > 0 ? `/${item.path}/${item.subMenu[0].path}` : `/${item.path}`
    return (
      <Link 
        to={linkPath}
        className={`flex flex-col items-center justify-center min-h-[56px] px-2 py-1 transition-colors
          ${isActive 
            ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
      >
        <div className="text-xl mb-1">{item.icon}</div>
        <span className="text-xs font-medium leading-tight">{item.label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:hidden">
        <div className="grid grid-cols-5 divide-x divide-gray-200 dark:divide-gray-700">
          {/* Primary tabs */}
          {primaryTabs.map((item) => (
            <TabButton 
              key={item.path}
              item={item}
              isActive={page.includes(item.path)}
            />
          ))}
          
          {/* More menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex flex-col items-center justify-center min-h-[56px] px-2 py-1 transition-colors
              ${isMenuOpen || secondaryTabs.some(item => page.includes(item.path))
                ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
          >
            <div className="text-xl mb-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path d="M10 4a2 2 0 100-4 2 2 0 000 4z"/>
                <path d="M10 20a2 2 0 100-4 2 2 0 000 4z"/>
              </svg>
            </div>
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Overlay Menu */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="fixed bottom-16 left-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 sm:hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">More Options</h3>
              <div className="grid grid-cols-2 gap-3">
                {secondaryTabs.map((item) => {
                  // If there's a submenu, link to the first subcategory, otherwise link to the main path
                  const linkPath = item.subMenu && item.subMenu.length > 0 ? `/${item.path}/${item.subMenu[0].path}` : `/${item.path}`
                  return (
                    <Link
                      key={item.path}
                      to={linkPath}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center p-3 rounded-lg transition-colors
                        ${page.includes(item.path)
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                    >
                      <div className="text-xl mr-3">{item.icon}</div>
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}