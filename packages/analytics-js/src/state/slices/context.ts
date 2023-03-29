import { signal, Signal } from '@preact/signals-core';
import { Nullable } from '@rudderstack/analytics-js/types';
import {
  getLanguage,
  getUserAgent,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/browser';
import { APP_NAME, APP_NAMESPACE, APP_VERSION } from '@rudderstack/analytics-js/constants/app';
import {
  getScreenDetails,
  ScreenInfo,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';

export type AppDetails = {
  name: string;
  version: string;
  namespace: string;
};

export type LibraryInfo = {
  name: string;
  version: string;
};

export type OSInfo = {
  name: string;
  version: string;
};

// TODO: should we take the types from IdentifyTrait instead of any string key?
//  https://www.rudderstack.com/docs/event-spec/standard-events/identify/#identify-traits
export type Traits = Record<string, any>;

export type ContextState = {
  app: Signal<AppDetails>;
  traits: Signal<Nullable<Traits>>;
  library: Signal<LibraryInfo>;
  userAgent: Signal<Nullable<string>>;
  device: Signal<Nullable<any>>; // TODO: is this used at all?
  network: Signal<Nullable<any>>; // TODO: is this used at all?
  os: Signal<OSInfo>; // TODO: is this used at all?
  locale: Signal<Nullable<string>>;
  screen: Signal<ScreenInfo>;
  'ua-ch': Signal<UADataValues | undefined>;
};

const contextState: ContextState = {
  app: signal({
    name: APP_NAME,
    namespace: APP_NAMESPACE,
    version: APP_VERSION,
  }),
  traits: signal(null),
  library: signal({
    name: APP_NAME,
    version: APP_VERSION,
  }),
  userAgent: signal(getUserAgent()),
  device: signal(null),
  network: signal(null),
  os: signal({
    name: '',
    version: '',
  }),
  locale: signal(getLanguage()),
  screen: signal(getScreenDetails()),
  'ua-ch': signal(undefined),
};

export { contextState };
