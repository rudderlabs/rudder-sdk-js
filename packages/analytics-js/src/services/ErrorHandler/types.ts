import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { IPluginEngine } from '@rudderstack/analytics-js/services/PluginEngine/types';
// eslint-disable-next-line import/no-cycle
import { IExternalSrcLoader } from '@rudderstack/analytics-js/services/ExternalSrcLoader/types';

export type SDKError = Error | Event | string | unknown;

export interface IErrorHandler {
  logger?: ILogger;
  pluginEngine?: IPluginEngine;
  init(externalSrcLoader: IExternalSrcLoader): void;
  onError(
    error: SDKError,
    context?: string,
    customMessage?: string,
    shouldAlwaysThrow?: boolean,
  ): void;
  leaveBreadcrumb(breadcrumb: string): void;
  notifyError(error: Error): void;
}
