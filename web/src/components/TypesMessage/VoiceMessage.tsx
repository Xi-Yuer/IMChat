import { PauseCircleOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useInViewport } from 'ahooks'
import { Progress } from 'antd'
import classNames from 'classnames'
import { FC, memo, useEffect, useRef, useState } from 'react'
import VoiceImage from '../../assets/image/music_fill.png'
import { IMessagePanelProps } from './DocxMessage'

const VoiceMessage: FC<IMessagePanelProps> = memo(({ content, file_name }) => {
  const ref = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isPlayed, setIsPlayed] = useState(false)
  const [playPercent, setPlayPercent] = useState(0)
  const [inViewport] = useInViewport(contentRef)
  useEffect(() => {
    if (!inViewport) {
      if (!ref.current?.paused) {
        ref.current?.pause()
        setIsPlayed(false)
      }
    }
  }, [inViewport])
  const handlePlay = (play: boolean) => {
    if (!play) {
      ref.current?.play()
      setIsPlayed(true)
    } else {
      ref.current?.pause()
      setIsPlayed(false)
    }
  }

  const onPlaying = (e: any) => {
    // 计算音乐当前时间占总时间的播放百分比
    const percent = e.target.currentTime / e.target.duration
    setPlayPercent(percent * 100)
  }
  return (
    <div
      className={classNames(
        'w-[250px] overflow-hidden relative rounded-md h-[80px] p-2 box-content flex items-center bg-slate-100 dark:bg-green-400 transition-all duration-700'
      )}
      style={{
        backgroundImage: `url(${VoiceImage})`,
        backgroundSize: '20% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '90%',
      }}
      ref={contentRef}
    >
      <div className="w-[70px] h-[70px] bg-[#a5dff9] flex justify-center items-center">
        {!isPlayed ? <PlayCircleOutlined onClick={() => handlePlay(false)} /> : <PauseCircleOutlined onClick={() => handlePlay(true)} />}
      </div>
      <div className="transition-all duration-700 px-2 w-[150px] text-start truncate dark:text-[#414141]">{file_name}</div>
      {isPlayed && (
        <div className=" absolute bottom-[-17px] left-0 right-0">
          <Progress percent={playPercent} status="exception" size="small" showInfo={false} />
        </div>
      )}
      <video
        src={content}
        ref={ref}
        controls
        hidden
        onTimeUpdate={onPlaying}
        onPaste={() => setIsPlayed(false)}
        onPlaying={() => setIsPlayed(true)}
        onEnded={() => setIsPlayed(false)}
      ></video>
    </div>
  )
})

export default VoiceMessage
