import { PluginName } from '@rudderstack/common/types/PluginsManager';

const DEFAULT_ERROR_REPORTING_PROVIDER = 'bugsnag';

export const ConsentManagersToPluginNameMap: Record<string, PluginName> = {
  oneTrust: PluginName.OneTrust,
};

export const ErrorReportingProvidersToPluginNameMap: Record<string, PluginName> = {
  [DEFAULT_ERROR_REPORTING_PROVIDER]: PluginName.Bugsnag,
};

export { DEFAULT_ERROR_REPORTING_PROVIDER };
