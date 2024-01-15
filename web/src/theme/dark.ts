import { MappingAlgorithm, theme } from 'antd'

export const customDarkAlgorithm: MappingAlgorithm = (seedToken, mapToken) => {
  const mergeToken = theme.darkAlgorithm(seedToken, mapToken)

  return {
    ...mergeToken,
    colorBgLayout: '#20252b',
    colorBgContainer: '#282c34',
    colorBgElevated: '#414b58',
    colorPrimary: '#e0e1e250',
    colorPrimaryHover: '#e0e1e250',
  }
}
