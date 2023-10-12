import { PluginName } from '@rudderstack/analytics-js-common/types/PluginsManager';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import { DeliveryType, StorageStrategy } from '@rudderstack/analytics-js-common/types/LoadOptions';
declare const SOURCE_CONFIG_OPTION_ERROR =
  '"getSourceConfig" must be a function. Please make sure that it is defined and returns a valid source configuration object.';
declare const INTG_CDN_BASE_URL_ERROR =
  'Failed to load the SDK as the CDN base URL for integrations is not valid.';
declare const PLUGINS_CDN_BASE_URL_ERROR =
  'Failed to load the SDK as the CDN base URL for plugins is not valid.';
declare const DATA_PLANE_URL_ERROR =
  'Failed to load the SDK as the data plane URL could not be determined. Please check that the data plane URL is set correctly and try again.';
declare const XHR_PAYLOAD_PREP_ERROR = 'Failed to prepare data for the request.';
declare const EVENT_OBJECT_GENERATION_ERROR = 'Failed to generate the event object.';
declare const PLUGIN_EXT_POINT_MISSING_ERROR =
  'Failed to invoke plugin because the extension point name is missing.';
declare const PLUGIN_EXT_POINT_INVALID_ERROR =
  'Failed to invoke plugin because the extension point name is invalid.';
declare const UNSUPPORTED_CONSENT_MANAGER_ERROR: (
  context: string,
  selectedConsentManager: string,
  consentManagersToPluginNameMap: Record<string, PluginName>,
) => string;
declare const REPORTING_PLUGIN_INIT_FAILURE_ERROR: (context: string) => string;
declare const NOTIFY_FAILURE_ERROR: (context: string) => string;
declare const PLUGIN_NAME_MISSING_ERROR: (context: string) => string;
declare const PLUGIN_ALREADY_EXISTS_ERROR: (context: string, pluginName: string) => string;
declare const PLUGIN_NOT_FOUND_ERROR: (context: string, pluginName: string) => string;
declare const PLUGIN_ENGINE_BUG_ERROR: (context: string, pluginName: string) => string;
declare const PLUGIN_DEPS_ERROR: (
  context: string,
  pluginName: string,
  notExistDeps: string[],
) => string;
declare const PLUGIN_INVOCATION_ERROR: (
  context: string,
  extPoint: string | undefined,
  pluginName: string,
) => string;
declare const STORAGE_UNAVAILABILITY_ERROR_PREFIX: (
  context: string,
  storageType: StorageType,
) => string;
declare const SOURCE_CONFIG_FETCH_ERROR: (reason: Error | undefined) => string;
declare const WRITE_KEY_VALIDATION_ERROR: (writeKey?: string) => string;
declare const DATA_PLANE_URL_VALIDATION_ERROR: (dataPlaneUrl: string) => string;
declare const READY_API_CALLBACK_ERROR: (context: string) => string;
declare const XHR_DELIVERY_ERROR: (
  prefix: string,
  status: number,
  statusText: string,
  url: string,
) => string;
declare const XHR_REQUEST_ERROR: (
  prefix: string,
  e: ProgressEvent | undefined,
  url: string,
) => string;
declare const XHR_SEND_ERROR: (prefix: string, url: string) => string;
declare const STORE_DATA_SAVE_ERROR: (key: string) => string;
declare const STORE_DATA_FETCH_ERROR: (key: string) => string;
declare const STORAGE_TYPE_VALIDATION_WARNING: (
  context: string,
  storageType: any,
  defaultStorageType: StorageType,
) => string;
declare const UNSUPPORTED_ERROR_REPORTING_PROVIDER_WARNING: (
  context: string,
  selectedErrorReportingProvider: string | undefined,
  errorReportingProvidersToPluginNameMap: Record<string, PluginName>,
  defaultProvider: string,
) => string;
declare const UNSUPPORTED_STORAGE_ENCRYPTION_VERSION_WARNING: (
  context: string,
  selectedStorageEncryptionVersion: string | undefined,
  storageEncryptionVersionsToPluginNameMap: Record<string, PluginName>,
  defaultVersion: string,
) => string;
declare const STORAGE_DATA_MIGRATION_OVERRIDE_WARNING: (
  context: string,
  storageEncryptionVersion: string | undefined,
  defaultVersion: string,
) => string;
declare const UNSUPPORTED_RESIDENCY_SERVER_REGION_WARNING: (
  context: string,
  selectedResidencyServerRegion: string | undefined,
  defaultRegion: string,
) => string;
declare const RESERVED_KEYWORD_WARNING: (
  context: string,
  property: string,
  parentKeyPath: string,
  reservedElements: string[],
) => string;
declare const INVALID_CONTEXT_OBJECT_WARNING: (logContext: string) => string;
declare const UNSUPPORTED_BEACON_API_WARNING: (context: string) => string;
declare const TIMEOUT_NOT_NUMBER_WARNING: (
  context: string,
  timeout: number | undefined,
  defaultValue: number,
) => string;
declare const TIMEOUT_ZERO_WARNING: (context: string) => string;
declare const TIMEOUT_NOT_RECOMMENDED_WARNING: (
  context: string,
  timeout: number,
  minTimeout: number,
) => string;
declare const INVALID_SESSION_ID_WARNING: (
  context: string,
  sessionId: number | undefined,
  minSessionIdLength: number,
) => string;
declare const STORAGE_QUOTA_EXCEEDED_WARNING: (context: string) => string;
declare const STORAGE_UNAVAILABLE_WARNING: (
  context: string,
  selectedStorageType: string,
  finalStorageType: string,
) => string;
declare const WRITE_KEY_NOT_A_STRING_ERROR: (
  context: string,
  writeKey: string | undefined,
) => string;
declare const EMPTY_GROUP_CALL_ERROR: (context: string) => string;
declare const READY_CALLBACK_INVOKE_ERROR = 'Failed to invoke the ready callback';
declare const API_CALLBACK_INVOKE_ERROR = 'API Callback Invocation Failed';
declare const INVALID_CONFIG_URL_WARNING: (context: string, configUrl: string) => string;
declare const POLYFILL_SCRIPT_LOAD_ERROR: (scriptId: string, url: string) => string;
declare const COOKIE_DATA_ENCODING_ERROR = 'Failed to encode the cookie data.';
declare const UNSUPPORTED_PRE_CONSENT_STORAGE_STRATEGY: (
  context: string,
  selectedStrategy: StorageStrategy | undefined,
  defaultStrategy: StorageStrategy,
) => string;
declare const UNSUPPORTED_PRE_CONSENT_EVENTS_DELIVERY_TYPE: (
  context: string,
  selectedDeliveryType: DeliveryType | undefined,
  defaultDeliveryType: DeliveryType,
) => string;
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
};
