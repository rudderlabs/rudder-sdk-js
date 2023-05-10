import { QueueOptions, Queue } from '@rudderstack/analytics-js/npmPackages/localstorage-retry';
import { ApiCallback } from '@rudderstack/analytics-js/state/types';
import { mergeDeepRight } from '@rudderstack/analytics-js/components/utilities/object';
import { defaultLogger } from '@rudderstack/analytics-js/services/Logger';
import { IErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler/types';
import { ILogger } from '@rudderstack/analytics-js/services/Logger/types';
import { defaultErrorHandler } from '@rudderstack/analytics-js/services/ErrorHandler';
import { IEventRepository } from './types';
import { IPluginsManager } from '../pluginsManager/types';
import { RudderEvent } from '../eventManager/types';
import { DEFAULT_QUEUE_OPTIONS } from './constants';
import { defaultPluginsManager } from '../pluginsManager';
import { validatePayloadSize } from './utils';

class EventRepository implements IEventRepository {
  errorHandler?: IErrorHandler;
  logger?: ILogger;
  dataPlaneEventsQueue: Queue;
  deviceEventsQueue: Queue;
  pluginsManager: IPluginsManager;

  constructor(
    pluginsManager: IPluginsManager,
    dataPlaneQOpts: QueueOptions,
    destinationsQOpts: QueueOptions,
    errorHandler?: IErrorHandler,
    logger?: ILogger,
  ) {
    this.pluginsManager = pluginsManager;
    this.errorHandler = errorHandler;
    this.logger = logger;

    // Override default options with user provided options
    const dpQueueOptions = mergeDeepRight(DEFAULT_QUEUE_OPTIONS, dataPlaneQOpts);

    this.dataPlaneEventsQueue = new Queue('rudder', dpQueueOptions, (item, done) => {
      pluginsManager.invoke('dataplaneEvent.process', item, done);
    });

    // Override default options with user provided options
    const dmQueueOptions = mergeDeepRight(DEFAULT_QUEUE_OPTIONS, destinationsQOpts);

    this.deviceEventsQueue = new Queue('rs_dest', dmQueueOptions, (item, done) => {
      pluginsManager.invoke('deviceEvent.process', item, done);
    });
  }

  init(): void {
    this.dataPlaneEventsQueue.start();
    this.deviceEventsQueue.start();
  }

  enqueue(event: RudderEvent, callback?: ApiCallback): void {
    validatePayloadSize(event, this.logger);

    this.dataPlaneEventsQueue.addItem({ event, callback });
    this.deviceEventsQueue.addItem({ event, callback });
  }
}

const defaultEventRepository = new EventRepository(
  defaultPluginsManager,
  DEFAULT_QUEUE_OPTIONS,
  DEFAULT_QUEUE_OPTIONS,
  defaultErrorHandler,
  defaultLogger,
);

export { defaultEventRepository, EventRepository };
