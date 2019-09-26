import { getJSONTrimmed } from "../utils/utils";
import { CONFIG_URL, BASE_URL} from "../utils/constants";
import { integrations } from "./integrations";
import { RudderElementBuilder } from "../utils/RudderElementBuilder";
import { getCurrentTimeFormatted } from "../utils/utils";
import { replacer } from "../utils/utils";
import { RudderPayload } from "../utils/RudderPayload";

function init(intgArray, configArray) {
  console.log("supported intgs ", integrations);
  let i = 0;
  this.clientIntegrationObjects = [];
  if(!intgArray || intgArray.length == 0){
    this.toBeProcessedByIntegrationArray = [];
    return
  }
  intgArray.forEach(intg => {
    console.log("--name--", intg);
    let intgClass = integrations[intg];
    console.log("--class-- ", intgClass);
    if (intg === "HS") {
      let hubId = configArray[i].hubId;
      console.log("==hubId== " + hubId);
      hubId = "6405167";
      let intgInstance = new intgClass(hubId);
      intgInstance.init();

      this.clientIntegrationObjects.push(intgInstance);
    }
  });

  for (let i = 0; i < this.clientIntegrationObjects.length; i++) {
    //send the queued events to the fetched integration
    this.toBeProcessedByIntegrationArray.forEach(event => {
      let methodName = event[0];
      event.shift();
      console.log(
        "replay on integrations " + "method " + methodName + " args " + event
      );
      this.clientIntegrationObjects[i][methodName](...event);
    });
  }

  this.toBeProcessedByIntegrationArray = [];
}

function flush(rudderElement) {
  //For Javascript SDK, event will be transmitted immediately
  //so buffer is really kept to be in alignment with other SDKs
  this.eventsBuffer = [];

  this.eventsBuffer.push(rudderElement); //Add to event buffer

  //construct payload
  var payload = new RudderPayload();
  payload.batch = this.eventsBuffer;
  payload.write_key = this.write_key;
  payload.sent_at = getCurrentTimeFormatted();
  //server-side integration, XHR is node module

  var xhr = new XMLHttpRequest();
  
  console.log("==== in flush ====");
  console.log(JSON.stringify(payload, replacer));

  xhr.open("POST", BASE_URL, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  //register call back to reset event buffer on successfull POST
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      this.eventsBuffer = []; //reset event buffer
    }
  };
  //xhr.send(JSON.stringify(payload, replacer));
  console.log("===flushed to Rudder BE");
}

class test {
  constructor() {
    this.prop1 = "val1";
    this.prop2 = "val2";
    this.ready = false;
    this.clientIntegrations = [];
    this.configArray = [];
    this.clientIntegrationObjects = undefined;
    this.toBeProcessedArray = [];
    this.toBeProcessedByIntegrationArray = [];
  }

  processResponse(status, response) {
    console.log("from callback " + this.prop1);
    console.log(response);
    response = JSON.parse(response);
    response.source.destinations.forEach(function(destination, index) {
      console.log(
        "Destination " +
          index +
          " Enabled? " +
          destination.enabled +
          " Type: " +
          destination.destinationDefinition.name +
          " Use Native SDK? " +
          destination.config.useNativeSDK
      );
      if (destination.enabled && destination.config.useNativeSDK) {
        this.clientIntegrations.push(destination.destinationDefinition.name);
        this.configArray.push(destination.config);
      }
    }, this);
    init.call(this, this.clientIntegrations, this.configArray);
  }

  page() {
    console.log("type=== " + typeof arguments);

    var args = Array.from(arguments);
    console.log("args ", args);

    var rudderElement = new RudderElementBuilder().build();
    //console.log(typeof(arguments[0]))
    if(arguments.length > 0){
        //console.log("arg length ",arguments.length)
        let methodArguments = arguments//arguments[0]
        if(methodArguments[0]){
            console.log("arg0 ", methodArguments[0])
            rudderElement['rl_message']['rl_name'] = methodArguments[0]//JSON.parse(arguments[1]);
        }
        //console.log("arg1 ",methodArguments[1])
        if(methodArguments[1]){
            console.log(JSON.parse(JSON.stringify(methodArguments[1])))
            rudderElement['rl_message']['rl_properties'] = methodArguments[1]//JSON.parse(arguments[1]);
        }
        
    }
    console.log(JSON.stringify(rudderElement));

    //try to first send to all integrations, if list populated from BE
    if(this.clientIntegrationObjects){
      this.clientIntegrationObjects.forEach(obj => {
        //obj.page(...arguments);
        console.log("called in normal flow");
        //obj.page({ rl_message: { rl_properties: { path: "/abc-123" } } }); //test
        obj.page(rudderElement)
      });
    }
    

    if (!this.clientIntegrationObjects
      /*this.clientIntegrationObjects.length === 0  &&
      args[args.length - 1] != "wait" */
    ) {
      console.log("pushing in replay queue");
      args.unshift("page");
      //this.toBeProcessedArray.push(args); //new event processing after analytics initialized  but integrations not fetched from BE
      this.toBeProcessedByIntegrationArray.push(["page", rudderElement]);
    }

    // self analytics process
    console.log("args ", args.slice(0, args.length - 1));

    flush.call(rudderElement)

    console.log("page called " + this.prop1);
  }

  track() {
    console.log("track called " + this.prop2);
  }

  load(writeKey) {
    console.log("inside load " + this.prop1);
    getJSONTrimmed(
      this,
      CONFIG_URL + "/source-config?write_key=" + writeKey,
      this.processResponse
    );
  }
}

let instance = new test();

if (process.browser) {
  console.log("is present? " + !!window.analytics);
  let eventsPushedAlready =
    !!window.analytics && window.analytics.push == Array.prototype.push;

  let methodArg = window.analytics ? window.analytics[0] : [];
  if (methodArg.length > 0 && methodArg[0] == "load") {
    instance[methodArg[0]](methodArg[1]);
    //instance[methodArgNext[0]]("test args 1", "test args 2");
  }

  if (eventsPushedAlready) {
    for (let i = 1; i < window.analytics.length; i++) {
      instance.toBeProcessedArray.push(window.analytics[i]);
    }

    console.log("queued " + instance.toBeProcessedArray.length);

    for (let i = 0; i < instance.toBeProcessedArray.length; i++) {
      let event = [...instance.toBeProcessedArray[i]];
      console.log("replay event " + event);
      let method = event[0];
      event.push("wait");
      event.shift();
      console.log("replay event modified " + event);
      instance[method](...event);
    }
    instance.toBeProcessedArray = [];
  }

  /* while (!instance.ready) {
    let isReady = true;
    instance.clientIntegrationObjects.forEach(obj => {
      isReady = isReady && obj.loaded();
    });
    instance.ready = instance.clientIntegrationObjects.length > 0 && isReady;
  }

  console.log("is script ready " + instance.ready);

  console.log(
    " is hubspot loaded ",
    !!(window._hsq && window._hsq.push !== Array.prototype.push)
  );

  console.log("analytics array " + window.analytics);
  let methodArgNext = window.analytics ? window.analytics[1] : [];

  if (methodArgNext.length > 0) {
    instance[methodArg[0]](methodArg[1]);
  } */
}

let page = instance.page.bind(instance);
let track = instance.track.bind(instance);
let load = instance.load.bind(instance);

export { page, track, load };
