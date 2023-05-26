/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
import { Store } from './storage/store';
import { handleError } from './errorHandler';
import { stringifyWithoutCircular } from './ObjectUtils';

const defaults = {
  queue: 'queue',
  maxPayloadSize: 64 * 1000,
};

class BeaconQueue {
  constructor() {
    this.storage = Store;
    this.maxItems = 10;
    this.flushQueueTimeOut = undefined;
    this.timeOutActive = false;
    this.flushQueueTimeOutInterval = 1000 * 60 * 10; // 10 mins
    this.url = '';
    this.writekey = '';
    this.queueName = `${defaults.queue}.${Date.now()}`;
  }

  sendQueueDataForBeacon() {
    this.sendDataFromQueueAndDestroyQueue();
  }

  init(writekey, url, options) {
    this.url = url;
    this.writekey = writekey;
    if (options.maxItems) this.maxItems = options.maxItems;
    if (options.flushQueueInterval) this.flushQueueTimeOutInterval = options.flushQueueInterval;
    const sendQueueData = this.sendQueueDataForBeacon.bind(this);
    window.addEventListener('unload', sendQueueData);
  }

  getQueue() {
    return this.storage.get(this.queueName);
  }

  setQueue(value) {
    this.storage.set(this.queueName, value);
  }

  enqueue(message) {
    let queue = this.getQueue() || [];
    queue = queue.slice(-(this.maxItems - 1));
    queue.push(message);
    let batch = queue.slice(0);
    const data = { batch };
    const dataToSend = stringifyWithoutCircular(data, true);
    if (dataToSend.length > defaults.maxPayloadSize) {
      batch = queue.slice(0, queue.length - 1);
      this.flushQueue(batch);
      queue = this.getQueue();
      queue.push(message);
    }
    this.setQueue(queue);
    this.setTimer();

    if (queue.length === this.maxItems) {
      this.flushQueue(batch);
    }
  }

  sendDataFromQueueAndDestroyQueue() {
    this.sendDataFromQueue();
    this.storage.remove(this.queueName);
  }

  sendDataFromQueue() {
    const queue = this.getQueue();
    if (queue && queue.length > 0) {
      const batch = queue.slice(0, queue.length);
      this.flushQueue(batch);
    }
  }

  flushQueue(batch) {
    batch.forEach((event) => {
      event.sentAt = new Date().toISOString();
    });
    const data = { batch };
    const payload = stringifyWithoutCircular(data, true);
    const blob = new Blob([payload], { type: 'text/plain' });
    const targetUrl = `${this.url}?writeKey=${this.writekey}`;
    try {
      if (typeof navigator.sendBeacon !== 'function') {
        handleError(new Error('Beacon API is not supported by browser'));
      }
      const isPushed = navigator.sendBeacon(targetUrl, blob);
      if (!isPushed) {
        handleError(new Error("Unable to queue data to browser's beacon queue"));
      }
    } catch (e) {
      e.message = `${e.message} - While sending Beacon data to: ${targetUrl}`;
      handleError(e);
    }
    this.setQueue([]);
    this.clearTimer();
  }

  setTimer() {
    if (!this.timeOutActive) {
      this.flushQueueTimeOut = setTimeout(
        this.sendDataFromQueue.bind(this),
        this.flushQueueTimeOutInterval,
      );
      this.timeOutActive = true;
    }
  }

  clearTimer() {
    if (this.timeOutActive) {
      clearTimeout(this.flushQueueTimeOut);
      this.timeOutActive = false;
    }
  }
}
export default BeaconQueue;
