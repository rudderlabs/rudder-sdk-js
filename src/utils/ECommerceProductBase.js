// Parent class of e-commerce product
class ECommerceProductBase {
  constructor() {
    this.product_id = "";
  }

  // Setter methods in accordance with Builder pattern
  setProductId(productId) {
    this.product_id = productId;
    return this;
  }
}

module.exports = {
  ECommerceProductBase,
};
