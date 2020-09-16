/* eslint-disable eqeqeq */
/* eslint-disable import/prefer-default-export */
/* eslint-disable import/no-mutable-exports */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import { getCurrentTimeFormatted} from "./utils";
import logger from "./logUtil";

import storageQueue from "./storage/storageQueue";

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

    this.storageQueue = storageQueue;
  }

  sendQueueDataForBeacon(){
    const url = this.url.slice(-1) == "/" ? this.url.slice(0, -1) : this.url;
    const targetUrl = `${url}/beacon/v1/batch`;
    this.storageQueue.sendDataFromQueue(this.writeKey, targetUrl)
  }

  initializeTransportMechanism() {
    var sendQueueData = this.sendQueueDataForBeacon.bind(this);
    window.addEventListener("unload", sendQueueData);
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
    const targetUrl = `${url}/beacon/v1/batch`;
    this.sendWithBeacon(targetUrl, headers, message, this.writeKey);
  }

  sendWithBeacon(url, headers, message, writeKey){
    this.storageQueue.enqueue(url, headers, message, writeKey)
  }
}
let eventRepository = new EventRepository();
export { eventRepository as EventRepositoryBeacon };
