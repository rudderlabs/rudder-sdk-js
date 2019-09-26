import { BASE_URL, FLUSH_QUEUE_SIZE } from "./constants"
//Rudder configration class
/* var RudderConfig = function() {
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
    }
  }; */

class RudderConfig {
    constructor(){
        this.instance = null;
    }
    init() {
      //Private variables
      var endPointUri = BASE_URL;
      var flushQueueSize = FLUSH_QUEUE_SIZE;
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
    getDefaultConfig() {
        if (!this.instance) {
            this.instance = this.init();
        }
        return this.instance;
    }
  }
  let rudderConfig = new RudderConfig().getDefaultConfig();
  console.log(rudderConfig);

  export { rudderConfig as RudderConfig };