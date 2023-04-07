import { signal, Signal } from '@preact/signals-core';

export type ReportingState = {
  isErrorReportingEnabled: Signal<boolean>;
  isMetricsReportingEnabled: Signal<boolean>;
};

const reportingState: ReportingState = {
  isErrorReportingEnabled: signal(false),
  isMetricsReportingEnabled: signal(false),
};

export { reportingState };
