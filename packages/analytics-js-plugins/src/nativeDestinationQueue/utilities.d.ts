import { DestinationsQueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { IErrorHandler } from '@rudderstack/analytics-js-common/types/ErrorHandler';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { RudderEventType } from '../types/plugins';
declare const getNormalizedQueueOptions: (
  queueOpts: DestinationsQueueOpts,
) => DestinationsQueueOpts;
declare const isEventDenyListed: (
  eventType: RudderEventType,
  eventName: Nullable<string>,
  dest: Destination,
) => boolean;
declare const sendEventToDestination: (
  item: RudderEvent,
  dest: Destination,
  errorHandler?: IErrorHandler,
  logger?: ILogger,
) => void;
export { getNormalizedQueueOptions, isEventDenyListed, sendEventToDestination };
