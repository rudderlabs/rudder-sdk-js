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

let queueOptions;

if(process.transport.beacon) {
  queueOptions = {
    maxRetryDelay: 360000,
    minRetryDelay: 1000,
    backoffFactor: 5,
    maxAttempts: 50,
    maxItems: 1000,
    backoffJitter: 15
  };
} else {
  queueOptions = {
    maxRetryDelay: 360000,
    minRetryDelay: 1000,
    backoffFactor: 2,
    maxAttempts: 10,
    maxItems: 100,
  };
}

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
  constructor() {
    this.eventsBuffer = [];
    this.writeKey = "";
    this.url = "";
    this.state = "READY";
    this.batchSize = 0;

    // previous implementation
    // setInterval(this.preaparePayloadAndFlush, FLUSH_INTERVAL_DEFAULT, this);

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
   * the queue item proceesor
   * @param {*} url to send requests to
   * @param {*} headers
   * @param {*} message
   * @param {*} timeout
   * @param {*} queueFn the function to call after request completion
   */
  processQueueElement(url, headers, message, timeout, queueFn) {
    if(process.transport.beacon) {
      try {
        const data = { batch: [message] };
        const payload = JSON.stringify(data, replacer);
        const blob = new Blob([payload], headers);
        const isPushed = navigator.sendBeacon(
          url,
          blob
        );
        if (!isPushed) {
          handleError(
            new Error( "=====unable to push data, push to beacon queue failed"))
          queueFn(new Error("unable to push data"));
        } else {
          queueFn(null, 200);
        }
      } catch (error) {
        queueFn(error);
      }
    }
    else {
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
  }

  /**
   *
   *
   * @param {RudderElement} rudderElement
   * @memberof EventRepository
   */
  enqueue(rudderElement, type) {
    const message = rudderElement.getElementContent();

    let headers = {}
    if(process.transport.beacon) { 
      headers.type = 'text/plain';
    }
    else {
      headers = {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${this.writeKey}:`)}`,
        AnonymousId: btoa(message.anonymousId),
      };
    }
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
    if(process.transport.beacon) {
      this.payloadQueue.addItem({
        url: `${url}/beacon/v1/batch?writeKey=${this.writeKey}`,
        headers,
        message,
      });
    } else {
      this.payloadQueue.addItem({
        url: `${url}/v1/${type}`,
        headers,
        message,
      });
    }
  }
}
let eventRepository = new EventRepository();
export { eventRepository as EventRepository };