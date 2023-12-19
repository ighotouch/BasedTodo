import React, { useCallback, useRef, useState, useEffect } from 'react'
import { debounce } from './debounce'

export interface VirtualListProps<T> {
  items?: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  emptyMessage?: string
  onScroll: (startIndex: number, stopIndex: number) => void
  limit: number
}

export const VirtualList = <T,>({
  items = [],
  renderItem,
  emptyMessage = 'No items available',
  onScroll,
  limit,
}: VirtualListProps<T>): JSX.Element => {
  const [scrollTops, setScrollTops] = useState(0)
  const containerHeight = 300
  const rowHeight = 41
  const containerRef = useRef<HTMLDivElement | null>(null)

  const debouncedOnScroll = useCallback(
    debounce(() => {
      if (containerRef.current) {
        const sT = containerRef.current.scrollTop
        setScrollTops(sT)
        const start = Math.floor(sT / rowHeight)
        onScroll(start, start + limit)
      }
    }, 2),
    []
  )

  useEffect(() => {
    const container = containerRef.current

    const handleScroll = () => {
      debouncedOnScroll()
    }

    if (container) {
      container.addEventListener('scroll', handleScroll)

      return () => {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [debouncedOnScroll])

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

  const startNode = Math.floor(scrollTops / rowHeight)
  const dataVisible = items.slice(startNode, startNode + limit)
  const remainingItemsHeight = (items.length - startNode - limit) * rowHeight
  const endRowHeight = remainingItemsHeight > 0 ? remainingItemsHeight : 0

  const MemoizedItem = React.memo(
    ({ item, index }: { item: T; index: number }) => (
      <div
        className="virtualized-item"
        style={{
          height: rowHeight,
        }}
      >
        {renderItem(item, index)}
      </div>
    )
  )

  return (
    <div>
      Scrolled: {scrollTops}
      StartNode: {startNode}
      <div
        data-testid="virtual-list-container"
        ref={containerRef}
        className="virtual-list"
        style={{
          overflowY: 'auto',
          width: '500px',
          height: containerHeight,
          scrollBehavior: 'smooth',
        }}
      >
        <div style={{ height: startNode * rowHeight }} />
        {dataVisible.map((item, index) => (
          <MemoizedItem key={index} item={item} index={index} />
        ))}
        <div style={{ height: endRowHeight }} />
      </div>
    </div>
  )
}
