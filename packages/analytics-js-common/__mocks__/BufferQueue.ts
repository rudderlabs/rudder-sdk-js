class BufferQueue<T> {
  items: T[];
  enqueue = jest.fn();
  dequeue = jest.fn();
  isEmpty = jest.fn();
  size = jest.fn();
  clear = jest.fn();
}

export { BufferQueue };
