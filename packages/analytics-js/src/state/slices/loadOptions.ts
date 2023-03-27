import { Signal, signal } from '@preact/signals-core';
import * as R from 'ramda';
import { LoadOptions } from '@rudderstack/analytics-js/components/core/IAnalytics';
import {
  DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL,
  DEFAULT_SESSION_TIMEOUT,
} from '@rudderstack/analytics-js/constants/timeouts';
import { DEFAULT_BEACON_QUEUE_MAX_SIZE } from '@rudderstack/analytics-js/constants/sizes';

export type LoadOptionsState = {
  writeKey: Signal<string | undefined>;
  dataPlaneUrl: Signal<string | undefined>;
  loadOptions: Signal<LoadOptions>;
};

const defaultLoadOptions: LoadOptions = {
  logLevel: 'ERROR',
  configUrl: 'https://api.rudderlabs.com',
  loadIntegration: true,
  sessions: {
    autoTrack: true,
    timeout: DEFAULT_SESSION_TIMEOUT,
  },
  destSDKBaseURL: 'https://cdn.rudderlabs.com/v1.1/js-integrations',
  beaconQueueOptions: {
    maxItems: DEFAULT_BEACON_QUEUE_MAX_SIZE,
    flushQueueInterval: DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL,
  },
  sameSiteCookie: 'Lax',
  polyfillIfRequired: true,
  integrations: { All: true },
  useBeacon: false,
  lockIntegrationsVersion: false,
  uaChTrackLevel: 'none',
};

const writeKey = signal(undefined);
const dataPlaneUrl = signal(undefined);
const loadOptions = signal(R.clone(defaultLoadOptions));

const loadOptionsState: LoadOptionsState = {
  writeKey,
  dataPlaneUrl,
  loadOptions,
};

export { loadOptionsState };
