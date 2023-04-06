import { Signal, signal } from '@preact/signals-core';
import { ApiCallback, BufferedEvent } from '@rudderstack/analytics-js/state/types';

export type EventBufferState = {
  // TODO: make this a BufferQueue?
  toBeProcessedArray: Signal<BufferedEvent[]>;
  // TODO: add proper types for array items instead of any
  toBeProcessedByIntegrationArray: Signal<any[]>;
  // TODO: make this a BufferQueue?
  readyCallbacksArray: Signal<ApiCallback[]>;
};

const eventBufferState = {
  toBeProcessedArray: signal([]),
  toBeProcessedByIntegrationArray: signal([]),
  readyCallbacksArray: signal([]),
};

export { eventBufferState };
