import { RudderEvent } from '@rudderstack/analytics-js/components/eventManager/types';
import { QueueOpts } from '@rudderstack/analytics-js/state/types';
import { ExtensionPlugin } from '../types/common';

const destinationsEventsQueue = (): ExtensionPlugin => ({
  name: 'destinationsEventsQueue',
  dataplaneEventsQueue: {
    init(queueOpts: QueueOpts): void {
      console.log(`Destinations Events Queue: Initialized with queueOpts: ${queueOpts}`);
    },
    start(): void {
      console.log('Destinations Events Queue: Started');
    },
    enqueue(event: RudderEvent): void {
      console.log(`Destinations Events Queue: Enqueued event: ${event}`);
    },
  },
});

export { destinationsEventsQueue };

export default destinationsEventsQueue;
