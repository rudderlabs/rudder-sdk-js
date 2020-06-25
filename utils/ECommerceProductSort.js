// Class representing e-commerce product sort
class ECommerceProductSort {
  constructor() {
    this.type = "";
    this.value = "";
  }

  // Setter methods in accordance to Builder pattern
  setType(type) {
    this.type = type;
    return this;
  }

  setValue(value) {
    this.value = value;
    return this;
  }
}

module.exports = {
  ECommerceProductSort,
};
