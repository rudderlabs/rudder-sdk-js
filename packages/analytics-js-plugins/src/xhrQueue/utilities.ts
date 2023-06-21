import path from 'path';
import { RudderEventType } from '../types/plugins';
import { DATA_PLANE_API_VERSION, DEFAULT_RETRY_QUEUE_OPTIONS } from './constants';
import { mergeDeepRight } from '../utilities/common';
import { QueueOpts } from '../types/common';

const getNormalizedQueueOptions = (queueOpts: QueueOpts): QueueOpts =>
  mergeDeepRight(DEFAULT_RETRY_QUEUE_OPTIONS, queueOpts);

const getDeliveryUrl = (dataplaneUrl: string, eventType: RudderEventType): string =>
  // eslint-disable-next-line compat/compat
  new URL(path.join(DATA_PLANE_API_VERSION, eventType), dataplaneUrl).toString();

export { getDeliveryUrl, getNormalizedQueueOptions };
