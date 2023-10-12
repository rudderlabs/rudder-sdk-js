import { signal } from '@preact/signals-core';
const eventBufferState = {
  toBeProcessedArray: signal([]),
  readyCallbacksArray: signal([]),
};
export { eventBufferState };
