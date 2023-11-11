import { memo } from 'react'
import { Provider } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { RenderRoutes } from './routes'
import { store } from './store'

const App = memo(() => {
  return (
    <div>
      <HashRouter>
        <Provider store={store}>
          <RenderRoutes />
        </Provider>
      </HashRouter>
    </div>
  )
})

export default App
