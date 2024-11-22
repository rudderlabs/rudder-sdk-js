import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { LOG_CONTEXT_SEPARATOR } from '../shared-chunks/common';

const DESTINATION_EVENT_FILTERING_WARNING = (
  context: string,
  eventName: Nullable<string>,
  destUserFriendlyId: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The "${eventName}" track event has been filtered for the "${destUserFriendlyId}" destination.`;

const DESTINATION_EVENT_FORWARDING_ERROR = (destUserFriendlyId: string): string =>
  `Failed to forward event to destination "${destUserFriendlyId}".`;

export { DESTINATION_EVENT_FILTERING_WARNING, DESTINATION_EVENT_FORWARDING_ERROR };
