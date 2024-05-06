import type { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import {
  type StorageType,
  SUPPORTED_STORAGE_TYPES,
} from '@rudderstack/analytics-js-common/types/Storage';
import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
import type {
  DeliveryType,
  StorageStrategy,
} from '@rudderstack/analytics-js-common/types/LoadOptions';

// CONSTANT
const SOURCE_CONFIG_OPTION_ERROR = `"getSourceConfig" must be a function. Please make sure that it is defined and returns a valid source configuration object.`;
const INTG_CDN_BASE_URL_ERROR = `Failed to load the SDK as the CDN base URL for integrations is not valid.`;
const PLUGINS_CDN_BASE_URL_ERROR = `Failed to load the SDK as the CDN base URL for plugins is not valid.`;
const DATA_PLANE_URL_ERROR = `Failed to load the SDK as the data plane URL could not be determined. Please check that the data plane URL is set correctly and try again.`;
const SOURCE_CONFIG_RESOLUTION_ERROR = `Unable to process/parse source configuration response.`;
const XHR_PAYLOAD_PREP_ERROR = `Failed to prepare data for the request.`;
const EVENT_OBJECT_GENERATION_ERROR = `Failed to generate the event object.`;
const PLUGIN_EXT_POINT_MISSING_ERROR = `Failed to invoke plugin because the extension point name is missing.`;
const PLUGIN_EXT_POINT_INVALID_ERROR = `Failed to invoke plugin because the extension point name is invalid.`;

// ERROR
const UNSUPPORTED_CONSENT_MANAGER_ERROR = (
  context: string,
  selectedConsentManager: string,
  consentManagersToPluginNameMap: Record<string, PluginName>,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The consent manager "${selectedConsentManager}" is not supported. Please choose one of the following supported consent managers: "${Object.keys(
    consentManagersToPluginNameMap,
  )}".`;

const REPORTING_PLUGIN_INIT_FAILURE_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to initialize the error reporting plugin.`;

const NOTIFY_FAILURE_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to notify the error.`;

const PLUGIN_NAME_MISSING_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Plugin name is missing.`;

const PLUGIN_ALREADY_EXISTS_ERROR = (context: string, pluginName: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" already exists.`;

