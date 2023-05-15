import { RudderEvent } from '@rudderstack/analytics-js/components/eventManager/types';
import { QueueOpts } from '@rudderstack/analytics-js/state/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { ExtensionPlugin } from '../types/common';
import { validatePayloadSize } from './utilities';

const dataplaneEventsQueue = (): ExtensionPlugin => ({
  name: 'dataplaneEventsQueue',
  dataplaneEventsQueue: {
    init(writeKey: string, dataplaneUrl: string, queueOpts: QueueOpts): void {
      console.log(
        `Dataplane Events Queue: Initialized with writeKey: ${writeKey}, dataplaneUrl: ${dataplaneUrl}, queueOpts: ${queueOpts}`,
      );
    },
    start(): void {
      console.log('Dataplane Events Queue: Started');
    },
    enqueue(event: RudderEvent, logger?: ILogger): void {
      // TODO: Append `sentAt` field before computing payload size
      validatePayloadSize(event, logger);
      console.log(`Dataplane Events Queue: Enqueued event: ${event}`);
    },
  },
});

export { dataplaneEventsQueue };

export default dataplaneEventsQueue;
