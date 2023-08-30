import { BufferQueue } from '../../../src/components/core/BufferQueue';

describe('Core - BufferQueue', () => {
  let bufferQueue: BufferQueue<number>;

  beforeEach(() => {
    bufferQueue = new BufferQueue<number>();
  });

  it('should enqueue items correctly', () => {
    bufferQueue.enqueue(1);
    bufferQueue.enqueue(2);
    bufferQueue.enqueue(3);

    expect(bufferQueue.size()).toBe(3);
  });

  it('should dequeue items correctly', () => {
    bufferQueue.enqueue(1);
    bufferQueue.enqueue(2);

    expect(bufferQueue.dequeue()).toBe(1);
    expect(bufferQueue.size()).toBe(1);

    expect(bufferQueue.dequeue()).toBe(2);
    expect(bufferQueue.size()).toBe(0);
  });

  it('should return null when dequeue an empty queue', () => {
    expect(bufferQueue.dequeue()).toBeNull();
  });

  it('should check if queue is empty', () => {
    expect(bufferQueue.isEmpty()).toBeTruthy();

    bufferQueue.enqueue(1);
    expect(bufferQueue.isEmpty()).toBeFalsy();
  });

  it('should return the correct size of the queue', () => {
    bufferQueue.enqueue(1);
    bufferQueue.enqueue(2);
    bufferQueue.enqueue(3);

    expect(bufferQueue.size()).toBe(3);
  });

  it('should clear the queue', () => {
    bufferQueue.enqueue(1);
    bufferQueue.enqueue(2);

    bufferQueue.clear();
    expect(bufferQueue.size()).toBe(0);
  });
});
