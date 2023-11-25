import { FC, memo } from 'react'

export interface IMessagePanelProps {
  content: string
  messageAlign?: boolean
  file_name?: string
}
const DocxMessage: FC<IMessagePanelProps> = memo(() => {
  return <div>DocxMessage</div>
})

export default DocxMessage
