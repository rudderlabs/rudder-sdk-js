/* eslint-disable no-lonely-if */
/* eslint-disable class-methods-use-this */
import logger from "./logUtil";
import xhrQueue from "./xhrModule";
import BeaconQueue from "./storage/beaconQueue";
import { getCurrentTimeFormatted } from "./utils";

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
    this.writeKey = "";
    this.url = "";
    this.queue = undefined;
  }

  initialize(writeKey, url, options) {
    let queueOptions = {};
    let targetUrl;
    this.writeKey = writeKey;
    this.url = url.slice(-1) === "/" ? url.slice(0, -1) : url;
    if (options && options.useBeacon) {
      if (
        options &&
        options.beaconQueue &&
        options.beaconQueue != null &&
        typeof options.beaconQueue === "object"
      ) {
        queueOptions = options.beaconQueue;
      }
      targetUrl = `${this.url}/beacon/v1/batch`;
      this.queue = new BeaconQueue();
    } else {
      if (
        options &&
        options.queueOptions &&
        options.queueOptions != null &&
        typeof options.queueOptions === "object"
      ) {
        queueOptions = options.queueOptions;
      }
      targetUrl = this.url;
      this.queue = xhrQueue;
    }
    this.queue.init(targetUrl, queueOptions, this.writeKey);
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

    this.queue.enqueue(headers, message, type);
  }
}
const eventRepository = new EventRepository();
// eslint-disable-next-line import/prefer-default-export
export { eventRepository as EventRepository };
