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

const CUSTOM_INTEGRATION_INVALID_DESTINATION_ID_ERROR = (
  context: string,
  destinationId: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The destination ID "${destinationId}" does not correspond to an enabled custom device mode destination.`;

const CUSTOM_INTEGRATION_ALREADY_EXISTS_ERROR = (context: string, destinationId: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}A custom integration with destination ID "${destinationId}" was already added.`;

const INVALID_CUSTOM_INTEGRATION_ERROR = (context: string, destinationId: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The custom integration added for destination ID "${destinationId}" does not match the expected implementation format.`;

const INTEGRATION_NOT_ADDED_TO_CUSTOM_DESTINATION_WARNING = (
  context: string,
  destinationId: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}No custom integration was added for destination ID "${destinationId}". Ignoring it.`;

export {
  INTEGRATION_NOT_SUPPORTED_ERROR,
  INTEGRATION_SDK_LOAD_ERROR,
  INTEGRATION_INIT_ERROR,
  INTEGRATIONS_DATA_ERROR,
  INTEGRATION_READY_TIMEOUT_ERROR,
  INTEGRATION_READY_CHECK_ERROR,
  CUSTOM_INTEGRATION_INVALID_DESTINATION_ID_ERROR,
  CUSTOM_INTEGRATION_ALREADY_EXISTS_ERROR,
  INVALID_CUSTOM_INTEGRATION_ERROR,
  INTEGRATION_NOT_ADDED_TO_CUSTOM_DESTINATION_WARNING,
};
