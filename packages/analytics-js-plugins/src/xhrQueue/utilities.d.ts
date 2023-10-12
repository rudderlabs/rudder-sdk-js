import { QueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { ResponseDetails } from '@rudderstack/analytics-js-common/types/HttpClient';
import { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { ApplicationState } from '@rudderstack/analytics-js-common/types/ApplicationState';
import { RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { Nullable } from '@rudderstack/analytics-js-common/types/Nullable';
import { XHRRetryQueueItemData } from './types';
declare const getBatchDeliveryPayload: (
  events: RudderEvent[],
  logger?: ILogger,
) => Nullable<string>;
declare const getNormalizedQueueOptions: (queueOpts: QueueOpts) => QueueOpts;
declare const getDeliveryUrl: (dataplaneUrl: string, endpoint: string) => string;
declare const getBatchDeliveryUrl: (dataplaneUrl: string) => string;
declare const logErrorOnFailure: (
  details: ResponseDetails | undefined,
  url: string,
  willBeRetried?: boolean,
  attemptNumber?: number,
  maxRetryAttempts?: number,
  logger?: ILogger,
) => void;
declare const getRequestInfo: (
  itemData: XHRRetryQueueItemData,
  state: ApplicationState,
  logger?: ILogger,
) => {
  data: Nullable<string>;
  headers: Record<string, string>;
  url: string;
};
export {
  getNormalizedQueueOptions,
  getDeliveryUrl,
  logErrorOnFailure,
  getBatchDeliveryUrl,
  getRequestInfo,
  getBatchDeliveryPayload,
};
