/**
 * A buffer queue to serve as a store for any type of data
 */
class BufferQueue {
  constructor() {
    this.items = [];
  }
  enqueue(item) {
    this.items.push(item);
  }
  dequeue() {
    if (this.items.length === 0) {
      return null;
    }
    return this.items.shift();
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
  clear() {
    this.items = [];
  }
}
export { BufferQueue };
