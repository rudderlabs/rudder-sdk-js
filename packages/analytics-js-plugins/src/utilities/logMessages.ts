import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';

// CONSTANT
const INVALID_SOURCE_CONFIG_ERROR = `Invalid source configuration or source id.`;

// ERROR
const BEACON_QUEUE_SEND_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to send events batch data to the browser's beacon queue. The events will be dropped.`;

const BEACON_QUEUE_PAYLOAD_PREPARATION_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to prepare the events batch payload for delivery. The events will be dropped.`;

const BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to convert events batch object to string.`;

const BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to convert events batch object to Blob.`;

const BUGSNAG_SDK_LOAD_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to load the Bugsnag SDK.`;

const DESTINATION_NOT_SUPPORTED_ERROR = (context: string, destUserFriendlyId: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Destination ${destUserFriendlyId} is not supported.`;

const DESTINATION_SDK_LOAD_ERROR = (context: string, destUserFriendlyId: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to load script for destination ${destUserFriendlyId}.`;

const DESTINATION_INIT_ERROR = (context: string, destUserFriendlyId: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to initialize destination ${destUserFriendlyId}.`;

const DESTINATION_INTEGRATIONS_DATA_ERROR = (context: string, destUserFriendlyId: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to get integrations data for destination ${destUserFriendlyId}.`;

const DESTINATION_EVENT_FILTERING_WARNING = (
  context: string,
  eventName: Nullable<string>,
  destUserFriendlyId: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The "${eventName}" track event has been filtered for the "${destUserFriendlyId}" destination.`;

const ONETRUST_ACCESS_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to access OneTrust SDK resources. Please ensure that the OneTrust SDK is loaded successfully before RudderStack SDK.`;

const KETCH_CONSENT_COOKIE_READ_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to read the consent cookie.`;

const KETCH_CONSENT_COOKIE_PARSE_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to parse the consent cookie.`;

const DESTINATION_CONSENT_STATUS_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to determine the consent status for the destination. Please check the destination configuration and try again.`;

const STORAGE_MIGRATION_ERROR = (context: string, key: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to retrieve or parse data for ${key} from storage.`;

const EVENT_STRINGIFY_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to convert event object to string.`;

const RETRY_QUEUE_PROCESS_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Process function threw an error.`;

const EVENT_PAYLOAD_PREPARATION_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to prepare the event payload for delivery. The event will be dropped.`;

const EVENT_DELIVERY_FAILURE_ERROR_PREFIX = (context: string, url: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to deliver event to ${url}.`;

const BUGSNAG_API_KEY_VALIDATION_ERROR = (apiKey: string): string =>
  `The Bugsnag API key (${apiKey}) is invalid or not provided.`;

const DESTINATION_READY_TIMEOUT_ERROR = (timeout: number, destUserFriendlyId: string): string =>
  `A timeout of ${timeout} ms occurred while trying to check the ready status for "${destUserFriendlyId}" destination.`;

const DESTINATION_EVENT_FORWARDING_ERROR = (destUserFriendlyId: string): string =>
  `Failed to forward event to destination "${destUserFriendlyId}".`;

const BUGSNAG_SDK_LOAD_TIMEOUT_ERROR = (timeout: number): string =>
  `A timeout ${timeout} ms occurred while trying to load the Bugsnag SDK.`;

// WARN
const EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING = (
  context: string,
  payloadSize: number,
  sizeLimit: number,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The size of the event payload (${payloadSize} bytes) exceeds the maximum limit of ${sizeLimit} bytes. Events with large payloads may be dropped in the future. Please review your instrumentation to ensure that event payloads are within the size limit.`;

const EVENT_PAYLOAD_SIZE_VALIDATION_WARNING = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to validate event payload size. Please make sure that the event payload is within the size limit and is a valid JSON object.`;

// DEBUG
const BEACON_PLUGIN_EVENTS_QUEUE_DEBUG = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Sending events to data plane.`;

export {
  BEACON_QUEUE_SEND_ERROR,
  BEACON_QUEUE_PAYLOAD_PREPARATION_ERROR,
  BEACON_PLUGIN_EVENTS_QUEUE_DEBUG,
  BEACON_QUEUE_STRING_CONVERSION_FAILURE_ERROR,
  BEACON_QUEUE_BLOB_CONVERSION_FAILURE_ERROR,
  BUGSNAG_SDK_LOAD_ERROR,
  DESTINATION_NOT_SUPPORTED_ERROR,
  DESTINATION_SDK_LOAD_ERROR,
  DESTINATION_INIT_ERROR,
  DESTINATION_INTEGRATIONS_DATA_ERROR,
  DESTINATION_EVENT_FILTERING_WARNING,
  ONETRUST_ACCESS_ERROR,
  DESTINATION_CONSENT_STATUS_ERROR,
  STORAGE_MIGRATION_ERROR,
  EVENT_STRINGIFY_ERROR,
  EVENT_PAYLOAD_SIZE_CHECK_FAIL_WARNING,
  EVENT_PAYLOAD_SIZE_VALIDATION_WARNING,
  RETRY_QUEUE_PROCESS_ERROR,
  EVENT_PAYLOAD_PREPARATION_ERROR,
  EVENT_DELIVERY_FAILURE_ERROR_PREFIX,
  BUGSNAG_API_KEY_VALIDATION_ERROR,
  DESTINATION_READY_TIMEOUT_ERROR,
  DESTINATION_EVENT_FORWARDING_ERROR,
  BUGSNAG_SDK_LOAD_TIMEOUT_ERROR,
  INVALID_SOURCE_CONFIG_ERROR,
  KETCH_CONSENT_COOKIE_PARSE_ERROR,
  KETCH_CONSENT_COOKIE_READ_ERROR,
};
