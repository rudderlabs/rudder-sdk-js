import type { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { LOG_CONTEXT_SEPARATOR } from '../shared-chunks/common';

const DESTINATION_EVENT_FILTERING_WARNING = (
  context: string,
  eventName: Nullable<string>,
  destUserFriendlyId: string,
): string =>
  `${context}${LOG_CONTEXT_SEPARATOR}The "${eventName}" track event has been filtered for the "${destUserFriendlyId}" destination.`;

const INTEGRATION_EVENT_FORWARDING_ERROR = (
  type: string,
  id: string,
  name?: Nullable<string>,
): string =>
  `Failed to send "${type}" event ${name ? `"${name}" ` : ''}to integration for destination "${id}".`;

export { DESTINATION_EVENT_FILTERING_WARNING, INTEGRATION_EVENT_FORWARDING_ERROR };
