// Class representing e-commerce promotion
class ECommercePromotion {
  constructor() {
    this.promotion_id = "";
    this.creative = "";
    this.name = "";
    this.position = 0;
  }

  // Setter methods in accordance with Builder pattern
  setPromotionId(promotionId) {
    this.promotion_id = promotionId;
    return this;
  }

  setCreative(creative) {
    this.creative = creative;
    return this;
  }

  setName(name) {
    this.name = name;
    return this;
  }

  setPosition(position) {
    this.position = position;
    return this;
  }
}

export default ECommercePromotion;
