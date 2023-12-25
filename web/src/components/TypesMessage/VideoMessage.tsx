import { useInViewport } from 'ahooks'
import { FC, memo, useEffect, useRef } from 'react'
import { IMessagePanelProps } from './DocxMessage'

const VideoMessage: FC<IMessagePanelProps> = memo(({ content }) => {
  const ref = useRef<HTMLVideoElement>(null)
  const [inViewport] = useInViewport(ref)
  const url = new URL(content)
  const width = url.searchParams.get('width') || '100%'
  const height = url.searchParams.get('height') || '100%'
  // 判断是横屏还是竖屏视频 16:9 or 9:16
  const isVertical = Number(width) / Number(height) > 1
  useEffect(() => {
    if (!inViewport) {
      if (!ref.current?.paused) {
        ref.current?.pause()
      }
    }
  }, [inViewport])
  return (
    <div className="relative" style={{ width: !isVertical ? '250px' : '350px' }}>
      <video src={content} ref={ref} controls></video>
    </div>
  )
})

export default VideoMessage
