import { signal, Signal } from '@preact/signals-core';
import { PluginName } from '@rudderstack/analytics-js/components/pluginsManager/types';

export type ReportingState = {
  isErrorReportingEnabled: Signal<boolean>;
  isMetricsReportingEnabled: Signal<boolean>;
  errorCollectionProviderPlugin: Signal<PluginName | undefined>;
};

const reportingState: ReportingState = {
  isErrorReportingEnabled: signal(false),
  isMetricsReportingEnabled: signal(false),
  errorCollectionProviderPlugin: signal(undefined),
};

export { reportingState };
