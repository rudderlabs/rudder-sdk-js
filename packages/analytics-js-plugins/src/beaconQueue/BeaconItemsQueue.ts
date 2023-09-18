import { generateUUID } from '@rudderstack/analytics-js-common/utilities/uuId';
import { IStore, IStoreManager } from '@rudderstack/analytics-js-common/types/Store';
import { BeaconQueueOpts } from '@rudderstack/analytics-js-common/types/LoadOptions';
import { storages } from '../shared-chunks';
import { StorageType } from '@rudderstack/analytics-js-common/types/Storage';
import { IQueue, QueueItem, QueueProcessCallback } from '../types/plugins';
import { BeaconQueueItemData } from './types';
import { getDeliveryPayload } from './utilities';
import { DEFAULT_BEACON_QUEUE_OPTIONS, MAX_BATCH_PAYLOAD_SIZE_BYTES } from './constants';

export type BeaconQueueTimeouts = {
  flushQueueTimeOutInterval: number;
};

const sortByTime = (a: QueueItem, b: QueueItem) => a.time - b.time;

class BeaconItemsQueue implements IQueue<BeaconQueueItemData> {
  name: string;
  id: string;
  processQueueCb: QueueProcessCallback<QueueItem<BeaconQueueItemData>[]>;
  store: IStore;
  storeManager: IStoreManager;
  maxItems: number;
  timeouts: BeaconQueueTimeouts;
  flushQueueTimeOut?: number;
  scheduleTimeoutActive: boolean;
  flushInProgress: boolean;
  nextFlushPending: boolean;

  constructor(
    name: string,
    options: BeaconQueueOpts,
    queueProcessCb: QueueProcessCallback,
    storeManager: IStoreManager,
    storageType: StorageType = storages.MEMORY_STORAGE,
  ) {
    this.storeManager = storeManager;
    this.name = name;
    this.id = generateUUID();
    this.processQueueCb = queueProcessCb;
    this.maxItems = options.maxItems ?? DEFAULT_BEACON_QUEUE_OPTIONS.maxItems;
    this.timeouts = {
      flushQueueTimeOutInterval:
        options.flushQueueInterval ?? DEFAULT_BEACON_QUEUE_OPTIONS.flushQueueInterval,
    };
    this.flushInProgress = false;
    this.nextFlushPending = false;

    // Set up our empty queues
    this.store = this.storeManager.setStore({
      id: this.id,
      name: this.name,
      type: storageType,
    });

    this.flushQueue = this.flushQueue.bind(this);

    this.attachListeners();

    this.flushQueueTimeOut = undefined;
    this.scheduleTimeoutActive = false;
  }

  attachListeners() {
    (globalThis as typeof window).addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flushQueue();
      }
    });
  }

  getQueue(name?: string): QueueItem<BeaconQueueItemData>[] {
    return this.store.get(name ?? this.name) ?? [];
  }

  setQueue(name?: string, value?: QueueItem<BeaconQueueItemData>[]) {
    this.store.set(name ?? this.name, value ?? []);
  }

  start() {
    if (!this.scheduleTimeoutActive) {
      this.flushQueueTimeOut = (globalThis as typeof window).setTimeout(
        this.flushQueue,
        this.timeouts.flushQueueTimeOutInterval,
      );

      this.scheduleTimeoutActive = true;
    }
  }

  stop() {
    if (this.scheduleTimeoutActive) {
      clearTimeout(this.flushQueueTimeOut);
      this.scheduleTimeoutActive = false;
    }
  }

  enqueue(entry: QueueItem<BeaconQueueItemData>) {
    let queue = this.getQueue();

    // Get max items from the queue minus one
    queue = queue.slice(-(this.maxItems - 1));
    queue.push(entry);
    queue = queue.sort(sortByTime);

    // Calculate response payload size after the addition of new event
    let eventsToSend = queue.slice(0);
    const batchData = getDeliveryPayload(eventsToSend.map(queueItem => queueItem.item.event));

    // Send events that existed in the queue if totaling more max payload size
    const isExceededMaxPayloadSize = Boolean(
      batchData && batchData.size > MAX_BATCH_PAYLOAD_SIZE_BYTES,
    );
    if (isExceededMaxPayloadSize) {
      // Flush all previous items
      eventsToSend = queue.slice(0, queue.length - 1);
      this.flushQueue(eventsToSend);

      // Add only latest item in the remaining queue that is cleared appropriately in flushQueue
      queue = this.getQueue();
      queue.push(entry);
    }

    this.setQueue(this.name, queue);

    // If queue has total of max items then flush
    if (queue.length === this.maxItems) {
      this.flushQueue();
    }

    this.start();
  }

  addItem(itemData: BeaconQueueItemData) {
    this.enqueue({
      item: itemData,
      attemptNumber: 0,
      time: Date.now(),
      id: generateUUID(),
    });
  }

  flushQueue(queueItems?: QueueItem<BeaconQueueItemData>[]) {
    if (!this.flushInProgress) {
      this.flushInProgress = true;
      const batchItems = queueItems ?? this.getQueue();
      const batchData =
        batchItems && batchItems.length > 0 ? batchItems.slice(0, batchItems.length) : [];

      // TODO: add retry mechanism here
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const beaconSendCallback = (error?: any, response?: any) => {
        this.setQueue(this.name, []);
        this.stop();
        this.flushInProgress = false;

        if (this.nextFlushPending) {
          this.nextFlushPending = false;
          this.flushQueue();
        }
      };

      if (batchData.length > 0) {
        this.processQueueCb(batchData, beaconSendCallback);
        return;
      }

      // If no items to send just clear timer
      beaconSendCallback(null);
    } else {
      this.nextFlushPending = true;
    }
  }
}

export { BeaconItemsQueue };
