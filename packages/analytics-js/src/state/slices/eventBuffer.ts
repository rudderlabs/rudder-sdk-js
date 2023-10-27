import { signal } from '@preact/signals-core';
import type { EventBufferState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const eventBufferState: EventBufferState = {
  toBeProcessedArray: signal([]),
  readyCallbacksArray: signal([]),
};

export { eventBufferState };
