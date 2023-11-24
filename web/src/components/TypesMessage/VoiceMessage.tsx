import { useInViewport } from 'ahooks'
import { FC, memo, useEffect, useRef } from 'react'
import { IMessagePanelProps } from './DocxMessage'

const VoiceMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  const ref = useRef<HTMLVideoElement>(null)
  const [inViewport] = useInViewport(ref)
  useEffect(() => {
    if (!inViewport) {
      if (!ref.current?.paused) {
        ref.current?.pause()
      }
    }
  }, [inViewport])
  return <video src={content} ref={ref} controls></video>
})

export default VoiceMessage
