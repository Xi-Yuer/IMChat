import { Image } from 'antd'
import { FC, memo } from 'react'
import { IMessagePanelProps } from './DocxMessage'

const ImageMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  return <Image width={'50%'} src={content}></Image>
})

export default ImageMessage
