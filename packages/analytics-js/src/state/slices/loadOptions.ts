import { signal } from '@preact/signals-core';
import { clone } from 'ramda';
import {
  DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL,
  DEFAULT_SESSION_TIMEOUT,
} from '@rudderstack/analytics-js/constants/timeouts';
import { DEFAULT_BEACON_QUEUE_MAX_SIZE } from '@rudderstack/analytics-js/constants/sizes';
import { DEFAULT_CONFIG_BE_URL } from '@rudderstack/analytics-js/constants/urls';
import { CookieSameSite, LoadOptions, UaChTrackLevel } from '@rudderstack/common/types/LoadOptions';
import { LogLevel } from '@rudderstack/common/types/Logger';
import { LoadOptionsState } from '@rudderstack/common/types/ApplicationState';

const defaultLoadOptions: LoadOptions = {
  logLevel: LogLevel.Error,
  configUrl: DEFAULT_CONFIG_BE_URL,
  loadIntegration: true,
  sessions: {
    autoTrack: true,
    timeout: DEFAULT_SESSION_TIMEOUT,
  },
  beaconQueueOptions: {
    maxItems: DEFAULT_BEACON_QUEUE_MAX_SIZE,
    flushQueueInterval: DEFAULT_BEACON_QUEUE_FLUSH_INTERVAL,
  },
  sameSiteCookie: CookieSameSite.Lax,
  polyfillIfRequired: true,
  integrations: { All: true },
  useBeacon: false,
  lockIntegrationsVersion: false,
  uaChTrackLevel: UaChTrackLevel.None,
  plugins: [],
  useGlobalIntegrationsConfigInEvents: false,
  bufferDataPlaneEventsUntilReady: false,
};

const loadOptionsState: LoadOptionsState = signal(clone(defaultLoadOptions));

export { loadOptionsState };
