import { Signal, signal } from '@preact/signals-core';
import * as R from 'ramda';
import {
  DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL,
  DEFAULT_SESSION_TIMEOUT,
} from '@rudderstack/analytics-js/constants/timeouts';
import { DEFAULT_BEACON_QUEUE_MAX_SIZE } from '@rudderstack/analytics-js/constants/sizes';
import { LoadOptions } from '@rudderstack/analytics-js/state/types';

export type LoadOptionsState = Signal<LoadOptions>;

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

const loadOptionsState: LoadOptionsState = signal(R.clone(defaultLoadOptions));

export { loadOptionsState };
