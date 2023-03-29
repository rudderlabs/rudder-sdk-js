import { signal, Signal } from '@preact/signals-core';
import { DestinationConfig } from '@rudderstack/analytics-js/components/configManager/types';

export type Destination = {
  id: string;
  name: string;
  areTransformationsConnected: boolean;
  config: DestinationConfig;
};

export type DestinationConfigState = Signal<Destination[] | undefined>;

const destinationConfigState: DestinationConfigState = signal(undefined);

export { destinationConfigState };
