/* eslint-disable no-lonely-if */
/* eslint-disable class-methods-use-this */
import logger from "./logUtil";
import XHRQueue from "./xhrModule";
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
    this.queue = undefined;
  }

  initialize(writeKey, url, options) {
    let queueOptions = {};
    let targetUrl = url.slice(-1) === "/" ? url.slice(0, -1) : url;
    if (options && options.useBeacon) {
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
      if (
        options &&
        options.queueOptions &&
        options.queueOptions != null &&
        typeof options.queueOptions === "object"
      ) {
        queueOptions = options.queueOptions;
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
    message.originalTimestamp = getCurrentTimeFormatted();
    message.sentAt = getCurrentTimeFormatted(); // add this, will get modified when actually being sent

    // check message size, if greater log an error
    if (JSON.stringify(message).length > MESSAGE_LENGTH) {
      logger.error(
        "[EventRepository] enqueue:: message length greater 32 Kb ",
        message
      );
    }

    this.queue.enqueue(message, type);
  }
}
const eventRepository = new EventRepository();
// eslint-disable-next-line import/prefer-default-export
export { eventRepository as EventRepository };
