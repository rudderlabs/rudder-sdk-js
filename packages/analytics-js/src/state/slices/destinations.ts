import { signal, Signal } from '@preact/signals-core';

export type DestinationEvent = {
  eventName: string;
};

export type DestinationDefinition = {
  name: string;
  displayName?: string;
  updatedAt?: string;
};

export type Destination = {
  id: string;
  config: any;
  name: string;
  updatedAt?: string;
  // measurementId: string; // not needed
  // capturePageView: string; // not needed
  // writeKey: string; // not needed
  // whitelistedEvents: DestinationEvent[]; // not needed
  // blacklistedEvents: DestinationEvent[]; // not needed
  // useNativeSDKToSend: boolean; // not needed
  // eventFilteringOption: boolean; // not needed
  // extendPageViewParams: boolean; // not needed
  // oneTrustCookieCategories: string[]; // not needed
  enabled?: boolean;
  deleted?: boolean;
  areTransformationsConnected: boolean;
  destinationDefinition: DestinationDefinition;
};

export type DestinationConfigState = Signal<Destination[] | undefined>;

const destinationConfigState: DestinationConfigState = signal(undefined);

export { destinationConfigState };
