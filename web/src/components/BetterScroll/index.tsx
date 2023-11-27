import { FC, ReactElement, memo } from 'react'
import { useBetterScroll } from '../../hooks/useBetterScroll'

export interface ScrollProps {
  wrapHeight: string
  prop?: any
  onPullup: Function
  onPulldown: Function
  onScroll: Function
  children: ReactElement
}

const BetterScroll: FC<ScrollProps> = memo(
  ({ wrapHeight, onPullup, onPulldown, onScroll, children }) => {
    const { wrapRef } = useBetterScroll({
      onPullup,
      onPulldown,
      onScroll,
    })
    return (
      <div
        className="scroll-warpper"
        ref={wrapRef}
        style={{ height: wrapHeight, overflow: 'hidden' }}
      >
        <div className="scroll-content">{children}</div>
      </div>
    )
  }
)

export default BetterScroll
