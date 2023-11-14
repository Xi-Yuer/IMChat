import { MappingAlgorithm, theme } from 'antd'

export const customLightAlgorithm: MappingAlgorithm = (seedToken) => {
  const mergeToken = theme.defaultAlgorithm(seedToken)

  return {
    ...mergeToken,
    // colorBgLayout:'',
    // colorBgContainer: '',
    // colorBgElevated: '',
  }
}
