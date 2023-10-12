import { SourceConfig } from '@rudderstack/analytics-js-common/types/Source';
declare const isErrorReportingEnabled: (sourceConfig?: SourceConfig) => boolean;
declare const getErrorReportingProviderNameFromConfig: (
  sourceConfig?: SourceConfig,
) => string | undefined;
declare const isMetricsReportingEnabled: (sourceConfig?: SourceConfig) => boolean;
export {
  isErrorReportingEnabled,
  getErrorReportingProviderNameFromConfig,
  isMetricsReportingEnabled,
};
