// Core message class with default values
import { generateUUID } from "./utils";
import RudderContext from "./RudderContext";

class RudderMessage {
  constructor() {
    this.channel = "web";
    this.context = new RudderContext();
    this.type = null;
    this.messageId = generateUUID().toString();
    this.originalTimestamp = new Date().toISOString();
    this.anonymousId = null;
    this.userId = null;
    this.event = null;
    this.properties = {};
    this.integrations = {};
    // By default, all integrations will be set as enabled from client
    // Decision to route to specific destinations will be taken at server end
    this.integrations.All = true;
  }

  // Get property
  getProperty(key) {
    return this.properties[key];
  }

  // Add property
  addProperty(key, value) {
    this.properties[key] = value;
  }
}
export default RudderMessage;
