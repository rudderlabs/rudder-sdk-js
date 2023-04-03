import { Nullable } from '@rudderstack/analytics-js/types';

class BufferQueue<T = any> {
  items: T[];

  constructor() {
    this.items = [];
  }

  enqueue(item: T) {
    this.items.push(item);
  }

  dequeue(): Nullable<T> | undefined {
    if (this.items.length === 0) {
      return null;
    }
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  clear() {
    this.items = [];
  }
}

export { BufferQueue };
