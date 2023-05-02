/* eslint-disable consistent-return */

import Queue from '@segment/localstorage-retry';
import RudderElement from './RudderElement';

/**
 * Keeping maxAttempts to Infinity to retry cloud mode events and throw an error until processQueueElements flag is not set to true
 */
const queueOptions = {
  maxRetryDelay: 360000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  maxAttempts: Infinity,
};

class PreProcessQueue {
  constructor() {
    this.callback = undefined;
    this.processQueueElements = false;
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
      this.processQueueElement(item.type, item.rudderElement, (err, res) => {
        if (err) {
          return done(err);
        }
        done(null, res);
      });
    });
    this.payloadQueue.start();
  }

  activateProcessor() {
    // An indicator to process elements in queue
    this.processQueueElements = true;
  }

  processQueueElement(type, rudderElement, queueFn) {
    try {
      if (this.processQueueElements) {
        Object.setPrototypeOf(rudderElement, RudderElement.prototype);
        this.callback(type, rudderElement);
        queueFn(null);
      } else {
        queueFn(new Error('The queue elements are not ready to be processed yet'));
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
