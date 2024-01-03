import { ErrorPage } from '@/components'
import { databaseAtom } from '@/data'
import { load } from '@/lib'
import { getDefaultStore } from 'jotai'
import { createHashRouter } from 'react-router-dom'
import { App } from './App'
import { Categories, Conditions, Items, Map, Monsters, NPC, Quests } from './pages'

const defaultStore = getDefaultStore()

export const router = createHashRouter([
  {
    path: '/',
    element: <App />,
    loader: async () => {
      const db = await load()
      defaultStore.set(databaseAtom, { ...db })
      return true
    },
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'items/*',
        element: <Items />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'monsters/*',
        element: <Monsters />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'npc/*',
        element: <NPC />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'conditions/*',
        element: <Conditions />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'quests/*',
        element: <Quests />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'categories/*',
        element: <Categories />,
        errorElement: <ErrorPage />,
      },
      {
        path: 'map/*',
        element: <Map />,
        errorElement: <ErrorPage />,
      },
    ],
  },
])