const PLUGIN_NOT_FOUND_ERROR = (context: string, pluginName: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" not found.`;

const PLUGIN_ENGINE_BUG_ERROR = (context: string, pluginName: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" not found in plugins but found in byName. This indicates a bug in the plugin engine. Please report this issue to the development team.`;

const PLUGIN_DEPS_ERROR = (context: string, pluginName: string, notExistDeps: string[]): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Plugin "${pluginName}" could not be loaded because some of its dependencies "${notExistDeps}" do not exist.`;

const PLUGIN_INVOCATION_ERROR = (
  context: string,
  extPoint: string | undefined,
  pluginName: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to invoke the "${extPoint}" extension point of plugin "${pluginName}".`;

const STORAGE_UNAVAILABILITY_ERROR_PREFIX = (context: string, storageType: StorageType): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The "${storageType}" storage type is `;

const SOURCE_CONFIG_FETCH_ERROR = (reason: Error | undefined): string =>
  `Failed to fetch the source config. Reason: ${reason}`;

const WRITE_KEY_VALIDATION_ERROR = (writeKey?: string): string =>
  `The write key "${writeKey}" is invalid. It must be a non-empty string. Please check that the write key is correct and try again.`;

const DATA_PLANE_URL_VALIDATION_ERROR = (dataPlaneUrl: string): string =>
  `The data plane URL "${dataPlaneUrl}" is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.`;

const READY_API_CALLBACK_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The callback is not a function.`;

const XHR_DELIVERY_ERROR = (
  prefix: string,
  status: number,
  statusText: string,
  url: string,
): string => `${prefix} with status: ${status}, ${statusText} for URL: ${url}.`;

const XHR_REQUEST_ERROR = (prefix: string, e: ProgressEvent | undefined, url: string): string =>
  `${prefix} due to timeout or no connection (${e ? e.type : ''}) for URL: ${url}.`;

const XHR_SEND_ERROR = (prefix: string, url: string): string => `${prefix} for URL: ${url}`;

const STORE_DATA_SAVE_ERROR = (key: string): string =>
  `Failed to save the value for "${key}" to storage`;

const STORE_DATA_FETCH_ERROR = (key: string): string =>
  `Failed to retrieve or parse data for "${key}" from storage`;

const DATA_SERVER_URL_INVALID_ERROR = (url: string) =>
  `The server side cookies functionality is disabled automatically as the provided data server URL, ${url} is invalid.`;

const DATA_SERVER_REQUEST_FAIL_ERROR = (status?: number) =>
  `The server responded with status ${status} while setting the cookies. As a fallback, the cookies will be set from the client side.`;
const FAILED_SETTING_COOKIE_FROM_SERVER_ERROR = (key: string) =>
  `The server failed to set the ${key} cookie.`;
const FAILED_SETTING_COOKIE_FROM_SERVER_GLOBAL_ERROR = `setServerSideCookie method failed`;

// WARNING
const STORAGE_TYPE_VALIDATION_WARNING = (
  context: string,
  storageType: any,
  defaultStorageType: StorageType,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The storage type "${storageType}" is not supported. Please choose one of the following supported types: "${SUPPORTED_STORAGE_TYPES}". The default type "${defaultStorageType}" will be used instead.`;

const UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING = (
  context: string,
  selectedErrorReportingProvider: string | undefined,
  errorReportingProvidersToPluginNameMap: Record<string, PluginName>,
  defaultProvider: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The error reporting provider "${selectedErrorReportingProvider}" is not supported. Please choose one of the following supported providers: "${Object.keys(
    errorReportingProvidersToPluginNameMap,
  )}". The default provider "${defaultProvider}" will be used instead.`;

const UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING = (
  context: string,
  selectedStorageEncryptionVersion: string | undefined,
  storageEncryptionVersionsToPluginNameMap: Record<string, PluginName>,
  defaultVersion: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The storage encryption version "${selectedStorageEncryptionVersion}" is not supported. Please choose one of the following supported versions: "${Object.keys(
    storageEncryptionVersionsToPluginNameMap,
  )}". The default version "${defaultVersion}" will be used instead.`;

const STORAGE_DATA_MIGRATION_OVERRIDE_WARNING = (
  context: string,
  storageEncryptionVersion: string | undefined,
  defaultVersion: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The storage data migration has been disabled because the configured storage encryption version (${storageEncryptionVersion}) is not the latest (${defaultVersion}). To enable storage data migration, please update the storage encryption version to the latest version.`;

const UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING = (
  context: string,
  selectedResidencyServerRegion: string | undefined,
  defaultRegion: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The residency server region "${selectedResidencyServerRegion}" is not supported. Please choose one of the following supported regions: "US, EU". The default region "${defaultRegion}" will be used instead.`;

const RESERVED_KEYWORD_WARNING = (
  context: string,
  property: string,
  parentKeyPath: string,
  reservedElements: string[],
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The "${property}" property defined under "${parentKeyPath}" is a reserved keyword. Please choose a different property name to avoid conflicts with reserved keywords (${reservedElements}).`;

const INVALID_CONTEXT_OBJECT_WARNING = (logContext: string): string =>
  `${logContext}${LOG_CONTEXT_SEPARATOR}Please make sure that the "context" property in the event API's "options" argument is a valid object literal with key-value pairs.`;

const UNSUPPORTED_BEACON_API_WARNING = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The Beacon API is not supported by your browser. The events will be sent using XHR instead.`;

const TIMEOUT_NOT_NUMBER_WARNING = (
  context: string,
  timeout: number | undefined,
  defaultValue: number,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The session timeout value "${timeout}" is not a number. The default timeout of ${defaultValue} ms will be used instead.`;

const TIMEOUT_ZERO_WARNING = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The session timeout value is 0, which disables the automatic session tracking feature. If you want to enable session tracking, please provide a positive integer value for the timeout.`;

const TIMEOUT_NOT_RECOMMENDED_WARNING = (
  context: string,
  timeout: number,
  minTimeout: number,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The session timeout value ${timeout} ms is less than the recommended minimum of ${minTimeout} ms. Please consider increasing the timeout value to ensure optimal performance and reliability.`;

const INVALID_SESSION_ID_WARNING = (
  context: string,
  sessionId: number | undefined,
  minSessionIdLength: number,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The provided session ID (${sessionId}) is either invalid, not a positive integer, or not at least "${minSessionIdLength}" digits long. A new session ID will be auto-generated instead.`;

const STORAGE_QUOTA_EXCEEDED_WARNING = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The storage is either full or unavailable, so the data will not be persisted. Switching to in-memory storage.`;

const STORAGE_UNAVAILABLE_WARNING = (
  context: string,
  entry: string,
  selectedStorageType: string,
  finalStorageType: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The storage type "${selectedStorageType}" is not available for entry "${entry}". The SDK will initialize the entry with "${finalStorageType}" storage type instead.`;

const WRITE_KEY_NOT_A_STRING_ERROR = (context: string, writeKey: string | undefined): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The write key "${writeKey}" is not a string. Please check that the write key is correct and try again.`;

const EMPTY_GROUP_CALL_ERROR = (context: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The group() method must be called with at least one argument.`;

const READY_CALLBACK_INVOKE_ERROR = `Failed to invoke the ready callback`;

const API_CALLBACK_INVOKE_ERROR = `API Callback Invocation Failed`;
const NATIVE_DEST_PLUGIN_INITIALIZE_ERROR = `NativeDestinationQueuePlugin initialization failed`;
const DATAPLANE_PLUGIN_INITIALIZE_ERROR = `XhrQueuePlugin initialization failed`;
const DMT_PLUGIN_INITIALIZE_ERROR = `DeviceModeTransformationPlugin initialization failed`;

const NATIVE_DEST_PLUGIN_ENQUEUE_ERROR = `NativeDestinationQueuePlugin event enqueue failed`;
const DATAPLANE_PLUGIN_ENQUEUE_ERROR = `XhrQueuePlugin event enqueue failed`;

const INVALID_CONFIG_URL_WARNING = (context: string, configUrl: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The provided config URL "${configUrl}" is invalid. Using the default value instead.`;

const POLYFILL_SCRIPT_LOAD_ERROR = (scriptId: string, url: string): string =>
  `Failed to load the polyfill script with ID "${scriptId}" from URL ${url}.`;

const COOKIE_DATA_ENCODING_ERROR = `Failed to encode the cookie data.`;

const UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY = (
  context: string,
  selectedStrategy: StorageStrategy | undefined,
  defaultStrategy: StorageStrategy,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The pre-consent storage strategy "${selectedStrategy}" is not supported. Please choose one of the following supported strategies: "none, session, anonymousId". The default strategy "${defaultStrategy}" will be used instead.`;

const UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE = (
  context: string,
  selectedDeliveryType: DeliveryType | undefined,
  defaultDeliveryType: DeliveryType,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The pre-consent events delivery type "${selectedDeliveryType}" is not supported. Please choose one of the following supported types: "immediate, buffer". The default type "${defaultDeliveryType}" will be used instead.`;

// DEBUG

export {
  UNSUPPORTED_CONSENT_MANAGER_ERROR,
  UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING,
  UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING,
  STORAGE_DATA_MIGRATION_OVERRIDE_WARNING,
  UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING,
  RESERVED_KEYWORD_WARNING,
  INVALID_CONTEXT_OBJECT_WARNING,
  UNSUPPORTED_BEACON_API_WARNING,
  TIMEOUT_NOT_NUMBER_WARNING,
  TIMEOUT_ZERO_WARNING,
  TIMEOUT_NOT_RECOMMENDED_WARNING,
  INVALID_SESSION_ID_WARNING,
  REPORTING_PLUGIN_INIT_FAILURE_ERROR,
  NOTIFY_FAILURE_ERROR,
  PLUGIN_NAME_MISSING_ERROR,
  PLUGIN_ALREADY_EXISTS_ERROR,
  PLUGIN_NOT_FOUND_ERROR,
  PLUGIN_ENGINE_BUG_ERROR,
  PLUGIN_DEPS_ERROR,
  PLUGIN_INVOCATION_ERROR,
  STORAGE_QUOTA_EXCEEDED_WARNING,
  STORAGE_UNAVAILABLE_WARNING,
  STORAGE_UNAVAILABILITY_ERROR_PREFIX,
  SOURCE_CONFIG_FETCH_ERROR,
  SOURCE_CONFIG_OPTION_ERROR,
  INTG_CDN_BASE_URL_ERROR,
  PLUGINS_CDN_BASE_URL_ERROR,
  DATA_PLANE_URL_ERROR,
  WRITE_KEY_VALIDATION_ERROR,
  DATA_PLANE_URL_VALIDATION_ERROR,
  READY_API_CALLBACK_ERROR,
  XHR_DELIVERY_ERROR,
  XHR_REQUEST_ERROR,
  XHR_SEND_ERROR,
  XHR_PAYLOAD_PREP_ERROR,
  STORE_DATA_SAVE_ERROR,
  STORE_DATA_FETCH_ERROR,
  EVENT_OBJECT_GENERATION_ERROR,
  PLUGIN_EXT_POINT_MISSING_ERROR,
  PLUGIN_EXT_POINT_INVALID_ERROR,
  STORAGE_TYPE_VALIDATION_WARNING,
  WRITE_KEY_NOT_A_STRING_ERROR,
  EMPTY_GROUP_CALL_ERROR,
  READY_CALLBACK_INVOKE_ERROR,
  API_CALLBACK_INVOKE_ERROR,
  INVALID_CONFIG_URL_WARNING,
  POLYFILL_SCRIPT_LOAD_ERROR,
  COOKIE_DATA_ENCODING_ERROR,
  UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY,
  UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE,
  SOURCE_CONFIG_RESOLUTION_ERROR,
  NATIVE_DEST_PLUGIN_INITIALIZE_ERROR,
  DATAPLANE_PLUGIN_INITIALIZE_ERROR,
  DMT_PLUGIN_INITIALIZE_ERROR,
  NATIVE_DEST_PLUGIN_ENQUEUE_ERROR,
  DATAPLANE_PLUGIN_ENQUEUE_ERROR,
  DATA_SERVER_URL_INVALID_ERROR,
  DATA_SERVER_REQUEST_FAIL_ERROR,
  FAILED_SETTING_COOKIE_FROM_SERVER_ERROR,
  FAILED_SETTING_COOKIE_FROM_SERVER_GLOBAL_ERROR,
};
