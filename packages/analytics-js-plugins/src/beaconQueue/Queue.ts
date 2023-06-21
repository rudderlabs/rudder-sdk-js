import Emitter from 'component-emitter';
import { IStoreManager, StorageType, IStore, BeaconQueueOpts } from '../types/common';
import { generateUUID } from '../utilities/common';
import { IQueue, QueueItem, QueueProcessCallback } from '../types/plugins';
import { BeaconQueueItem } from './types';
import { getDeliveryPayload } from './utilities';
import { DEFAULT_BEACON_QUEUE_OPTIONS, MAX_BATCH_PAYLOAD_SIZE_BYTES } from './constants';

export type BeaconQueueTimeouts = {
  flushQueueTimeOutInterval: number;
};

const sortByTime = (a: QueueItem, b: QueueItem) => a.time - b.time;

class Queue extends Emitter implements IQueue<BeaconQueueItem> {
  name: string;
  id: string;
  processQueueCb: QueueProcessCallback<QueueItem<BeaconQueueItem>[]>;
  store: IStore;
  storeManager: IStoreManager;
  maxItems: number;
  timeouts: BeaconQueueTimeouts;
  flushQueueTimeOut?: number;
  scheduleTimeoutActive: boolean;

  constructor(
    name: string,
    options: BeaconQueueOpts,
    queueProcessCb: QueueProcessCallback,
    storeManager: IStoreManager,
    storageType: StorageType = 'memoryStorage',
  ) {
    super();

    this.storeManager = storeManager;
    this.name = name;
    this.id = generateUUID();
    this.processQueueCb = queueProcessCb;
    this.maxItems = options.maxItems || DEFAULT_BEACON_QUEUE_OPTIONS.maxItems;
    this.timeouts = {
      flushQueueTimeOutInterval:
        options.flushQueueInterval || DEFAULT_BEACON_QUEUE_OPTIONS.flushQueueInterval,
    };

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

  getQueue(name?: string): QueueItem<BeaconQueueItem>[] {
    return this.store.get(name ?? this.name) || [];
  }

  setQueue(name?: string, value?: QueueItem<BeaconQueueItem>[]) {
    this.store.set(name ?? this.name, value || []);
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

  enqueue(entry: QueueItem<BeaconQueueItem>) {
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
      batchData && batchData.length > MAX_BATCH_PAYLOAD_SIZE_BYTES,
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

  addItem(item: BeaconQueueItem) {
    this.enqueue({
      item,
      attemptNumber: 0,
      time: Date.now(),
      id: generateUUID(),
    });
  }

  flushQueue(queueItems?: QueueItem<BeaconQueueItem>[]) {
    const batchItems = queueItems ?? this.getQueue();
    const batchData =
      batchItems && batchItems.length > 0 ? batchItems.slice(0, batchItems.length) : [];

    // TODO: add retry mechanism here
    const beaconSendCallback = (error?: any, response?: any) => {
      if (!response) {
        this.emit('discard', batchData);
      } else {
        this.emit('processed', batchData);
      }

      this.setQueue(this.name, []);
      this.stop();
    };

    if (batchData.length > 0) {
      this.processQueueCb(batchData, beaconSendCallback);
      return;
    }

    // If no items to send just clear timer
    beaconSendCallback(null);
  }
}

/**
 * Mix in event emitter
 */
Emitter(Queue);

// TODO: see if we can get rid of the Emitter
export { Queue };
