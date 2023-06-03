import { signal, Signal } from '@preact/signals-core';
import { Nullable } from '@rudderstack/analytics-js/types';
import { ScreenInfo } from '@rudderstack/analytics-js/components/capabilitiesManager/detection/screen';
import { APP_NAME, APP_NAMESPACE, APP_VERSION } from '@rudderstack/analytics-js/constants/app';
import {
  AppInfo,
  LibraryInfo,
  OSInfo,
  Traits,
  UTMParameters,
} from '@rudderstack/analytics-js/state/types';

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
  userAgent: signal(''),
  device: signal(null),
  network: signal(null),
  os: signal({
    name: '',
    version: '',
  }),
  locale: signal(null),
  screen: signal({
    density: 0,
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
  }),
  'ua-ch': signal(undefined),
  campaign: signal({}),
};

export { contextState };
