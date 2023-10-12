import {
  IXHRRequestOptions,
  ResponseDetails,
} from '@rudderstack/analytics-js-common/types/HttpClient';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
declare const DEFAULT_XHR_REQUEST_OPTIONS: Partial<IXHRRequestOptions>;
/**
 * Utility to create request configuration based on default options
 */
declare const createXhrRequestOptions: (
  url: string,
  options?: Partial<IXHRRequestOptions>,
  basicAuthHeader?: string,
) => IXHRRequestOptions;
/**
 * Utility implementation of XHR, fetch cannot be used as it requires explicit
 * origin allowed values and not wildcard for CORS requests with credentials and
 * this is not supported by our sourceConfig API
 */
declare const xhrRequest: (
  options: IXHRRequestOptions,
  timeout?: number,
  logger?: ILogger,
) => Promise<ResponseDetails>;
export { createXhrRequestOptions, xhrRequest, DEFAULT_XHR_REQUEST_OPTIONS };
