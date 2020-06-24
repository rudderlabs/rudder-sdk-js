// Class representing an e-commerce cart
class ECommerceCart {
  constructor() {
    this.cart_id = "";
    this.products = [];
  }

  addProducts(productsToBeAdded) {
    if (productsToBeAdded) {
      // add only if not-null
      this.products.push(...productsToBeAdded);
    }
    return this; // to aid builder pattern
  }

  addProduct(productToBeAdded) {
    if (productToBeAdded) {
      // add only if not-null
      this.products.push(productToBeAdded);
    }
    return this; // to aid builder pattern
  }
}

module.exports = {
  ECommerceCart,
};
