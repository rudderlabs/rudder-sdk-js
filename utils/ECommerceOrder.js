// Class representing e-commerce order object
class ECommerceOrder {
  constructor() {
    this.order_id = "";
    this.affiliation = "";
    this.total = 0;
    this.value = 0;
    this.revenue = 0;
    this.shipping = 0;
    this.tax = 0;
    this.discount = 0;
    this.coupon = "";
    this.currency = "";
    this.products = [];
  }

  // Generic setter methods to enable builder pattern
  setOrderId(orderId) {
    this.order_id = orderId;
    return this;
  }

  setAffiliation(affiliation) {
    this.affiliation = affiliation;
    return this;
  }

  // Total and Value are set to same amount as they've been used interachangeably
  setTotal(total) {
    this.value = total;
    this.total = total;
    return this;
  }

  setValue(value) {
    this.value = value;
    this.total = value;
    return this;
  }

  setRevenue(revenue) {
    this.revenue = revenue;
    return this;
  }

  setShipping(shipping) {
    this.shipping = shipping;
    return this;
  }

  setTax(tax) {
    this.tax = tax;
    return this;
  }

  setDiscount(discount) {
    this.discount = discount;
    return this;
  }

  setCoupon(coupon) {
    this.coupon = coupon;
    return this;
  }

  setCurrency(currency) {
    this.currency = currency;
    return this;
  }

  addProducts(productsToBeAdded) {
    if (productsToBeAdded) {
      // add only if not-null
      if (!this.products) {
        // check for null array
        this.products = [];
      }
      this.products.push(...productsToBeAdded);
    }
    return this; // to aid builder pattern
  }

  addProduct(productToBeAdded) {
    if (productToBeAdded) {
      // add only if not-null
      if (!this.products) {
        // check for null array
        this.products = [];
      }

      this.products.push(productToBeAdded);
    }
    return this; // to aid builder pattern
  }
}

module.exports = {
  ECommerceOrder,
};
