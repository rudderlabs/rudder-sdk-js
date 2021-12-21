/* eslint-disable class-methods-use-this */
import logger from "./logUtil";

const defaults = {
  queue: "queue",
  maxPayloadSize: 64 * 1000,
};

class BeaconQueue {
  constructor(Store) {
    this.storage = Store;
    this.maxItems = 10;
    this.flushQueueTimeOut = undefined;
    this.timeOutActive = false;
    this.flushQueueTimeOutInterval = 1000 * 60 * 10; // 10 mins
    this.url = "";
    this.writekey = "";
    this.queueName = `${defaults.queue}.${Date.now()}`;
  }

  getQueue() {
    return this.storage.get(this.queueName);
  }

  setQueue(value) {
    this.storage.set(this.queueName, value);
  }

  /**
   *
   * Utility method for excluding null and empty values in JSON
   * @param {*} _key
   * @param {*} value
   * @returns
   */
  replacer(_key, value) {
    if (value === null || value === undefined) {
      return undefined;
    }
    return value;
  }

  enqueue(url, headers, message, writekey) {
    let queue = this.getQueue() || [];
    queue = queue.slice(-(this.maxItems - 1));
    queue.push(message);
    let batch = queue.slice(0);
    const data = { batch };
    const dataToSend = JSON.stringify(data, this.replacer);
    if (dataToSend.length > defaults.maxPayloadSize) {
      batch = queue.slice(0, queue.length - 1);
      this.flushQueue(headers, batch, url, writekey);
      queue = this.getQueue();
      queue.push(message);
    }
    this.setQueue(queue);
    this.setTimer();

    if (queue.length === this.maxItems) {
      this.flushQueue(headers, batch, url, writekey);
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
      const headers = {};
      this.flushQueue(headers, batch, this.url, this.writekey);
    }
  }

  flushQueue(headers, batch, url, writekey) {
    headers.type = "application/json";
    batch.map((event) => {
      event.sentAt = new Date().toISOString();
    });
    const data = { batch };
    const payload = JSON.stringify(data, this.replacer);
    const blob = new Blob([payload], headers);
    const isPushed = navigator.sendBeacon(`${url}?writeKey=${writekey}`, blob);
    if (!isPushed) {
      logger.debug("Unable to send data");
    }
    this.setQueue([]);
    this.clearTimer();
  }

  setTimer() {
    if (!this.timeOutActive) {
      this.flushQueueTimeOut = setTimeout(
        this.sendDataFromQueue.bind(this),
        this.flushQueueTimeOutInterval
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
