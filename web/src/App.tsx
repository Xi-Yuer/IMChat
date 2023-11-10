import { memo } from 'react'
import { RenderRoutes } from './routes'
import { HashRouter } from 'react-router-dom'

const App = memo(() => {
  return (
    <div>
      <HashRouter>
        <RenderRoutes />
      </HashRouter>
    </div>
  )
})

export default App