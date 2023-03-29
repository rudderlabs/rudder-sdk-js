import { signal } from '@preact/signals-core';
import { loadOptionsState } from './slices/loadOptions';
import { sessionState } from './slices/session';
import { capabilitiesState } from './slices/capabilities';
import { reportingState } from './slices/reporting';
import { sourceConfigState } from './slices/source';
import { lifecycleState } from './slices/lifecycle';
import { destinationConfigState } from './slices/destinations';
import { consentsState } from './slices/consents';
import { metricsState } from './slices/metrics';
import { contextState } from './slices/context';

const defaultState = {
  counter: 0,
};

const globalLocalState = signal({ ...defaultState });
const remoteState = signal({ ...defaultState });

const successfullyLoadedIntegration = signal([]);
const failedToBeLoadedIntegration = signal([]);
const dynamicallyLoadedIntegrations = signal({} as any);
const config = signal({} as any);

const state = {
  globalLocalState,
  remoteState,
  successfullyLoadedIntegration,
  failedToBeLoadedIntegration,
  dynamicallyLoadedIntegrations,
  config,
  capabilities: capabilitiesState,
  consents: consentsState,
  context: contextState,
  destinations: destinationConfigState,
  lifecycle: lifecycleState,
  loadOptions: loadOptionsState,
  metrics: metricsState,
  reporting: reportingState,
  session: sessionState,
  source: sourceConfigState,
};

export { globalLocalState, remoteState, state };
