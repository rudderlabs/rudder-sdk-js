import { signal } from '@preact/signals-core';
import type { DataPlaneEventsState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';

const dataPlaneEventsState: DataPlaneEventsState = {
  deliveryEnabled: signal(true), // Delivery should always happen
};

export { dataPlaneEventsState };
