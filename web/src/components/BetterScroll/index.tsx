import { FC, ReactElement, memo } from 'react'
import { useBetterScroll } from '../../hooks/useBetterScroll'

export interface ScrollProps {
  wrapHeight: string
  prop?: any
  onPullup?: Function
  onPulldown?: Function
  children: ReactElement
}

const BetterScroll: FC<ScrollProps> = memo(
  ({ wrapHeight, prop, onPullup, onPulldown, children }) => {
    const { wrapRef } = useBetterScroll({ prop, onPullup, onPulldown })
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
