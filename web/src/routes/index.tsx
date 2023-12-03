import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React, { Suspense } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'

const Home = React.lazy(() => import('../views/Home'))

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
]

export const RenderRoutes = () => {
  const element = useRoutes(routes)
  return <Suspense fallback={<Spin fullscreen indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />}>{element}</Suspense>
}
