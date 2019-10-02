import {
  BASE_URL,
  FLUSH_QUEUE_SIZE,
  FLUSH_INTERVAL_DEFAULT
} from "./constants";
import { getCurrentTimeFormatted } from "./utils";
import { replacer } from "./utils";
import { RudderPayload } from "./RudderPayload";
import * as XMLHttpRequestNode from "Xmlhttprequest";

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
    this.url = BASE_URL//"http://localhost:9005"; //BASE_URL;
    this.state = "READY";
    this.batchSize = 0;
    setInterval(this.preaparePayloadAndFlush, FLUSH_INTERVAL_DEFAULT, this);
  }

  /**
   *
   *
   * @param {EventRepository} repo
   * @returns
   * @memberof EventRepository
   */
  preaparePayloadAndFlush(repo) {
    //construct payload
    console.log("==== in preaparePayloadAndFlush with state: " + repo.state);
    console.log(repo.eventsBuffer);
    if (repo.eventsBuffer.length == 0 || repo.state === "PROCESSING") {
      return;
    }
    var eventsPayload = repo.eventsBuffer;
    var payload = new RudderPayload();
    payload.batch = eventsPayload;
    payload.write_key = repo.write_key;
    payload.sent_at = getCurrentTimeFormatted();
    repo.batchSize = repo.eventsBuffer.length;
    //server-side integration, XHR is node module

    if (process.browser) {
      var xhr = new XMLHttpRequestNode();
    } else {
      var xhr = new XMLHttpRequestNode.XMLHttpRequest();
    }

    console.log("==== in flush sending to Rudder BE ====");
    console.log(JSON.stringify(payload, replacer));

    xhr.open("POST", repo.url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    //register call back to reset event buffer on successfull POST
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log("====== request processed successfully: " + xhr.status);
        repo.eventsBuffer = repo.eventsBuffer.slice(repo.batchSize);
        console.log(repo.eventsBuffer.length);
      } else if (xhr.readyState === 4 && xhr.status !== 200) {
        console.log("====== request failed with status: " + xhr.status);
      }
      repo.state = "READY";
    };
    xhr.send(JSON.stringify(payload, replacer));
    repo.state = "PROCESSING";
  }

  /**
   *
   *
   * @param {RudderElement} rudderElement
   * @memberof EventRepository
   */
  enqueue(rudderElement) {
    //so buffer is really kept to be in alignment with other SDKs
    console.log(this.eventsBuffer);
    this.eventsBuffer.push(rudderElement.getElementContent()); //Add to event buffer
    console.log("==== Added to flush queue =====" + this.eventsBuffer.length);
  }
}
let eventRepository = new EventRepository();
export { eventRepository as EventRepository };
