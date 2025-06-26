import { LOG_CONTEXT_SEPARATOR } from '../shared-chunks/common';

const INTEGRATION_NOT_SUPPORTED_ERROR = (destDisplayName: string): string =>
  `Integration for destination "${destDisplayName}" is not supported.`;

const INTEGRATION_SDK_LOAD_ERROR = (destDisplayName: string): string =>
  `Failed to load integration SDK for destination "${destDisplayName}"`;

const INTEGRATION_INIT_ERROR = (destUserFriendlyId: string): string =>
  `Failed to initialize integration for destination "${destUserFriendlyId}".`;

const INTEGRATIONS_DATA_ERROR = (destUserFriendlyId: string): string =>
  `Failed to get integrations data for destination "${destUserFriendlyId}".`;

const INTEGRATION_READY_TIMEOUT_ERROR = (timeout: number): string =>
  `A timeout of ${timeout} ms occurred`;

const INTEGRATION_READY_CHECK_ERROR = (id: string): string =>
  `Failed to get the ready status from integration for destination "${id}"`;

const CUSTOM_INTEGRATION_INVALID_NAME_ERROR = (context: string, name: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Custom integration name must be a non-empty string: "${name}".`;

const CUSTOM_INTEGRATION_ALREADY_EXISTS_ERROR = (context: string, name: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}An integration with name "${name}" already exists.`;

export {
  INTEGRATION_NOT_SUPPORTED_ERROR,
  INTEGRATION_SDK_LOAD_ERROR,
  INTEGRATION_INIT_ERROR,
  INTEGRATIONS_DATA_ERROR,
  INTEGRATION_READY_TIMEOUT_ERROR,
  INTEGRATION_READY_CHECK_ERROR,
  CUSTOM_INTEGRATION_INVALID_NAME_ERROR,
  CUSTOM_INTEGRATION_ALREADY_EXISTS_ERROR,
};
