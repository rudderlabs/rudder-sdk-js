import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
/**
 * A buffer queue to serve as a store for any type of data
 */
declare class BufferQueue<T = any> {
  items: T[];
  constructor();
  enqueue(item: T): void;
  dequeue(): Nullable<T> | undefined;
  isEmpty(): boolean;
  size(): number;
  clear(): void;
}
export { BufferQueue };
