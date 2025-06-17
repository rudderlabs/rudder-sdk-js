import { clone } from 'ramda';
import type { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { loadOptionsState } from './slices/loadOptions';
import { sessionState } from './slices/session';
import { capabilitiesState } from './slices/capabilities';
import { reportingState } from './slices/reporting';
import { sourceConfigState } from './slices/source';
import { lifecycleState } from './slices/lifecycle';
import { consentsState } from './slices/consents';
import { metricsState } from './slices/metrics';
import { contextState } from './slices/context';
import { nativeDestinationsState } from './slices/nativeDestinations';
import { eventBufferState } from './slices/eventBuffer';
import { pluginsState } from './slices/plugins';
import { storageState } from './slices/storage';
import { serverSideCookiesState } from './slices/serverCookies';
import { dataPlaneEventsState } from './slices/dataPlaneEvents';
import { autoTrackState } from './slices/autoTrack';
import { customIntegrationsState } from './slices/customIntegrations';

const defaultStateValues: ApplicationState = {
  capabilities: capabilitiesState,
  consents: consentsState,
  context: contextState,
  eventBuffer: eventBufferState,
  lifecycle: lifecycleState,
  loadOptions: loadOptionsState,
  metrics: metricsState,
  nativeDestinations: nativeDestinationsState,
  customIntegrations: customIntegrationsState,
  plugins: pluginsState,
  reporting: reportingState,
  session: sessionState,
  source: sourceConfigState,
  storage: storageState,
  serverCookies: serverSideCookiesState,
  dataPlaneEvents: dataPlaneEventsState,
  autoTrack: autoTrackState,
};

const state: ApplicationState = {
  ...clone(defaultStateValues),
};

const resetState = () => {
  state.capabilities = clone(defaultStateValues.capabilities);
  state.consents = clone(defaultStateValues.consents);
  state.context = clone(defaultStateValues.context);
  state.eventBuffer = clone(defaultStateValues.eventBuffer);
  state.lifecycle = clone(defaultStateValues.lifecycle);
  state.loadOptions = clone(defaultStateValues.loadOptions);
  state.metrics = clone(defaultStateValues.metrics);
  state.nativeDestinations = clone(defaultStateValues.nativeDestinations);
  state.plugins = clone(defaultStateValues.plugins);
  state.reporting = clone(defaultStateValues.reporting);
  state.session = clone(defaultStateValues.session);
  state.source = clone(defaultStateValues.source);
  state.storage = clone(defaultStateValues.storage);
  state.serverCookies = clone(defaultStateValues.serverCookies);
  state.dataPlaneEvents = clone(defaultStateValues.dataPlaneEvents);
  state.autoTrack = clone(defaultStateValues.autoTrack);
};

export { state, resetState };
