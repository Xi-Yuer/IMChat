import { FC, memo } from 'react'
import { highlightUsername } from '../../utils/reg'
import { IMessagePanelProps } from './DocxMessage'

const TextMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  return (
    <div
      className="text-start dark:text-white select-text transition-all duration-700"
      dangerouslySetInnerHTML={{ __html: highlightUsername(content) }}
    ></div>
  )
})

export default TextMessage
