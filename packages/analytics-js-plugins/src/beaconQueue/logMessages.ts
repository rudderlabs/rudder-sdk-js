import { LOG_CONTEXT_SEPARATOR } from '../shared-chunks/common';

const BEACON_PLUGIN_EVENTS_QUEUE_DEBUG = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Sending events to data plane.`;

const BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to convert events batch object to string.`;

const BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to convert events batch object to Blob.`;

const BEACON_QUEUE_SEND_ERROR = (context: string, url: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}${BEACON_QUEUE_DELIVERY_ERROR(url)}`;

const BEACON_QUEUE_DELIVERY_ERROR = (url: string): string =>
  `Failed to send events batch data to the browser's beacon queue for URL ${url}. The events will be retried again.`;

export {
  BEACON_PLUGIN_EVENTS_QUEUE_DEBUG,
  BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR,
  BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR,
  BEACON_QUEUE_SEND_ERROR,
  BEACON_QUEUE_DELIVERY_ERROR,
};
