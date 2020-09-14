import Queue from "@segment/localstorage-retry";
import {
  BASE_URL,
  FLUSH_QUEUE_SIZE,
  FLUSH_INTERVAL_DEFAULT,
} from "./constants";
import { getCurrentTimeFormatted, handleError, replacer } from "./utils";

import { RudderPayload } from "./RudderPayload";
import logger from "./logUtil";
// import * as XMLHttpRequestNode from "Xmlhttprequest";

let XMLHttpRequestNode;
if (!process.browser) {
  XMLHttpRequestNode = require("Xmlhttprequest");
}

let btoaNode;
if (!process.browser) {
  btoaNode = require("btoa");
}

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
   *
   *
   * @param {EventRepository} repo
   * @returns
   * @memberof EventRepository
   */
  preaparePayloadAndFlush(repo) {
    // construct payload
    logger.debug(`==== in preaparePayloadAndFlush with state: ${repo.state}`);
    logger.debug(repo.eventsBuffer);
    if (repo.eventsBuffer.length == 0 || repo.state === "PROCESSING") {
      return;
    }
    const eventsPayload = repo.eventsBuffer;
    const payload = new RudderPayload();
    payload.batch = eventsPayload;
    payload.writeKey = repo.writeKey;
    payload.sentAt = getCurrentTimeFormatted();

    // add sentAt to individual events as well
    payload.batch.forEach((event) => {
      event.sentAt = payload.sentAt;
    });

    repo.batchSize = repo.eventsBuffer.length;
    // server-side integration, XHR is node module

    if (process.browser) {
      var xhr = new XMLHttpRequest();
    } else {
      var xhr = new XMLHttpRequestNode.XMLHttpRequest();
    }

    logger.debug("==== in flush sending to Rudder BE ====");
    logger.debug(JSON.stringify(payload, replacer));

    xhr.open("POST", repo.url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    if (process.browser) {
      xhr.setRequestHeader(
        "Authorization",
        `Basic ${btoa(`${payload.writeKey}:`)}`
      );
    } else {
      xhr.setRequestHeader(
        "Authorization",
        `Basic ${btoaNode(`${payload.writeKey}:`)}`
      );
    }

    // register call back to reset event buffer on successfull POST
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        logger.debug(`====== request processed successfully: ${xhr.status}`);
        repo.eventsBuffer = repo.eventsBuffer.slice(repo.batchSize);
        logger.debug(repo.eventsBuffer.length);
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        handleError(
          new Error(
            `request failed with status: ${xhr.status} for url: ${repo.url}`
          )
        );
      }
      repo.state = "READY";
    };
    xhr.send(JSON.stringify(payload, replacer));
    repo.state = "PROCESSING";
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
export { EventRepository };
