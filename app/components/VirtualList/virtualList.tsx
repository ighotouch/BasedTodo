import React, { useEffect, useCallback, useRef } from 'react'
import { debounce } from './debounce'

export interface VirtualListProps {
  items?: any[]
  itemHeight: number
  renderItem: (item: any, index: number) => React.ReactNode
  emptyMessage?: string
  onScroll: (index: number) => void
}

export const VirtualList: React.FC<VirtualListProps> = ({
  items = [],
  itemHeight,
  renderItem,
  emptyMessage = 'No items available',
  onScroll,
}) => {
  const containerHeight = 300
  const simulatedDelay = 3
  const containerRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)
  const animationFrameId = useRef<number | null>(null)

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const scrollTop = container.scrollTop || 0
    const clientHeight = container.clientHeight || 0
    const buffer = 2

    const loadMore = () => {
      if (scrollTop <= clientHeight * buffer && !loadingRef.current) {
        loadingRef.current = true
        const newStartIndex = Math.floor(scrollTop / itemHeight)

        setTimeout(() => {
          onScroll(newStartIndex)
          loadingRef.current = false
        }, simulatedDelay) // i dont know why i did this maybe based.io is just faster than reality lol
        // just expected life to be a little slower
      } else if (
        scrollTop + clientHeight >=
          container.scrollHeight - clientHeight * buffer &&
        !loadingRef.current
      ) {
        loadingRef.current = true
        const newStartIndex = Math.floor(scrollTop / itemHeight)
        // Simulate a delay in fetching more items (replace with actual fetchMoreItems call)
        setTimeout(() => {
          // This needs to be optimised if i wish to move this to production (variation in heights)
          onScroll(newStartIndex + Math.floor(clientHeight / itemHeight))
          loadingRef.current = false
        }, simulatedDelay) // Based is just faster than reality i am impressed
      }
    }

    const handleAnimationFrame = () => {
      loadMore()
      animationFrameId.current = null
    }

    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(handleAnimationFrame) // to make it smoother
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
  }, [itemHeight, onScroll])

  useEffect(() => {
    const debouncedScroll = debounce(
      handleScroll,
      300
    ) as unknown as EventListener

    const container = containerRef.current
    if (container) {
      container.addEventListener('scroll', debouncedScroll)
    }

    return () => {
      const container = containerRef.current
      if (container) {
        container.removeEventListener('scroll', debouncedScroll)
      }
    }
  }, [debounce, handleScroll, items.length, containerRef.current]) // Include items.length in the dependency array

  if (!items || items.length === 0) {
    return (
      <div
        ref={containerRef}
        style={{
          height: `${containerHeight}px`,
          overflowY: 'auto',
          textAlign: 'center',
        }}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div
      data-testid="virtual-list-container"
      ref={containerRef}
      style={{
        height: `${containerHeight}px`,
        overflowY: 'auto',
        width: '500px',
      }}
    >
      <div style={{ height: `${items.length * itemHeight}px` }}>
        {items.map((item, index) => (
          <div key={index} style={{ height: `${itemHeight}px` }}>
            {renderItem(item, index)}
          </div>
        ))}
        {loadingRef.current && (
          <div style={{ textAlign: 'center' }}>Loading...</div>
        )}
      </div>
    </div>
  )
}
