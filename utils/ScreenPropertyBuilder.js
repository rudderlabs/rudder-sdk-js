const RudderProperty = require("./RudderProperty");

// Class for building the "screen" message payload
class ScreenPropertyBuilder {
  constructor() {
    this.name = "";
  }

  build() {
    if (!this.name || this.name === 0) {
      throw new Error("Screen name cannot be null or empty");
    }

    const screenProperty = new RudderProperty();
    screenProperty.setProperty("name", this.name);
    return screenProperty;
  }
}

export { ScreenPropertyBuilder };
