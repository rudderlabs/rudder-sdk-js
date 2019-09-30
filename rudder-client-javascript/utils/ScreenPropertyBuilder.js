"use strict";
var RudderProperty = require("./RudderProperty");

//Class for building the "screen" message payload
class ScreenPropertyBuilder {
  constructor() {
    this.name = "";
  }

  build() {
    if (!this.name || 0 === this.name) {
      throw new Error("Screen name cannot be null or empty");
    }

    var screenProperty = new RudderProperty();
    screenProperty.setProperty("name", this.name);
    return screenProperty;
  }
}

export { ScreenPropertyBuilder };
