import { Signal, signal } from '@preact/signals-core';
import { clone } from 'ramda';
import { DEFAULT_SESSION_TIMEOUT } from '@rudderstack/analytics-js/constants/timeouts';
import {
  CookieSameSite,
  LoadOptions,
  LogLevel,
  UaChTrackLevel,
} from '@rudderstack/analytics-js/state/types';
import { DEFAULT_CONFIG_BE_URL } from '@rudderstack/analytics-js/constants/urls';
import { DEFAULT_STORAGE_ENCRYPTION_VERSION } from '@rudderstack/analytics-js/components/configManager/constants';

export type LoadOptionsState = Signal<LoadOptions>;

const defaultLoadOptions: LoadOptions = {
  logLevel: LogLevel.Error,
  configUrl: DEFAULT_CONFIG_BE_URL,
  loadIntegration: true,
  sessions: {
    autoTrack: true,
    timeout: DEFAULT_SESSION_TIMEOUT,
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
  storage: {
    encryption: {
      version: DEFAULT_STORAGE_ENCRYPTION_VERSION,
    },
    migrate: false,
  },
};

const loadOptionsState: LoadOptionsState = signal(clone(defaultLoadOptions));

export { loadOptionsState };
