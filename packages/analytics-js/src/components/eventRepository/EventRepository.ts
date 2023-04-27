import { QueueOptions, Queue } from '@rudderstack/analytics-js/npmPackages/localstorage-retry';
import { ApiCallback } from '@rudderstack/analytics-js/state/types';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { IEventRepository } from './types';
import { IPluginsManager } from '../pluginsManager/types';
import { RudderEvent } from '../eventManager/types';
import { DEFAULT_QUEUE_OPTIONS } from './constants';
import { defaultPluginsManager } from '../pluginsManager';

class EventRepository implements IEventRepository {
  dataPlaneEventsQueue: Queue;
  deviceEventsQueue: Queue;
  pluginsManager: IPluginsManager;

  constructor(queueOptions: QueueOptions, pluginsManager: IPluginsManager) {
    this.pluginsManager = pluginsManager;

    // Override default options with user provided options
    const dpQueueOptions = mergeDeepRight(DEFAULT_QUEUE_OPTIONS, queueOptions);

    this.dataPlaneEventsQueue = new Queue('rudder', dpQueueOptions, (item, done) => {
      pluginsManager.invoke('dataplaneEvent.process', item, done);
    });

    this.deviceEventsQueue = new Queue('rs_dm', DEFAULT_QUEUE_OPTIONS, (item, done) => {
      pluginsManager.invoke('deviceEvent.process', item, done);
    });
  }

  init(): void {
    this.dataPlaneEventsQueue.start();
    this.deviceEventsQueue.start();
  }

  enqueue(event: RudderEvent, callback?: ApiCallback): void {
    this.dataPlaneEventsQueue.addItem({ event, callback });
    this.deviceEventsQueue.addItem({ event, callback });
  }
}

const defaultEventRepository = new EventRepository(DEFAULT_QUEUE_OPTIONS, defaultPluginsManager);

export { defaultEventRepository, EventRepository };
