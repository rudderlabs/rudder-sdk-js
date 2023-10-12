import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
const DESTINATION_NOT_SUPPORTED_ERROR = destUserFriendlyId =>
  `Destination ${destUserFriendlyId} is not supported.`;
const DESTINATION_SDK_LOAD_ERROR = (context, destUserFriendlyId) =>
  `${context}${LOG_CONTEXT_SEPARATOR}Failed to load script for destination ${destUserFriendlyId}.`;
const DESTINATION_INIT_ERROR = destUserFriendlyId =>
  `Failed to initialize destination ${destUserFriendlyId}.`;
const DESTINATION_INTEGRATIONS_DATA_ERROR = destUserFriendlyId =>
  `Failed to get integrations data for destination ${destUserFriendlyId}.`;
const DESTINATION_READY_TIMEOUT_ERROR = (timeout, destUserFriendlyId) =>
  `A timeout of ${timeout} ms occurred while trying to check the ready status for "${destUserFriendlyId}" destination.`;
export {
  DESTINATION_NOT_SUPPORTED_ERROR,
  DESTINATION_SDK_LOAD_ERROR,
  DESTINATION_INIT_ERROR,
  DESTINATION_INTEGRATIONS_DATA_ERROR,
  DESTINATION_READY_TIMEOUT_ERROR,
};
