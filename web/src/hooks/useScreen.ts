import { useState, useEffect } from 'react'

export const useScreen = () => {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  const [isMobile, setIsMobile] = useState(width < 768)

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
      if (window.innerWidth < 768) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    })

    if (window.innerWidth < 768) {
      setIsMobile(true)
    }
  }, [])

  return { width, height, isMobile }
}
