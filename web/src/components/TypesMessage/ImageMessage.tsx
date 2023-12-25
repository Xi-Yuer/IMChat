import { Image } from 'antd'
import { FC, memo } from 'react'
import { useScreen } from '../../hooks/useScreen'
import { IMessagePanelProps } from './DocxMessage'

const ImageMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  const url = new URL(content)
  const height = url.searchParams.get('height') || '100%'
  const { isMobile } = useScreen()
  return (
    <div style={{ height }}>
      <Image className="shadow-lg" width={isMobile ? '70%' : '50%'} src={content}></Image>
    </div>
  )
})

export default ImageMessage
