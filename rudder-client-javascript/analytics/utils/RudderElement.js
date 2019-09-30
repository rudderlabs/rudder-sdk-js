import RudderMessage from "./RudderMessage";
//Individual element class containing Rudder Message
class RudderElement {
  constructor() {
    this.rl_message = new RudderMessage();
  }

  //Setters that in turn set the field values for the contained object
  setType(type) {
    this.rl_message.rl_type = type;
  }

  setProperty(rudderProperty) {
    this.rl_message.rl_properties = rudderProperty;
  }

  setUserProperty(rudderUserProperty) {
    this.rl_message.rl_user_properties = rudderUserProperty;
  }

  setUserId(userId) {
    this.rl_message.rl_user_id = userId;
  }

  setEventName(eventName) {
    this.rl_message.rl_event = eventName;
  }

  updateTraits(traits) {
    this.rl_message.rl_context.rl_traits = traits;
  }

  getElementContent() {
    return this.rl_message;
  }
}
export default RudderElement;
