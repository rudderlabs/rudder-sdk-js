import { signal } from '@preact/signals-core';
import type { DataPlaneEventsState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const dataPlaneEventsState: DataPlaneEventsState = {
  eventsQueuePluginName: signal(undefined),
  deliveryEnabled: signal(true), // Delivery should always happen
};

export { dataPlaneEventsState };
