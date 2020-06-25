// Core message class with default values
import { generateUUID } from "./utils";
import { MessageType, ECommerceEvents } from "./constants";
import RudderContext from "./RudderContext";

class RudderMessage {
  constructor() {
    this.channel = "web";
    this.context = new RudderContext();
    this.type = null;
    this.action = null;
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

  // Validate whether this message is semantically valid for the type mentioned
  validateFor(messageType) {
    // First check that properties is populated
    if (!this.properties) {
      throw new Error("Key properties is required");
    }
    // Event type specific checks
    switch (messageType) {
      case MessageType.TRACK:
        // check if event is present
        if (!this.event) {
          throw new Error("Key event is required for track event");
        }
        // Next make specific checks for e-commerce events
        if (this.event in Object.values(ECommerceEvents)) {
          switch (this.event) {
            case ECommerceEvents.CHECKOUT_STEP_VIEWED:
            case ECommerceEvents.CHECKOUT_STEP_COMPLETED:
            case ECommerceEvents.PAYMENT_INFO_ENTERED:
              this.checkForKey("checkout_id");
              this.checkForKey("step");
              break;
            case ECommerceEvents.PROMOTION_VIEWED:
            case ECommerceEvents.PROMOTION_CLICKED:
              this.checkForKey("promotion_id");
              break;
            case ECommerceEvents.ORDER_REFUNDED:
              this.checkForKey("order_id");
              break;
            default:
          }
        } else if (!this.properties.category) {
          // if category is not there, set to event
          this.properties.category = this.event;
        }

        break;
      case MessageType.PAGE:
        break;
      case MessageType.SCREEN:
        if (!this.properties.name) {
          throw new Error("Key 'name' is required in properties");
        }
        break;
    }
  }

  // Function for checking existence of a particular property
  checkForKey(propertyName) {
    if (!this.properties[propertyName]) {
      throw new Error(`Key '${propertyName}' is required in properties`);
    }
  }
}
export default RudderMessage;
