import { LOG_CONTEXT_SEPARATOR } from '../shared-chunks/common';

const DESTINATION_NOT_SUPPORTED_ERROR = (destUserFriendlyId: string): string =>
  `Destination ${destUserFriendlyId} is not supported.`;

const DESTINATION_SDK_LOAD_ERROR = (context: string, destUserFriendlyId: string): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to load script for destination ${destUserFriendlyId}.`;

const DESTINATION_INIT_ERROR = (destUserFriendlyId: string): string =>
  `Failed to initialize destination ${destUserFriendlyId}.`;

const DESTINATION_INTEGRATIONS_DATA_ERROR = (destUserFriendlyId: string): string =>
  `Failed to get integrations data for destination ${destUserFriendlyId}.`;

const DESTINATION_READY_TIMEOUT_ERROR = (timeout: number, destUserFriendlyId: string): string =>
  `A timeout of ${timeout} ms occurred while trying to check the ready status for "${destUserFriendlyId}" destination.`;

export {
  DESTINATION_NOT_SUPPORTED_ERROR,
  DESTINATION_SDK_LOAD_ERROR,
  DESTINATION_INIT_ERROR,
  DESTINATION_INTEGRATIONS_DATA_ERROR,
  DESTINATION_READY_TIMEOUT_ERROR,
};
