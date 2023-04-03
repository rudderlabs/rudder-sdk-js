import { signal, Signal } from '@preact/signals-core';
import { Destination } from '@rudderstack/analytics-js/state/types';

export type DestinationConfigState = Signal<Destination[] | undefined>;

const destinationConfigState: DestinationConfigState = signal(undefined);

export { destinationConfigState };
