// Core message class with default values
import { generateUUID } from './utils';
import RudderContext from './RudderContext';

class RudderMessage {
  constructor() {
    this.channel = 'web';
    this.context = new RudderContext();
    this.type = null;
    this.messageId = generateUUID();
    this.originalTimestamp = new Date().toISOString();
    this.anonymousId = null;
    this.userId = null;
    this.event = null;
    this.properties = {};
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
