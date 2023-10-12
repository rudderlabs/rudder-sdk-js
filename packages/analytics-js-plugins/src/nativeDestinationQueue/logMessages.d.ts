import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
declare const DESTINATION_EVENT_FILTERING_WARNING: (
  context: string,
  eventName: Nullable<string>,
  destUserFriendlyId: string,
) => string;
declare const DESTINATION_EVENT_FORWARDING_ERROR: (destUserFriendlyId: string) => string;
export { DESTINATION_EVENT_FILTERING_WARNING, DESTINATION_EVENT_FORWARDING_ERROR };
