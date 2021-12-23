/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
/* eslint-disable import/no-unresolved */
/* eslint-disable global-require */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable class-methods-use-this */
import Queue from "@segment/localstorage-retry";
import { getCurrentTimeFormatted, handleError, replacer } from "./utils";
import logger from "./logUtil";

const queueOptions = {
  maxRetryDelay: 360000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  maxAttempts: 10,
  maxItems: 100,
};

class XHR {
  startQueue(options) {
    if (options) {
      // TODO: add checks for value - has to be +ve?
      Object.assign(queueOptions, options);
    }
    this.payloadQueue = new Queue("rudder", queueOptions, function (
      item,
      done
    ) {
      // apply sentAt at flush time and reset on each retry
      item.message.sentAt = getCurrentTimeFormatted();
      // send this item for processing, with a callback to enable queue to get the done status
      // eslint-disable-next-line no-use-before-define
      xhr.processQueueElement(
        item.url,
        item.headers,
        item.message,
        10 * 1000,
        // eslint-disable-next-line consistent-return
        function (err, res) {
          if (err) {
            return done(err);
          }
          done(null, res);
        }
      );
    });

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
      xhr.open("POST", url, true);
      for (const k in headers) {
        xhr.setRequestHeader(k, headers[k]);
      }
      xhr.timeout = timeout;
      xhr.ontimeout = queueFn;
      xhr.onerror = queueFn;
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 429 || (xhr.status >= 500 && xhr.status < 600)) {
            handleError(
              new Error(
                `request failed with status: ${xhr.status}${xhr.statusText} for url: ${url}`
              )
            );
            queueFn(
              new Error(
                `request failed with status: ${xhr.status}${xhr.statusText} for url: ${url}`
              )
            );
          } else {
            logger.debug(
              `====== request processed successfully: ${xhr.status}`
            );
            queueFn(null, xhr.status);
          }
        }
      };

      xhr.send(JSON.stringify(message, replacer));
    } catch (error) {
      queueFn(error);
    }
  }

  enqueue(url, type, headers, message) {
    // add items to the queue
    this.payloadQueue.addItem({
      url: `${url}/v1/${type}`,
      headers,
      message,
    });
  }
}

const xhr = new XHR();
export default xhr;
