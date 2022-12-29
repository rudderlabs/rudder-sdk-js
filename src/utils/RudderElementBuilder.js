// Class responsible for building up the individual elements in a batch
// that is transmitted by the SDK
import RudderElement from './RudderElement';

class RudderElementBuilder {
  constructor() {
    this.rudderProperty = null;
    this.rudderUserProperty = null;
    this.event = null;
    this.userId = null;
    this.type = null;
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
