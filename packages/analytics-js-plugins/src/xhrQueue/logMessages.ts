import { LOG_CONTEXT_SEPARATOR } from '../shared-chunks/common';

const DELIVERY_ERROR = (
  prefix: string,
  status: number,
  url: string | URL,
  statusText?: string,
  ev?: ProgressEvent,
): string => `${prefix} with status ${status} (${statusText}) (${ev?.type ?? ''}) for URL: ${url}.`;

const REQUEST_ERROR = (
  prefix: string,
  url: string | URL,
  timeout: number,
  errMsg?: string,
  ev?: ProgressEvent,
): string =>
  `${prefix} due to timeout after ${timeout}ms or no connection (${ev?.type ?? ''}) or aborted for URL: ${url}. Original message: ${errMsg}.`;

const EVENT_DELIVERY_FAILURE_ERROR_PREFIX = (context: string, err: string, url: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to deliver event(s) to URL "${url}": ${err}.`;

export { EVENT_DELIVERY_FAILURE_ERROR_PREFIX, DELIVERY_ERROR, REQUEST_ERROR };
