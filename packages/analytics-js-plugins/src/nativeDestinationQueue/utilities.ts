import { mergeDeepRight } from 'ramda';
import { DestinationsQueueOpts } from '../types/common';
import { DEFAULT_QUEUE_OPTIONS } from './constants';

const getNormalizedQueueOptions = (queueOpts: DestinationsQueueOpts): DestinationsQueueOpts =>
  mergeDeepRight(DEFAULT_QUEUE_OPTIONS, queueOpts);

export { getNormalizedQueueOptions };
