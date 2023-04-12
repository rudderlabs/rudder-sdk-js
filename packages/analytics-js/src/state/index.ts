import { clone } from 'ramda';
import { LoadOptionsState, loadOptionsState } from './slices/loadOptions';
import { SessionState, sessionState } from './slices/session';
import { capabilitiesState, CapabilitiesState } from './slices/capabilities';
import { ReportingState, reportingState } from './slices/reporting';
import { SourceConfigState, sourceConfigState } from './slices/source';
import { lifecycleState, LifecycleState } from './slices/lifecycle';
import { DestinationConfigState, destinationConfigState } from './slices/destinations';
import { consentsState, ConsentsState } from './slices/consents';
import { MetricsState, metricsState } from './slices/metrics';
import { contextState, ContextState } from './slices/context';
import { nativeDestinationsState, NativeDestinationsState } from './slices/nativeDestinations';
import { EventBufferState, eventBufferState } from './slices/eventBuffer';
import { pluginsState, PluginsState } from './slices/plugins';

export type ApplicationState = {
  capabilities: CapabilitiesState;
  consents: ConsentsState;
  loadOptions: LoadOptionsState;
  session: SessionState;
  reporting: ReportingState;
  source: SourceConfigState;
  lifecycle: LifecycleState;
  destinations: DestinationConfigState;
  metrics: MetricsState;
  context: ContextState;
  nativeDestinations: NativeDestinationsState;
  eventBuffer: EventBufferState;
  plugins: PluginsState;
};

const defaultStateValues: ApplicationState = {
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
};

const state: ApplicationState = {
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
};

export { state, resetState };
