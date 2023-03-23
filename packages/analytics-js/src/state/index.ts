import { IRudderStackGlobals } from '@rudderstack/analytics-js/components/core/IRudderStackGlobals';
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
};

const state: ApplicationState = {
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

// TODO: How to support multiple instances? Use writeKey as key per instance?
// TODO: move to other file and then call in analytics class on mount to export the state
const setExposedGlobal = (keyName: string, value?: any) => {
  if (!(window as any).RudderStackGlobals) {
    (window as any).RudderStackGlobals = {} as IRudderStackGlobals;
  }

  (window as any).RudderStackGlobals[keyName] = value;
};

export { setExposedGlobal, state };
