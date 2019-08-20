//  -----------------------------------------------------------------------
//  <copyright file="RudderAnalyticsClient.js" company="Rudder Labs">
//   Copyright (c) 2019 Rudder Labs All rights reserved.
//  </copyright>
//  <author>Rudder Labs</author>
//  -----------------------------------------------------------------------


//Utility function for UUID genration
function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function'){
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

//Event Type enumeration
var EventType = {
    TRACK: "track",
    PAGE: "page",
    SCREEN: "screen",
    IDENTIFY: "identify"
};

const BASE_URL = "";

//Singleton implementation of the core SDK client class
var Analytics = (function () {
 
    // Instance stores a reference to the Singleton
    var instance;

   
    function init() {

        //Private variables and methods
        

        //Public variables and methods
        return {

            //Track function
            track: function(event){
                if(event.message){ //process only if valid message is there
                    event.message.validateFor(EventType.TRACK);
                    //validated, now set event type and add to flush queue
                    event.message.type = EventType.TRACK.value;
                    addToFlushQueue(event);
                }

            }
        };
    
    };
   
    return {
   
        // Get the Singleton instance if one exists
        // or create one if it doesn't
        getInstance: function (context,
                                flushQueueSize = 10,
                                endPointUri = BASE_URL,
                                shouldCache = true) {

            if ( !instance ) {
                if (!context || !context.applicationContext){
                    throw new Error("Application context cannot be null");
                }

                console.log(JSON.stringify(context));
                instance = init();

                //Initialize
                instance.context = context;
                instance.flushQueueSize = flushQueueSize;
                instance.endPointUri = endPointUri;
                instance.shouldCache = shouldCache;
            }

            return instance;
        }

    };
   
})();

//Core message class with default values
class RudderMessage {

    constructor(){
        this.rl_channel = "web";
        this.rl_context = null;
        this.rl_type = null;
        this.rl_action = null;
        this.rl_message_id = generateUUID().toString();
        this.rl_timestamp = new Date().getTime();
        this.rl_anonymous_id = null;
        this.rl_user_id = null;
        this.rl_event = null;
        this.rl_properties = new Map();
        this.rl_integrations = [];

    }

    //Get property
    getProperty(key){
        return this.rl_properties.get(key);
    }

    //Add property
    addProperty(key, value){
        this.rl_properties.set(key, value);
    }

    //Validate whether this message is semantically valid for the 
    //event type mentioned
    validateFor (eventType){

    }
}

//Context class
class RudderContext {
    constructor(){
        this.rl_app = null;
        this.rl_traits = null;
        this.rl_library = null;
        this.rl_os = null;
        this.rl_screen = null;
        //User agent and locale can be retrieved only for browser
        //For server-side integration, same needs to be set by calling program
        if (typeof window === 'undefined') { //server-side integration
            this.rl_user_agent = null;
            this.rl_locale = null;
        } else { //running within browser
            this.rl_user_agent = navigator.userAgent;
            //property name differs based on browser version
            this.rl_locale = navigator.language || navigator.browserLanguage;
        }
        this.rl_device = null;
        this.rl_network = null;
    }
}

//Application class
class RudderApp {
    constructor(){
        this.rl_build = "";
        this.rl_name = "";
        this.rl_namespace = "";
        this.rl_version = "";
    
    }
}

//Traits class
class RudderTraits {


}
//Test code
context = new RudderContext();
context.applicationContext = {};
var Instance1 = Analytics.getInstance(context);
var Instance2 = Analytics.getInstance(context);


console.log(Instance1 == Instance2); //check reference equality
console.log(Instance1.flushQueueSize);
Instance1.flushQueueSize = 5;
console.log(Instance2.flushQueueSize); //reconfirm
console.log(JSON.stringify(new RudderMessage()));

  