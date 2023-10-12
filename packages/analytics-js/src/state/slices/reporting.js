import { signal } from '@preact/signals-core';
const reportingState = {
  isErrorReportingEnabled: signal(false),
  isMetricsReportingEnabled: signal(false),
  errorReportingProviderPluginName: signal(undefined),
};
export { reportingState };
