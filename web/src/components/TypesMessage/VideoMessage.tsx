import { useInViewport } from 'ahooks'
import { FC, memo, useEffect, useRef } from 'react'
import { IMessagePanelProps } from './DocxMessage'

const VideoMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  const ref = useRef<HTMLVideoElement>(null)
  const [inViewport] = useInViewport(ref)
  useEffect(() => {
    if (!inViewport) {
      if (!ref.current?.paused) {
        ref.current?.pause()
      }
    }
  }, [inViewport])
  return (
    <div className="relative w-full h-full">
      <video src={content} ref={ref} width={220} controls></video>
    </div>
  )
})

export default VideoMessage
