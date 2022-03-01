const ECommerceProductBase = require("./ECommerceProductBase");

// Class representing e-commerce product object
class ECommerceProduct extends ECommerceProductBase {
  constructor() {
    super();
    this.sku = "";
    this.category = "";
    this.name = "";
    this.brand = "";
    this.variant = "";
    this.price = 0;
    this.currency = "";
    this.quantity = 0;
    this.coupon = "";
    this.position = 0;
    this.url = "";
    this.image_url = "";
  }

  // Setter methods in accordance with Builder pattern
  setSku(sku) {
    this.sku = sku;
    return this;
  }

  setCategory(category) {
    this.category = category;
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setBrand(brand) {
    this.brand = brand;
    return this;
  }

  setVariant(variant) {
    this.variant = variant;
    return this;
  }

  setPrice(price) {
    this.price = price;
    return this;
  }

  setCurrency(currency) {
    this.currency = currency;
    return this;
  }

  setQuantity(quantity) {
    this.quantity = quantity;
    return this;
  }

  setCoupon(coupon) {
    this.coupon = coupon;
    return this;
  }

  setPosition(position) {
    this.position = position;
    return this;
  }

  setUrl(url) {
    this.url = url;
    return this;
  }

  setImageUrl(imageUrl) {
    this.image_url = imageUrl;
    return this;
  }
}

module.exports = {
  ECommerceProduct,
};
