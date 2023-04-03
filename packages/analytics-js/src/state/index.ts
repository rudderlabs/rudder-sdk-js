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

const state: ApplicationState = {
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

export { state };
