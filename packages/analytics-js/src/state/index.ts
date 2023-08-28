import { clone } from 'ramda';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { loadOptionsState } from '@rudderstack/analytics-js/state/slices/loadOptions';
import { sessionState } from '@rudderstack/analytics-js/state/slices/session';
import { capabilitiesState } from '@rudderstack/analytics-js/state/slices/capabilities';
import { reportingState } from '@rudderstack/analytics-js/state/slices/reporting';
import { sourceConfigState } from '@rudderstack/analytics-js/state/slices/source';
import { lifecycleState } from '@rudderstack/analytics-js/state/slices/lifecycle';
import { consentsState } from '@rudderstack/analytics-js/state/slices/consents';
import { metricsState } from '@rudderstack/analytics-js/state/slices/metrics';
import { contextState } from '@rudderstack/analytics-js/state/slices/context';
import { nativeDestinationsState } from '@rudderstack/analytics-js/state/slices/nativeDestinations';
import { eventBufferState } from '@rudderstack/analytics-js/state/slices/eventBuffer';
import { pluginsState } from '@rudderstack/analytics-js/state/slices/plugins';
import { pagePropertiesState } from '@rudderstack/analytics-js/state/slices/page';
import { storageState } from '@rudderstack/analytics-js/state/slices/storage';

const defaultStateValues: ApplicationState = {
  capabilities: capabilitiesState,
  consents: consentsState,
  context: contextState,
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
  storage: storageState,
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
  state.page = clone(defaultStateValues.page);
  state.storage = clone(defaultStateValues.storage);
};

export { state, resetState };
