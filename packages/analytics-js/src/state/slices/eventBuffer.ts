import { Signal, signal } from '@preact/signals-core';
import { ApiCallback, BufferedEvent } from '@rudderstack/analytics-js/state/types';

// TODO: add proper types for array items instead of any
export type EventBufferState = {
  // TODO: make this a BufferQueue?
  toBeProcessedArray: Signal<BufferedEvent[]>;
  toBeProcessedByIntegrationArray: Signal<any[]>;
  readyCallbacksArray: Signal<ApiCallback[]>;
};

const eventBufferState = {
  toBeProcessedArray: signal([]),
  toBeProcessedByIntegrationArray: signal([]),
  readyCallbacksArray: signal([]),
};

export { eventBufferState };
