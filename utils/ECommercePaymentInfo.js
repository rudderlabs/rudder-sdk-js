const ECommerceCheckout = require("./ECommerceCheckout");

// Class representing Payment Info
class ECommercePaymentInfo extends ECommerceCheckout {
  constructor() {
    super();
    this.order_id = "";
  }

  // Setter methods in accordance to Builder pattern
  setOrderId(orderId) {
    this.order_id = orderId;
    return this;
  }
}

module.exports = {
  ECommercePaymentInfo,
};
