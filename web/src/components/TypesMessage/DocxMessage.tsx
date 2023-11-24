import { FC, memo } from 'react'

export interface IMessagePanelProps {
  content: string
}
const DocxMessage: FC<IMessagePanelProps> = memo(() => {
  return <div>DocxMessage</div>
})

export default DocxMessage
