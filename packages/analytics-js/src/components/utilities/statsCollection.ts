import type { SourceConfig } from '@rudderstack/analytics-js-common/types/Source';

const isErrorReportingEnabled = (sourceConfig?: SourceConfig): boolean =>
  sourceConfig?.statsCollection?.errors?.enabled === true;

const isMetricsReportingEnabled = (sourceConfig?: SourceConfig): boolean =>
  sourceConfig?.statsCollection?.metrics?.enabled === true;

export { isErrorReportingEnabled, isMetricsReportingEnabled };
