import { SourceConfig } from '@rudderstack/analytics-js/state/types';

const isErrorReportingEnabled = (sourceConfig?: SourceConfig): boolean =>
  sourceConfig?.statsCollection?.errors.enabled === true;

const getErrorReportingProviderNameFromConfig = (sourceConfig?: SourceConfig): string | undefined =>
  sourceConfig?.statsCollection?.errors.provider;

const isMetricsReportingEnabled = (sourceConfig?: SourceConfig): boolean =>
  sourceConfig?.statsCollection?.metrics.enabled === true;

export {
  isErrorReportingEnabled,
  getErrorReportingProviderNameFromConfig,
  isMetricsReportingEnabled,
};
