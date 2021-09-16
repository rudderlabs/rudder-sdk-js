// Class encapsulating checkout details
class ECommerceCheckout {
  constructor() {
    this.checkout_id = "";
    this.step = -1;
    this.shipping_method = "";
    this.payment_method = "";
  }

  // Setter methods in accordance to Builder pattern
  setCheckoutId(checkoutId) {
    this.checkout_id = checkoutId;
    return this;
  }

  setStep(step) {
    this.step = step;
    return this;
  }

  setShippingMethod(shippingMethod) {
    this.shipping_method = shippingMethod;
    return this;
  }

  setPaymentMethod(paymentMethod) {
    this.payment_method = paymentMethod;
    return this;
  }
}

module.exports = {
  ECommerceCheckout,
};
