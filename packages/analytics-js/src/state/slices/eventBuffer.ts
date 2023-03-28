import { Signal, signal } from '@preact/signals-core';

// TODO: add proper types for array items instead of any
export type EventBufferState = {
  toBeProcessedArray: Signal<any[]>;
  toBeProcessedByIntegrationArray: Signal<any[]>;
};

const eventBufferState = {
  toBeProcessedArray: signal([]),
  toBeProcessedByIntegrationArray: signal([]),
};

export { eventBufferState };
