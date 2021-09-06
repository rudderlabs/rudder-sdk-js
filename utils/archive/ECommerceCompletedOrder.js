const ECommerceOrder = require("./ECommerceOrder");
// Class representing completed e-commerce order
class ECommerceCompletedOrder extends ECommerceOrder {
  constructor() {
    super();
    this.checkout_id = "";
  }

  // Setter method in accordance with Builder pattern
  setCheckoutId(checkoutId) {
    this.checkout_id = checkoutId;
    return this;
  }
}

module.exports = {
  ECommerceCompletedOrder,
};
