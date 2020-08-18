/* eslint-disable eqeqeq */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import Queue from "@segment/localstorage-retry";
import {
  getCurrentTimeFormatted,
  handleError,
  replacer,
  validatePayload,
} from "./utils";
import logger from "./logUtil";

const queueOptions = {
  maxRetryDelay: 360000,
  minRetryDelay: 1000,
  backoffFactor: 2,
  maxAttempts: 10,
  maxItems: 100,
};

const MESSAGE_LENGTH = 32 * 1000; // ~32 Kb

/**
 *
 * @class EventRepository responsible for adding events into
 * flush queue and sending data to rudder backend
 * in batch and maintains order of the event.
 */
class EventRepository {
  /**
   *Creates an instance of EventRepository.
   * @memberof EventRepository
   */
  constructor(options) {
    this.eventsBuffer = [];
    this.writeKey = "";
    this.url = "";
    this.state = "READY";
    this.batchSize = 0;

    // previous implementation
    // setInterval(this.preaparePayloadAndFlush, FLUSH_INTERVAL_DEFAULT, this);
  }

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

      item.message = validatePayload(item.message);
      if (item.message === undefined) {
        logger.debug("dropping invalid event");
        return;
      }
      eventRepository.processQueueElement(
        item.url,
        item.headers,
        item.message,
        10 * 1000,
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
  // eslint-disable-next-line class-methods-use-this
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

  /**
   *
   *
   * @param {RudderElement} rudderElement
   * @memberof EventRepository
   */
  enqueue(rudderElement, type) {
    const message = rudderElement.getElementContent();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${btoa(`${this.writeKey}:`)}`,
      AnonymousId: btoa(message.anonymousId),
    };

    message.originalTimestamp = getCurrentTimeFormatted();
    message.sentAt = getCurrentTimeFormatted(); // add this, will get modified when actually being sent

    // check message size, if greater log an error
    if (JSON.stringify(message).length > MESSAGE_LENGTH) {
      logger.error(
        "[EventRepository] enqueue:: message length greater 32 Kb ",
        message
      );
    }

    // modify the url for event specific endpoints
    const url = this.url.slice(-1) == "/" ? this.url.slice(0, -1) : this.url;
    // add items to the queue
    this.payloadQueue.addItem({
      url: `${url}/v1/${type}`,
      headers,
      message,
    });
  }
}
let eventRepository = new EventRepository();
export { eventRepository as EventRepository };
