import { render } from 'preact'
import { RouterProvider } from 'react-router-dom'
import { LoadingScreen } from './components'
import './index.css'
import { router } from './router'

render(
  <RouterProvider 
    router={router} 
    fallbackElement={<LoadingScreen />}
  />, 
  document.getElementById('root')!
)
