//Core message class with default values
import { generateUUID } from "./utils";
import { MessageType, ECommerceEvents } from "./constants";
import RudderContext from "./RudderContext";
class RudderMessage {
  constructor() {
    this.rl_channel = "web";
    this.rl_context = new RudderContext();
    this.rl_type = null;
    this.rl_action = null;
    this.rl_message_id = generateUUID().toString();
    this.rl_timestamp = new Date().getTime();
    this.rl_anonymous_id = generateUUID().toString();
    this.rl_user_id = null;
    this.rl_event = null;
    this.rl_properties = {};

    //By default, all integrations will be set as enabled from client
    //Decision to route to specific destinations will be taken at server end
    this.rl_integrations = {};
    this.rl_integrations["all"] = true;
  }

  //Get property
  getProperty(key) {
    return this.rl_properties[key];
  }

  //Add property
  addProperty(key, value) {
    this.rl_properties[key] = value;
  }

  //Validate whether this message is semantically valid for the type mentioned
  validateFor(messageType) {
    //First check that rl_properties is populated
    if (!this.rl_properties) {
      throw new Error("Key rl_properties is required");
    }
    //Event type specific checks
    switch (messageType) {
      case MessageType.TRACK:
        //check if rl_event is present
        if (!this.rl_event) {
          throw new Error("Key rl_event is required for track event");
        }
        //Next make specific checks for e-commerce events
        if (this.rl_event in Object.values(ECommerceEvents)) {
          switch (this.rl_event) {
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
        } else if (!this.rl_properties["rl_category"]) {
          //if rl_category is not there, set to rl_event
          this.rl_properties["rl_category"] = this.rl_event;
        }

        break;
      case MessageType.PAGE:
        break;
      case MessageType.SCREEN:
        if (!this.rl_properties["name"]) {
          throw new Error("Key 'name' is required in rl_properties");
        }
        break;
    }
  }

  //Function for checking existence of a particular property
  checkForKey(propertyName) {
    if (!this.rl_properties[propertyName]) {
      throw new Error(
        "Key '" + propertyName + "' is required in rl_properties"
      );
    }
  }
}
export default RudderMessage;
