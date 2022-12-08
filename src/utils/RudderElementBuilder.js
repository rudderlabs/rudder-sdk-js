// Class responsible for building up the individual elements in a batch
// that is transmitted by the SDK
import RudderElement from "./RudderElement.js";

class RudderElementBuilder {
  constructor() {
    this.rudderProperty = null;
    this.rudderUserProperty = null;
    this.event = null;
    this.userId = null;
    this.channel = null;
    this.type = null;
  }

  // Set the property
  setProperty(inputRudderProperty) {
    this.rudderProperty = inputRudderProperty;
    return this;
  }

  // Build and set the property object
  setPropertyBuilder(rudderPropertyBuilder) {
    this.rudderProperty = rudderPropertyBuilder.build();
    return this;
  }

  setUserProperty(inputRudderUserProperty) {
    this.rudderUserProperty = inputRudderUserProperty;
    return this;
  }

  setUserPropertyBuilder(rudderUserPropertyBuilder) {
    this.rudderUserProperty = rudderUserPropertyBuilder.build();
    return this;
  }

  // Setter methods for all variables. Instance is returned for each call in
  // accordance with the Builder pattern

  setEvent(event) {
    this.event = event;
    return this;
  }

  setUserId(userId) {
    this.userId = userId;
    return this;
  }

  setChannel(channel) {
    this.channel = channel;
    return this;
  }

  setType(eventType) {
    this.type = eventType;
    return this;
  }

  build() {
    const element = new RudderElement();
    element.setUserId(this.userId);
    element.setType(this.type);
    element.setEventName(this.event);
    element.setProperty(this.rudderProperty);
    element.setUserProperty(this.rudderUserProperty);
    return element;
  }
}
export default RudderElementBuilder;
