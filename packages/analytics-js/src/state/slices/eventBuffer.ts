import { signal } from '@preact/signals-core';
import { EventBufferState } from '@rudderstack/common/types/ApplicationState';

const eventBufferState: EventBufferState = {
  toBeProcessedArray: signal([]),
  readyCallbacksArray: signal([]),
};

export { eventBufferState };
