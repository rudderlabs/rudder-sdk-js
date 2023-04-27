/* eslint-disable consistent-return */

import Queue from '@segment/localstorage-retry';

const queueOptions = {
  maxRetryDelay: 360000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  maxAttempts: Infinity,
  maxItems: 100,
};

class PreProcessQueue {
  constructor() {
    this.data = undefined;
    this.callback = undefined;
  }

  init(options, callback) {
    if (options) {
      // TODO: add checks for value - has to be +ve?
      Object.assign(queueOptions, options);
    }
    if (callback) {
      this.callback = callback;
    }
    this.payloadQueue = new Queue('rs_events', queueOptions, (item, done) => {
      const { type, rudderElement } = item;
      this.processQueueElement(type, rudderElement, (err, res) => {
        if (err) {
          return done(err);
        }
        done(null, res);
      });
    });
    this.payloadQueue.start();
  }

  setCloudModeEventsIntegrationObjData(integrationsData) {
    // An indicator to process elements in queue
    this.data = integrationsData;
  }

  processQueueElement(type, rudderElement, queueFn) {
    try {
      if (this.data) {
        // if not specified at event level, All: true is default
        const clientSuppliedIntegrations = rudderElement.message.integrations || { All: true };
        this.callback(type, rudderElement, clientSuppliedIntegrations);
        queueFn(null);
      } else {
        queueFn(new Error("Events can't be process without integrationsData"));
      }
    } catch (error) {
      queueFn(error);
    }
  }

  enqueue(type, rudderElement) {
    // add items to the queue
    this.payloadQueue.addItem({ type, rudderElement });
  }
}

export default PreProcessQueue;