import { RootState } from '@/store'
import { useInViewport } from 'ahooks'
import classNames from 'classnames'
import { FC, memo, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { getUrlQueryParams } from '../..//utils/reg'
import { useScreen } from '../../hooks/useScreen'
import { IMessagePanelProps } from './DocxMessage'
import style from './style.module.css'

const VoiceMessage: FC<IMessagePanelProps & { id: string }> = memo(({ content, id }) => {
  const ref = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isPlayed, setIsPlayed] = useState(false)
  const { user } = useSelector((state: RootState) => state.UserReducer)
  const { isMobile } = useScreen()
  const [inViewport] = useInViewport(contentRef)
  const params = getUrlQueryParams(content)
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
  return (
    <div
      ref={contentRef}
      style={{
        borderRadius: user.id === id ? '20px 2px 20px 20px' : '2px 20px 20px',
      }}
      className={classNames('min-w-[60px] flex items-center min-h-[30px] bg-slate-100 dark:bg-[#484b5b] p-3 transition-all duration-700', {
        'max-w-[250px]': isMobile,
        'max-w-xs': !isMobile,
      })}
    >
      <div className="mr-2 text-[#6c727f] dark:text-gray-200 text-lg">{params?.width}"</div>
      <div className="flex items-center justify-center h-[20px]" onClick={() => handlePlay(false)}>
        <div
          className={classNames('bg-gray-500 h-[10px] rounded-md  dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.delay_100ms, {
            [style.dounce_h]: isPlayed,
          })}
        ></div>
        <div
          className={classNames(
            'bg-gray-500  h-[20px] rounded-md  dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]',
            style.delay_200ms,
            {
              [style.dounce_h]: isPlayed,
            }
          )}
        ></div>
        <div
          className={classNames('bg-gray-500 h-[15px] rounded-md  dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.delay_300ms, {
            [style.dounce_h]: isPlayed,
          })}
        ></div>
        <div
          className={classNames('bg-gray-500 h-[10px] rounded-md  dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.delay_400ms, {
            [style.dounce_h]: isPlayed,
          })}
        ></div>
        <div
          className={classNames('bg-gray-500 h-[20px] rounded-md  dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.delay_500ms, {
            [style.dounce_h]: isPlayed,
          })}
        ></div>
        <div
          className={classNames('bg-gray-500 h-[15px] rounded-md  dark:bg-gray-200 transition-all duration-700 w-[3px] mr-[6px]', style.delay_600ms, {
            [style.dounce_h]: isPlayed,
          })}
        ></div>
        <div
          className={classNames(
            'bg-gray-500 dark:bg-gray-200 h-[20px] rounded-md  transition-all duration-700 w-[3px] mr-[6px]',
            {
              [style.dounce_h]: isPlayed,
            },
            style.delay_700ms
          )}
        ></div>
        <div
          className={classNames(
            'bg-gray-500 dark:bg-gray-200 h-[15px] rounded-md  transition-all duration-700 w-[3px] mr-[6px]',
            {
              [style.dounce_h]: isPlayed,
            },
            style.delay_800ms
          )}
        ></div>
        <div
          className={classNames(
            'bg-gray-500 dark:bg-gray-200 h-[20px] rounded-md  transition-all duration-700 w-[3px] mr-[6px]',
            {
              [style.dounce_h]: isPlayed,
            },
            style.delay_900ms
          )}
        ></div>
        <div
          className={classNames(
            'bg-gray-500 dark:bg-gray-200 h-[10px] rounded-md  transition-all duration-700 w-[3px] mr-[6px]',
            {
              [style.dounce_h]: isPlayed,
            },
            style.delay_1000ms
          )}
        ></div>
        <div
          className={classNames(
            'bg-gray-500 dark:bg-gray-200 h-[20px] rounded-md  transition-all duration-700 w-[3px] mr-[6px]',
            {
              [style.dounce_h]: isPlayed,
            },
            style.delay_1100ms
          )}
        ></div>
        <div
          className={classNames(
            'bg-gray-500 dark:bg-gray-200 h-[10px] rounded-md  transition-all duration-700 w-[3px] mr-[6px]',
            {
              [style.dounce_h]: isPlayed,
            },
            style.delay_1200ms
          )}
        ></div>
      </div>
      <audio
        src={content}
        ref={ref}
        controls
        hidden
        onPaste={() => setIsPlayed(false)}
        onPlaying={() => setIsPlayed(true)}
        onEnded={() => setIsPlayed(false)}
      ></audio>
    </div>
  )
})

export default VoiceMessage
