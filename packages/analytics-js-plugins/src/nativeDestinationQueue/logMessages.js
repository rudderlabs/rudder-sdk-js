import { LOG_CONTEXT_SEPARATOR } from '@rudderstack/analytics-js-common/constants/logMessages';
const DESTINATION_EVENT_FILTERING_WARNING = (context, eventName, destUserFriendlyId) =>
  `${context}${LOG_CONTEXT_SEPARATOR}The "${eventName}" track event has been filtered for the "${destUserFriendlyId}" destination.`;
const DESTINATION_EVENT_FORWARDING_ERROR = destUserFriendlyId =>
  `Failed to forward event to destination "${destUserFriendlyId}".`;
export { DESTINATION_EVENT_FILTERING_WARNING, DESTINATION_EVENT_FORWARDING_ERROR };
