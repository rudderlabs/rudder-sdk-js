import { RudderProperty } from "./RudderProperty";

// Parent class of promotion viewed and promotion clicked events
class PromotionEvent {
  constructor() {
    this.promotion = null;
  }

  // Setter method in accordance to Builder pattern
  setPromotion(promotion) {
    this.promotion = promotion;
    return this;
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setPropertyMap(this.promotion);
    return eventProperty;
  }
}

export default PromotionEvent;
