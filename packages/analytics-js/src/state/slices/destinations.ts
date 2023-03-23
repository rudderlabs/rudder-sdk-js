import { signal, Signal } from '@preact/signals-core';

export type DestinationEvent = {
  eventName: string;
};

export type DestinationDefinition = {
  name: string;
  displayName: string;
  updatedAt: string;
};

export type Destination = {
  id: string;
  name: string;
  updatedAt: string;
  measurementId: string;
  capturePageView: string;
  writeKey: string;
  whitelistedEvents: DestinationEvent[];
  blacklistedEvents: DestinationEvent[];
  useNativeSDKToSend: boolean;
  eventFilteringOption: boolean;
  extendPageViewParams: boolean;
  oneTrustCookieCategories: string[];
  enabled: boolean;
  deleted: boolean;
  areTransformationsConnected: boolean;
  destinationDefinition: DestinationDefinition;
};

export type DestinationConfigState = Signal<Destination[] | undefined>;

const destinationConfigState: DestinationConfigState = signal(undefined);

export { destinationConfigState };
