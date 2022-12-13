const RudderProperty = require("./RudderProperty");
const { ECommerceParamNames } = require("./constants");

// Parent class for all social media sharing events
class ShareEvent {
  constructor() {
    this.share_via = "";
    this.share_message = "";
    this.recipient = "";
  }

  build() {
    const eventProperty = new RudderProperty();
    eventProperty.setProperty(ECommerceParamNames.SHARE_VIA, this.share_via);
    eventProperty.setProperty(
      ECommerceParamNames.SHARE_MESSAGE,
      this.share_message
    );
    eventProperty.setProperty(ECommerceParamNames.RECIPIENT, this.recipient);
    return eventProperty;
  }

  // Setter methods in accordance to Builder pattern
  setShareVia(shareVia) {
    this.share_via = shareVia;
    return this;
  }

  setShareMessage(shareMessage) {
    this.share_message = shareMessage;
    return this;
  }

  setRecipient(recipient) {
    this.recipient = recipient;
    return this;
  }
}

module.exports = {
  ShareEvent,
};
