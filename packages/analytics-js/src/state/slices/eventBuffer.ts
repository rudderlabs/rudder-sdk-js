import { Signal, signal } from '@preact/signals-core';

export type ApiCallback = () => void;
export type BufferedEvent = any[];

// TODO: add proper types for array items instead of any
export type EventBufferState = {
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
