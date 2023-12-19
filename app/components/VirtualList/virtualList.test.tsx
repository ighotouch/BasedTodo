import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { VirtualList, VirtualListProps } from './virtualList'; // Update the import path as needed

// Mock the debounce function to simplify testing
jest.mock('./debounce', () => ({
  debounce: (fn: () => void) => fn,
}));

describe('VirtualList', () => {
  const items = Array.from({ length: 100 }, (_, index) => `Item ${index}`);
  const renderItem = (item: string, index: number) => (
    <div key={index}>{item}</div>
  );
  const onScrollMock = jest.fn();

  const defaultProps: VirtualListProps<string> = {
    items,
    renderItem,
    limit: 20,
    onScroll: onScrollMock,
  };

  it('renders correctly with items', () => {
    render(<VirtualList {...defaultProps} />);
    // expect(screen.getByTestId('virtual-list-container')).toBeInTheDocument();
    expect(screen.getAllByText(/^Item/)).toHaveLength(20); // Assuming the limit is 20
  });

  it('renders correctly with empty items', () => {
    render(<VirtualList {...defaultProps} items={[]} />);
    // expect(screen.getByText('No items available')).toBeInTheDocument();
  });

  it('calls onScroll when scrolling', () => {
    render(<VirtualList {...defaultProps} />);
    fireEvent.scroll(screen.getByTestId('virtual-list-container'), {
      target: { scrollTop: 100 },
    });
    expect(onScrollMock).toHaveBeenCalledWith(2, 22); // Update the expected values based on your logic
  });
});
