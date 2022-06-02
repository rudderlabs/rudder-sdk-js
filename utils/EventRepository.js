/* eslint-disable no-lonely-if */
/* eslint-disable class-methods-use-this */
import logger from "./logUtil";
import XHRQueue from "./xhrModule";
import BeaconQueue from "./storage/beaconQueue";
import { getCurrentTimeFormatted, removeTrailingSlashes } from "./utils";
import { Store } from "./storage/store";

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
    this.queue = undefined;
  }

  initialize(writeKey, url, options) {
    let queueOptions = {};
    let targetUrl = removeTrailingSlashes(url);
    if (options && options.useBeacon && navigator.sendBeacon) {
      if (
        options &&
        options.beaconQueueOptions &&
        options.beaconQueueOptions != null &&
        typeof options.beaconQueueOptions === "object"
      ) {
        queueOptions = options.beaconQueueOptions;
      }
      targetUrl = `${targetUrl}/beacon/v1/batch`;
      this.queue = new BeaconQueue();
    } else {
      if (options && options.useBeacon) {
        logger.info(
          "[EventRepository] sendBeacon feature not available in this browser :: fallback to XHR"
        );
      }
      if (
        options &&
        options.queueOptions &&
        options.queueOptions != null &&
        typeof options.queueOptions === "object"
      ) {
        queueOptions = options.queueOptions;
      }
      if (options && options.batchMode != undefined) {
        this.batchMode = options.batchMode
        this.batchFactor = options.batchFactor
      }
      this.queue = new XHRQueue();
    }
    this.queue.init(writeKey, targetUrl, queueOptions);
  }

  /**
   *
   *
   * @param {RudderElement} rudderElement
   * @memberof EventRepository
   */
  enqueue(rudderElement, type) {
    const message = rudderElement.getElementContent();
    message.originalTimestamp =
      message.originalTimestamp || getCurrentTimeFormatted();
    message.sentAt = getCurrentTimeFormatted(); // add this, will get modified when actually being sent

    // check message size, if greater log an error
    if (JSON.stringify(message).length > MESSAGE_LENGTH) {
      logger.error(
        "[EventRepository] enqueue:: message length greater 32 Kb ",
        message
      );
    }

    if (this.batchMode & (type == "track" || type == "page" || type == "identify")) {
      type = "batch"
      var storeRegex = RegExp("^batch");
      const batchKeys = function () {
        return Object.keys(localStorage).map(function (element, _) {
          if (storeRegex.exec(element) !== null) return element;
        }).filter(function (element) {
          return element;
        })
      }

      var key = "batch_" + message.originalTimestamp;
      Store.set(key, JSON.stringify(message));

      if (batchKeys().length >= this.batchFactor) {
        var batchPayload = [];

        for (var i = batchKeys().length - 1; i >= 0; i--) {
          batchPayload.push(JSON.parse(Store.get(batchKeys()[i])));
          Store.remove(batchKeys()[i]);
        }
        this.queue.enqueue(batchPayload, type);
      }
    } else {
      this.queue.enqueue(message, type);
    }
  }
}

const eventRepository = new EventRepository();
// eslint-disable-next-line import/prefer-default-export
export { eventRepository as EventRepository };
