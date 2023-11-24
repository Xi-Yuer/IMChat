import { RootState } from '@/store'
import EmojiPicker, {
  EmojiStyle,
  Theme,
  type EmojiClickData,
} from 'emoji-picker-react'
import {
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { useSelector } from 'react-redux'

export interface Props {
  pickEmoji: (emoji: EmojiClickData) => void
}
export interface EmojiRefCom {
  show: () => void
  hidden: () => void
}
const Emoji = forwardRef<EmojiRefCom, Props>((props: Props, ref) => {
  const { theme } = useSelector((state: RootState) => state.UIReducer)
  const EmojiRef = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useImperativeHandle(ref, () => ({
    show: () => setShow(true),
    hidden: () => setShow(false),
  }))

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (EmojiRef.current && !EmojiRef.current.contains(event.target)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [EmojiRef])

  const onEmojiClick = (emoji: EmojiClickData) => props.pickEmoji(emoji)
  return (
    show && (
      <div
        ref={EmojiRef}
        className="w-[90%] md:w-[350px] h-[60%] transition-all duration-700 bottom-[145px] left-[2%] absolute"
      >
        <EmojiPicker
          emojiStyle={EmojiStyle.NATIVE}
          theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={onEmojiClick}
          height={'100%'}
          width={'100%'}
          autoFocusSearch={false}
          customEmojis={[
            {
              names: ['Me'],
              imgUrl:
                'https://xiyuer.club/ca4a6dbd-316f-44b6-8772-b26870e6d1eb.jpg',
              id: 'me',
            },
          ]}
        />
      </div>
    )
  )
})

export default memo(Emoji)
