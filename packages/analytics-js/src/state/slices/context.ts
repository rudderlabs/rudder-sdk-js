import { signal, Signal } from '@preact/signals-core';
import { Nullable } from '@rudderstack/analytics-js/types';
import {
  extractUTMParameters,
  getLanguage,
  getUserAgent,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/browser';
import {
  getScreenDetails,
  ScreenInfo,
} from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';
import { APP_NAME, APP_NAMESPACE, APP_VERSION } from '@rudderstack/analytics-js/constants/app';
import {
  AppInfo,
  LibraryInfo,
  OSInfo,
  Traits,
  UTMParameters,
} from '@rudderstack/analytics-js/state/types';
import { pagePropertiesState } from './page';

export type ContextState = {
  app: Signal<AppInfo>;
  traits: Signal<Nullable<Traits>>;
  library: Signal<LibraryInfo>;
  userAgent: Signal<Nullable<string>>;
  device: Signal<Nullable<any>>; // TODO: is this used at all?
  network: Signal<Nullable<any>>; // TODO: is this used at all?
  os: Signal<OSInfo>; // TODO: is this used at all?
  locale: Signal<Nullable<string>>;
  screen: Signal<ScreenInfo>;
  'ua-ch': Signal<UADataValues | undefined>;
  campaign: Signal<UTMParameters>;
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
  campaign: signal(extractUTMParameters(pagePropertiesState.url.value)),
};

export { contextState };
