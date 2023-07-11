import { signal } from '@preact/signals-core';
import { ReportingState } from '@rudderstack/analytics-js-common/types/ApplicationState';

const reportingState: ReportingState = {
  isErrorReportingEnabled: signal(false),
  isMetricsReportingEnabled: signal(false),
  errorReportingProviderPlugin: signal(undefined),
};

export { reportingState };
