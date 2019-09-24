var RudderConstant = require("./utils.constants.js");
//Rudder configration class
var RudderConfig = (function() {
    var instance;
  
    function init() {
      //Private variables
      var endPointUri = RudderConstant.BASE_URL;
      var flushQueueSize = RudderConstant.FLUSH_QUEUE_SIZE;
      var integrations = [];
  
      //Public methods
      return {
        getDefaultIntegrations: function() {
          return [];
        },
  
        getEndPointUri: function() {
          return endPointUri;
        },
  
        getFlushQueueSize: function() {
          return this.flushQueueSize;
        },
  
        getIntegrations: function() {
          return this.integrations;
        },
  
        setIntegrations: function(integrations) {
          this.integrations = integrations;
          return this;
        },
  
        setFlushQueueSize: function(flushQueueSize) {
          this.flushQueueSize = flushQueueSize;
          return this;
        },
  
        setEndPointUri: function(endPointUri) {
          this.endPointUri = endPointUri;
          return this;
        }
      };
    }
  
    return {
      getDefaultConfig: function() {
        if (!instance) {
          instance = init();
        }
        return instance;
      }
    };
  })();

  module.exports = {
    RudderConfig: RudderConfig
  };