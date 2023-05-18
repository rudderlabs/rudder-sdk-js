import { clone } from 'ramda';
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
import { nativeDestinationsState } from './slices/nativeDestinations';
import { eventBufferState } from './slices/eventBuffer';
import { pluginsState } from './slices/plugins';
import { pagePropertiesState } from './slices/page';
import { IApplicationState } from './IApplicationState';

const defaultStateValues: IApplicationState = {
  capabilities: capabilitiesState,
  consents: consentsState,
  context: contextState,
  destinations: destinationConfigState,
  eventBuffer: eventBufferState,
  lifecycle: lifecycleState,
  loadOptions: loadOptionsState,
  metrics: metricsState,
  nativeDestinations: nativeDestinationsState,
  plugins: pluginsState,
  reporting: reportingState,
  session: sessionState,
  source: sourceConfigState,
  page: pagePropertiesState,
};

const state: IApplicationState = {
  ...clone(defaultStateValues),
};

const resetState = () => {
  state.capabilities = clone(defaultStateValues.capabilities);
  state.consents = clone(defaultStateValues.consents);
  state.context = clone(defaultStateValues.context);
  state.destinations = clone(defaultStateValues.destinations);
  state.eventBuffer = clone(defaultStateValues.eventBuffer);
  state.lifecycle = clone(defaultStateValues.lifecycle);
  state.loadOptions = clone(defaultStateValues.loadOptions);
  state.metrics = clone(defaultStateValues.metrics);
  state.nativeDestinations = clone(defaultStateValues.nativeDestinations);
  state.plugins = clone(defaultStateValues.plugins);
  state.reporting = clone(defaultStateValues.reporting);
  state.session = clone(defaultStateValues.session);
  state.source = clone(defaultStateValues.source);
  state.page = clone(defaultStateValues.page);
};

export { state, resetState };
