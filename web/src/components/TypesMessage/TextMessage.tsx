import { FC, memo } from 'react'
import { IMessagePanelProps } from './DocxMessage'

const TextMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  return <div>{content}</div>
})

export default TextMessage
