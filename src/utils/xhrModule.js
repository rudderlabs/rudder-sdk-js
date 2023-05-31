/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import Queue from '@segment/localstorage-retry';
import { getCurrentTimeFormatted } from './utils';
import { handleError } from './errorHandler';
import { FAILED_REQUEST_ERR_MSG_PREFIX } from './constants';
import { stringifyWithoutCircular } from './ObjectUtils';

const queueOptions = {
  maxRetryDelay: 360000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  maxAttempts: 10,
  maxItems: 100,
};

class XHRQueue {
  constructor() {
    this.url = '';
    this.writeKey = '';
  }

  init(writeKey, url, options) {
    this.url = url;
    this.writeKey = writeKey;
    if (options) {
      // TODO: add checks for value - has to be +ve?
      Object.assign(queueOptions, options);
    }
    this.payloadQueue = new Queue(
      'rudder',
      queueOptions,
      ((item, done) => {
        // apply sentAt at flush time and reset on each retry
        item.message.sentAt = getCurrentTimeFormatted();
        // send this item for processing, with a callback to enable queue to get the done status
        // eslint-disable-next-line no-use-before-define
        this.processQueueElement(
          item.url,
          item.headers,
          item.message,
          10 * 1000,
          // eslint-disable-next-line consistent-return
          (err, res) => {
            if (err) {
              return done(err);
            }
            done(null, res);
          },
        );
      }),
    );

    // start queue
    this.payloadQueue.start();
  }

  /**
   * the queue item proceesor
   * @param {*} url to send requests to
   * @param {*} headers
   * @param {*} message
   * @param {*} timeout
   * @param {*} queueFn the function to call after request completion
   */
  processQueueElement(url, headers, message, timeout, queueFn) {
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', url, true);
      for (const k in headers) {
        xhr.setRequestHeader(k, headers[k]);
      }
      xhr.timeout = timeout;
      xhr.ontimeout = queueFn;
      xhr.onerror = queueFn;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 429 || (xhr.status >= 500 && xhr.status < 600)) {
            const errMessage = `${FAILED_REQUEST_ERR_MSG_PREFIX} "${xhr.status}" status text: "${xhr.statusText}" for URL: "${url}"`;
            const err = new Error(errMessage);
            handleError(err);
            queueFn(err);
          } else {
            queueFn(null, xhr.status);
          }
        }
      };

      xhr.send(stringifyWithoutCircular(message, true));
    } catch (error) {
      queueFn(error);
    }
  }

  enqueue(message, type) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Basic ${btoa(`${this.writeKey}:`)}`,
      AnonymousId: btoa(message.anonymousId),
    };
    // add items to the queue
    this.payloadQueue.addItem({
      url: `${this.url}/v1/${type}`,
      headers,
      message,
    });
  }
}

export default XHRQueue;
