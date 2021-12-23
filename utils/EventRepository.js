/* eslint-disable no-lonely-if */
/* eslint-disable class-methods-use-this */
import logger from "./logUtil";
import xhr from "./xhrModule";
import beaconQueue from "./storage/beaconQueue";
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
    this.useBeacon = false;
  }

  initialize(options) {
    if (options && options.useBeacon) this.useBeacon = options.useBeacon;
    let queueOptions = {};
    if (
      options &&
      options.queueOptions &&
      options.queueOptions != null &&
      typeof options.queueOptions === "object"
    ) {
      queueOptions = options.queueOptions;
    }
    if (this.useBeacon) {
      beaconQueue.init(this.url, this.writeKey, queueOptions);
    } else {
      xhr.startQueue(queueOptions);
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
    const url = this.url.slice(-1) === "/" ? this.url.slice(0, -1) : this.url;
    if (this.useBeacon) {
      const targetUrl = `${url}/beacon/v1/batch`;
      beaconQueue.enqueue(targetUrl, headers, message, this.writeKey);
    } else {
      // add items to the queue
      xhr.enqueue(url, type, headers, message);
    }
  }
}
const eventRepository = new EventRepository();
// eslint-disable-next-line import/prefer-default-export
export { eventRepository as EventRepository };
