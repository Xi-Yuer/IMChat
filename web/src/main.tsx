import { LoadingOutlined } from '@ant-design/icons'
import { ConfigProvider, Spin } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'normalize.css'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App.tsx'
import { store } from './store/index'
import './style/index.css'

let persistor = persistStore(store)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <ConfigProvider locale={zhCN}>
      <PersistGate
        loading={
          <Spin
            fullscreen
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          />
        }
        persistor={persistor}
      >
        <App />
      </PersistGate>
    </ConfigProvider>
  </Provider>
)
