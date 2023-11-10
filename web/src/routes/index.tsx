import { RouteObject, useRoutes } from 'react-router-dom'
import { Suspense } from 'react'
import React from 'react'

const Home = React.lazy(() => import('../views/Home'))
const Child = React.lazy(() => import('../views/Child'))

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,

    children: [
      {
        path: '',
        element: <Child />,
      },
    ],
  },
]

export const RenderRoutes = () => {
  const element = useRoutes(routes)
  return <Suspense fallback={'loading'}>{element}</Suspense>
}
