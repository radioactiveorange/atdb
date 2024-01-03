import { render } from 'preact'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { router } from './router'

render(<RouterProvider router={router} />, document.getElementById('root')!)
