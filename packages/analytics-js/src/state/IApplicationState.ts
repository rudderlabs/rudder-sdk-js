import { CapabilitiesState } from './slices/capabilities';
import { ConsentsState } from './slices/consents';
import { LoadOptionsState } from './slices/loadOptions';
import { SessionState } from './slices/session';
import { ReportingState } from './slices/reporting';
import { SourceConfigState } from './slices/source';
import { LifecycleState } from './slices/lifecycle';
import { MetricsState } from './slices/metrics';
import { ContextState } from './slices/context';
import { NativeDestinationsState } from './slices/nativeDestinations';
import { EventBufferState } from './slices/eventBuffer';
import { PluginsState } from './slices/plugins';
import { PagePropertiesState } from './slices/page';
import { StorageState } from './slices/storage';

export interface IApplicationState {
  capabilities: CapabilitiesState;
  consents: ConsentsState;
  loadOptions: LoadOptionsState;
  session: SessionState;
  reporting: ReportingState;
  source: SourceConfigState;
  lifecycle: LifecycleState;
  metrics: MetricsState;
  context: ContextState;
  nativeDestinations: NativeDestinationsState;
  eventBuffer: EventBufferState;
  plugins: PluginsState;
  page: PagePropertiesState;
  storage: StorageState;
}
