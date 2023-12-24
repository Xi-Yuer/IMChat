import { Image } from 'antd'
import { FC, memo } from 'react'
import { IMessagePanelProps } from './DocxMessage'

const ImageMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  const url = new URL(content)
  const width = url.searchParams.get('width') || '100%'
  const height = url.searchParams.get('height') || '100%'
  return (
    <div style={{ width, height }}>
      <Image width={'50%'} src={content}></Image>
    </div>
  )
})

export default ImageMessage
