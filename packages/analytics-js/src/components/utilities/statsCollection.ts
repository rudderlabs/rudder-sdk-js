import { SourceConfig } from '@rudderstack/analytics-js/state/types';

const getErrorReportingEnabledFromConfig = (sourceConfig?: SourceConfig): boolean =>
  sourceConfig?.statsCollection?.errors.enabled || false;

const getErrorReportingProviderNameFromConfig = (sourceConfig?: SourceConfig): string | undefined =>
  sourceConfig?.statsCollection?.errors.provider;

const getMetricsReportingEnabledFromConfig = (sourceConfig?: SourceConfig): boolean =>
  sourceConfig?.statsCollection?.metrics.enabled || false;

export {
  getErrorReportingEnabledFromConfig,
  getErrorReportingProviderNameFromConfig,
  getMetricsReportingEnabledFromConfig,
};
