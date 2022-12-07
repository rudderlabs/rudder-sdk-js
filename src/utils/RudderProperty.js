// Generic class to model various properties collection to be provided for messages
class RudderProperty {
  constructor() {
    this.propertyMap = {};
  }

  getPropertyMap() {
    return this.propertyMap;
  }

  getProperty(key) {
    return this.propertyMap[key];
  }

  setProperty(key, value) {
    this.propertyMap[key] = value;
  }

  setPropertyMap(inputPropertyMap) {
    if (!this.propertyMap) {
      this.propertyMap = inputPropertyMap;
    } else {
      Object.keys(inputPropertyMap).forEach((key) => {
        this.propertyMap[key] = inputPropertyMap[key];
      });
    }
  }
}

export { RudderProperty };
