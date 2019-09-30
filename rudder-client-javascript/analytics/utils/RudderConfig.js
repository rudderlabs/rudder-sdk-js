import { BASE_URL, FLUSH_QUEUE_SIZE } from "./constants";
//Rudder configration class
/* let RudderConfig = function() {
    let instance;
  
    function init() {
      //Private variables
      let endPointUri = RudderConstant.BASE_URL;
      let flushQueueSize = RudderConstant.FLUSH_QUEUE_SIZE;
      let integrations = [];
  
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
  constructor() {
    this.instance = null;
  }
  init() {
    //Private variables
    let endPointUri = BASE_URL;
    let flushQueueSize = FLUSH_QUEUE_SIZE;
    let integrations = [];

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
