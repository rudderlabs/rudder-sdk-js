import { signal } from '@preact/signals-core';
import type { ReportingState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const reportingState: ReportingState = {
  isErrorReportingEnabled: signal(false),
  isMetricsReportingEnabled: signal(false),
  errorReportingProviderPluginName: signal(undefined),
  isErrorReportingPluginLoaded: signal(false),
};

export { reportingState };
