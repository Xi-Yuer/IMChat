import { Image } from 'antd'
import { FC, memo } from 'react'
import { useScreen } from '../../hooks/useScreen'
import { getUrlQueryParams } from '../../utils/reg'
import { IMessagePanelProps } from './DocxMessage'

const ImageMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  const params = getUrlQueryParams(content)
  const { isMobile } = useScreen()
  return (
    <div style={{ height: params?.height || '100%' }}>
      <Image className="shadow-lg" width={isMobile ? '70%' : '50%'} src={content}></Image>
    </div>
  )
})

export default ImageMessage
