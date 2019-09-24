//Payload class, contains batch of Elements
class RudderPayload {
    constructor() {
      this.batch = null;
      this.write_key = null;
    }
  }
  module.exports = {
    RudderPayload: RudderPayload
  };