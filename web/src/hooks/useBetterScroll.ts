import BScroll from '@better-scroll/core'
import { BScrollConstructor } from '@better-scroll/core/dist/types/BScroll'
import ObserveDOM from '@better-scroll/observe-dom'
import { useEffect, useRef, useState } from 'react'
BScroll.use(ObserveDOM)

interface BetterScrollProps {
  onPulldown?: Function
  onPullup?: Function
  prop: any
}

export const useBetterScroll = ({
  onPulldown,
  onPullup,
  prop,
}: BetterScrollProps) => {
  const wrapRef = useRef<HTMLDivElement>(null)
  //  记录Better-scroll是否实例化，为后续挂载下拉刷新和上拉加载做准备
  const initRef = useRef(false)

  //  存储better-scroll的实例
  const [scrollObj, setscrollObj] = useState<BScrollConstructor>()

  const initBScroll = () => {
    setscrollObj(
      new BScroll(wrapRef.current as HTMLDivElement, {
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
        //  下拉刷新
        pullDownRefresh: {
          threshold: 70,
          stop: 0,
        },
        //  上拉加载更多
        pullUpLoad: {
          threshold: 90,
          stop: 10,
        },
      })
    )
  }

  //  对象初始化
  useEffect(() => {
    initBScroll()
    return () => {
      //  组件卸载时记得将其销毁
      scrollObj?.destroy()
    }
  }, [])

  //  对象事件挂载
  useEffect(() => {
    if (initRef.current === true) {
      //  下拉刷新
      //  每次更新都需要先把之前的pullingDown事件清除，不然会累加
      scrollObj?.off('pullingDown')
      scrollObj?.once('pullingDown', onPulldown!)

      //  上拉加载
      //  每次更新都需要先把之前的pullingUp事件清除，不然会累加
      scrollObj?.off('pullingUp')
      scrollObj?.once('pullingUp', onPullup!)
    } else {
      initRef.current = true
    }
    //  为什么监听prop是因为这边监听不到外面的state变化
    //  handlePullUp的[...state, ...res.data]中的state会中始终为一开始的[]
  }, [prop])

  return {
    wrapRef,
  }
}
