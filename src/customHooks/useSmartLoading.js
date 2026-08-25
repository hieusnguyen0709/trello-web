import { useState, useEffect, useRef } from 'react'

const SHOW_DELAY = 200 // chỉ hiện spinner nếu loading kéo dài hơn 200ms
const MIN_DURATION = 400 // nếu đã hiện, giữ tối thiểu 400ms

export function useSmartLoading(isLoading) {
  const [showSpinner, setShowSpinner] = useState(false)
  const shownAtRef = useRef(null)

  useEffect(() => {
    let showTimer
    let hideTimer

    if (isLoading) {
      // Chỉ set timer để HIỆN spinner sau SHOW_DELAY, không hiện ngay lập tức
      showTimer = setTimeout(() => {
        shownAtRef.current = Date.now()
        setShowSpinner(true)
      }, SHOW_DELAY)
    } else {
      // Loading đã xong
      /* eslint-disable no-lonely-if */
      if (shownAtRef.current) {
        // Spinner đã lỡ hiện ra -> đảm bảo giữ đủ MIN_DURATION trước khi tắt
        const elapsed = Date.now() - shownAtRef.current
        const remaining = Math.max(MIN_DURATION - elapsed, 0)
        hideTimer = setTimeout(() => {
          setShowSpinner(false)
          shownAtRef.current = null
        }, remaining)
      } else {
        // Loading xong TRƯỚC khi kịp hiện spinner -> tắt luôn, không cần chờ gì
        setShowSpinner(false)
      }
    }

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [isLoading])

  return showSpinner
}