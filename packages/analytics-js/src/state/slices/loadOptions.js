import { signal } from '@preact/signals-core';
import { clone } from 'ramda';
import {
  DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS,
  DEFAULT_SESSION_TIMEOUT_MS,
} from '../../constants/timeouts';
import { DEFAULT_CONFIG_BE_URL } from '../../constants/urls';
import { DEFAULT_STORAGE_ENCRYPTION_VERSION } from '../../components/configManager/constants';
const defaultLoadOptions = {
  logLevel: 'ERROR',
  configUrl: DEFAULT_CONFIG_BE_URL,
  loadIntegration: true,
  sessions: {
    autoTrack: true,
    timeout: DEFAULT_SESSION_TIMEOUT_MS,
  },
  sameSiteCookie: 'Lax',
  polyfillIfRequired: true,
  integrations: { All: true },
  useBeacon: false,
  beaconQueueOptions: {},
  destinationsQueueOptions: {},
  queueOptions: {},
  lockIntegrationsVersion: false,
  uaChTrackLevel: 'none',
  plugins: [],
  useGlobalIntegrationsConfigInEvents: false,
  bufferDataPlaneEventsUntilReady: false,
  dataPlaneEventsBufferTimeout: DEFAULT_DATA_PLANE_EVENTS_BUFFER_TIMEOUT_MS,
  storage: {
    encryption: {
      version: DEFAULT_STORAGE_ENCRYPTION_VERSION,
    },
    migrate: false,
  },
  sendAdblockPageOptions: {},
};
const loadOptionsState = signal(clone(defaultLoadOptions));
export { loadOptionsState };
