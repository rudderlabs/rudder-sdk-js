import { state } from '@rudderstack/analytics-js/state';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { PluginName } from '../../pluginsManager/types';
import {
  isErrorReportingEnabled,
  isMetricsReportingEnabled,
  getErrorReportingProviderNameFromConfig,
} from '../../utilities/statsCollection';
import { removeTrailingSlashes } from '../../utilities/url';
import { SourceConfigResponse, ErrorReportingProvidersToPluginNameMap } from '../types';
import { isUndefined } from '../../utilities/checks';

/**
 * Determines the SDK url
 * @returns sdkURL
 */
const getSDKUrl = (): string | undefined => {
  const scripts = document.getElementsByTagName('script');
  let sdkURL: string | undefined;
  const scriptList = Array.prototype.slice.call(scripts);

  scriptList.some(script => {
    const curScriptSrc = removeTrailingSlashes(script.getAttribute('src'));
    if (curScriptSrc) {
      const urlMatches = curScriptSrc.match(/^.*rudder-analytics?(\.min)?\.js$/);
      if (urlMatches) {
        sdkURL = curScriptSrc;
        return true;
      }
    }
    return false;
  });

  // TODO: Return the URL object instead of the plain URL string
  return sdkURL;
};

/**
 * Updates the reporting state variables from the source config data
 * @param res Source config
 * @param logger Logger instance
 */
const updateReportingState = (res: SourceConfigResponse, logger?: ILogger): void => {
  state.reporting.isErrorReportingEnabled.value = isErrorReportingEnabled(res.source.config);
  state.reporting.isMetricsReportingEnabled.value = isMetricsReportingEnabled(res.source.config);

  if (state.reporting.isErrorReportingEnabled.value) {
    const errReportingProvider = getErrorReportingProviderNameFromConfig(res.source.config);

    // Get the corresponding plugin name of the selected error reporting provider from the supported error reporting providers
    const errReportingProviderPlugin = errReportingProvider
      ? ErrorReportingProvidersToPluginNameMap[errReportingProvider]
      : undefined;
    if (!isUndefined(errReportingProvider) && !errReportingProviderPlugin) {
      // set the default error reporting provider
      logger?.warn(
        `The configured error reporting provider "${errReportingProvider}" is not supported. Supported providers are ${Object.keys(
          ErrorReportingProvidersToPluginNameMap,
        )}. Using default provider (${errReportingProviderPlugin}).`,
      );
    }
    state.reporting.errorReportingProviderPlugin.value =
      errReportingProviderPlugin ?? PluginName.Bugsnag;
  }
};

export { getSDKUrl, updateReportingState };
