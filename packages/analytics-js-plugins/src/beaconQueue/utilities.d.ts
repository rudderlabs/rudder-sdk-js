import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { BeaconQueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
/**
 * Utility to get the stringified event payload as Blob
 * @param events RudderEvent object array
 * @param logger Logger instance
 * @returns stringified events payload as Blob, undefined if error occurs.
 */
declare const getBatchDeliveryPayload: (
  events: RudderEvent[],
  logger?: ILogger,
) => Blob | undefined;
declare const getNormalizedBeaconQueueOptions: (queueOpts: BeaconQueueOpts) => BeaconQueueOpts;
declare const getDeliveryUrl: (dataplaneUrl: string, writeKey: string) => string;
export { getBatchDeliveryPayload, getDeliveryUrl, getNormalizedBeaconQueueOptions };
