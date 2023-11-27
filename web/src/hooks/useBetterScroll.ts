import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import PullDown from '@better-scroll/pull-down'
import Pullup from '@better-scroll/pull-up'
import { useEffect, useRef } from 'react'

interface BetterScrollProps {
  onPulldown: Function
  onPullup: Function
  onScroll: Function
}

export const useBetterScroll = ({
  onPulldown,
  onPullup,
  onScroll,
}: BetterScrollProps) => {
  BScroll.use(ObserveDOM)
  BScroll.use(Pullup)
  BScroll.use(PullDown)
  const wrapRef = useRef<HTMLDivElement>(null)
  //  对象初始化
  useEffect(() => {
    if (!wrapRef.current) return
    const BetterScroll = new BScroll(wrapRef.current as HTMLDivElement, {
      //probeType 为 3，任何时候都派发 scroll 事件，包括调用 scrollTo 或者触发 momentum 滚动动画
      probetype: 3,
      //  可以使用原生的点击
      click: true,
      //  检测dom变化
      observeDOM: true,
      //  鼠标滚轮设置
      mouseWheel: {
        speed: 20,
        invert: false,
        easeTime: 300,
      },
      //  显示滚动条
      scrollY: true,
      scrollbar: true,
      //  过度动画, 在下载更多的时候滚动条会有个过度动画
      useTransition: true,
      pullDownRefresh: {
        threshold: 0,
        stop: 0,
      },
      // 下拉加载
      pullUpLoad: {
        threshold: 10,
      },
    })
    BetterScroll.on('pullingUp', async () => {
      try {
        await onPullup()
      } finally {
        BetterScroll.finishPullUp()
      }
    })
    BetterScroll.on('pullingDown', async () => {
      try {
        console.log('下拉')
        await onPulldown()
      } finally {
        BetterScroll.finishPullDown()
      }
    })
    BetterScroll.on('scroll', (e: any) => onScroll(e))
    // BetterScroll.on('scrollEnd', () => {})

    return () => {
      //  组件卸载时记得将其销毁
      BetterScroll?.destroy()
    }
  }, [])
  return {
    wrapRef,
  }
}
