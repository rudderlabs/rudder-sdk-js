const { ECommerceEvents } = require("./constants");
const RudderProperty = require("./RudderProperty");

// Class representing payment info entered event
class PaymentInfoEnteredEvent {
  constructor() {
    this.paymentInfo = null;
  }

  event() {
    return ECommerceEvents.PAYMENT_INFO_ENTERED;
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this.paymentInfo);
    return eventProperty;
  }

  // Setter method in accordance with Builder pattern
  setPaymentInfo(paymentInfo) {
    this.paymentInfo = paymentInfo;
    return this;
  }
}

module.exports = {
  PaymentInfoEnteredEvent,
};
