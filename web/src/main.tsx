import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'normalize.css'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './style/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    locale={zhCN}
    theme={{
      components: {
        Modal: {
          contentBg: '#a7b1c0',
          headerBg: '#a7b1c0',
        },
        Popover: {
          colorBgElevated: '#717984',
        },
      },
    }}
  >
    <App />
  </ConfigProvider>
)
