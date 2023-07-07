import { state } from '@rudderstack/analytics-js/state';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { CONFIG_MANAGER } from '@rudderstack/analytics-js/constants/loggerContexts';
import {
  isErrorReportingEnabled,
  isMetricsReportingEnabled,
  getErrorReportingProviderNameFromConfig,
} from '../../utilities/statsCollection';
import { removeTrailingSlashes } from '../../utilities/url';
import { SourceConfigResponse } from '../types';
import { isUndefined } from '../../utilities/checks';
import {
  DEFAULT_ERROR_REPORTING_PROVIDER,
  ErrorReportingProvidersToPluginNameMap,
} from '../constants';

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
      const urlMatches = curScriptSrc.match(/^.*rsa?(\.min)?\.js$/);
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
        `${CONFIG_MANAGER}:: The error reporting provider "${errReportingProvider}" is not supported. Please choose one of the following supported providers: "${Object.keys(
          ErrorReportingProvidersToPluginNameMap,
        )}". The default provider "${DEFAULT_ERROR_REPORTING_PROVIDER}" will be used instead.`,
      );
    }
    state.reporting.errorReportingProviderPlugin.value =
      errReportingProviderPlugin ??
      ErrorReportingProvidersToPluginNameMap[DEFAULT_ERROR_REPORTING_PROVIDER];
  }
};

export { getSDKUrl, updateReportingState };
