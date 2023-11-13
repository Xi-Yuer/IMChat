import { RouteObject, useRoutes } from 'react-router-dom'
import { Suspense } from 'react'
import React from 'react'

const Home = React.lazy(() => import('../views/Home'))

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
]

export const RenderRoutes = () => {
  const element = useRoutes(routes)
  return <Suspense fallback={'loading'}>{element}</Suspense>
}
