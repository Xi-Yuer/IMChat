import { ThemeAppearance, ThemeProvider } from 'antd-style'
import { memo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HashRouter } from 'react-router-dom'
import { RenderRoutes } from './routes'
import { RootState } from './store'
import { themeChange } from './store/modules/ui'
import { customDarkAlgorithm } from './theme/dark'
import { customLightAlgorithm } from './theme/light'

const Root = memo(() => {
  const theme = useSelector((state: RootState) => state.UIReducer.theme)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(themeChange(theme))
  }, [])
  return (
    <>
      <HashRouter>
        <ThemeProvider
          themeMode={theme}
          theme={(appearance: ThemeAppearance) =>
            appearance === 'dark'
              ? { token: {}, algorithm: [customDarkAlgorithm] }
              : {
                  algorithm: [customLightAlgorithm],
                }
          }
        >
          <RenderRoutes />
        </ThemeProvider>
      </HashRouter>
    </>
  )
})

export default Root
