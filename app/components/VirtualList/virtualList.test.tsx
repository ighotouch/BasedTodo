import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { VirtualList, VirtualListProps } from './virtualList'
import { DebounceFunction } from './debounce'

// Mock the debounce function to avoid any delay
jest.mock('./debounce', () => ({
  debounce: jest.fn((func: DebounceFunction, delay: number) => func),
}))

const fetchMoreItemsMock = jest.fn()

const mockProps: VirtualListProps = {
  items: [
    { id: 1, text: 'Item 1' },
    { id: 2, text: 'Item 2' },
  ],
  itemHeight: 50,
  renderItem: jest.fn((item, index) => <div key={index}>{item.text}</div>),
  onScroll: () => {},
  emptyMessage: '',
}

describe('VirtualList', () => {
  beforeEach(() => {
    jest.useFakeTimers() // to escape all the setTimeout i created
  })

  afterEach(() => {
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  })

  it('renders VirtualList component', () => {
    render(<VirtualList {...mockProps} />)

    // Assert that the items are rendered
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  //TODO: This test does not really test the actual scroll feature
  it('renders new items on scroll', () => {
    const items = Array.from({ length: 20 }, (_, index) => ({
      id: index,
      text: `Item ${index}`,
    }))
    const renderItem = jest.fn()
    const scrollTop = 1000
    const itemHeight = 50

    render(
      <VirtualList
        items={items}
        itemHeight={itemHeight}
        renderItem={renderItem}
        onScroll={fetchMoreItemsMock}
      />
    )

    // Scroll the container
    const container = screen.getByTestId('virtual-list-container')
    fireEvent.scroll(container, { target: { scrollTop } })

    // Expected next index
    const netIndex = Math.floor(scrollTop / itemHeight)

    jest.runAllTimers() // allow the timer to run (await)

    expect(renderItem).toHaveBeenCalledTimes(20) // not sure if this test what i expects i need to think about this more.
    expect(fetchMoreItemsMock).toHaveBeenCalledWith(netIndex)

    fireEvent.scroll(container, { target: { scrollTop: 0 } })
    //
  })

  // scroll top test not required
})
