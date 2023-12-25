import { useInViewport } from 'ahooks'
import { FC, memo, useEffect, useRef } from 'react'
import { useScreen } from '../../hooks/useScreen'
import { IMessagePanelProps } from './DocxMessage'

const VideoMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  const ref = useRef<HTMLVideoElement>(null)
  const [inViewport] = useInViewport(ref)
  const { isMobile } = useScreen()
  const url = new URL(content)
  const width = Number(url.searchParams.get('width')) / (isMobile ? 5 : 4) || '100%'
  const height = url.searchParams.get('height') || '100%'
  useEffect(() => {
    if (!inViewport) {
      if (!ref.current?.paused) {
        ref.current?.pause()
      }
    }
  }, [inViewport])
  return (
    <div style={{ width, height }}>
      <video src={content} ref={ref} controls></video>
    </div>
  )
})

export default VideoMessage
