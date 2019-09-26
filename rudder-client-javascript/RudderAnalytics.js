import { getJSONTrimmed } from "./utils/utils";
import { CONFIG_URL } from "./utils/constants";
import { RudderElementBuilder } from "./utils/RudderElementBuilder";

class test {
  constructor() {
    this.prop1 = "val1";
    this.prop2 = "val2";
    this.ready = false;
  }

  page() {
    //if (this.ready) {
    console.log("page called " + this.prop1);
    //}
    var rudderElement = new RudderElementBuilder().build();
    console.log(typeof(arguments[0]))
    if(arguments.length > 0){
        console.log("arg length ",arguments.length)
        let methodArguments = arguments//arguments[0]
        if(methodArguments[0]){
            console.log("arg0 ", methodArguments[0])
            rudderElement['rl_message']['rl_name'] = methodArguments[0]//JSON.parse(arguments[1]);
        }
        console.log("arg1 ",methodArguments[1])
        if(methodArguments[1]){
            console.log(JSON.parse(JSON.stringify(methodArguments[1])))
            rudderElement['rl_message']['rl_properties'] = methodArguments[1]//JSON.parse(arguments[1]);
        }
        
    }
    console.log(JSON.stringify(rudderElement));
  }

  track() {
    //if (this.ready) {
    console.log("track called " + this.prop2);
    //}
    var rudderElement = new RudderElementBuilder().build();
    if(arguments.length > 0){
        console.log("arg length ",arguments.length)
        let methodArguments = arguments//arguments[0]
        if(methodArguments[0]){
            console.log("arg0 ", methodArguments[0])
            //rudderElement['rl_message']['rl_name'] = methodArguments[0]//JSON.parse(arguments[1]);
            rudderElement.setEventName(methodArguments[0])
        }
        console.log("arg1 ",methodArguments[1])
        if(methodArguments[1]){
            console.log(JSON.parse(JSON.stringify(methodArguments[1])))
            //rudderElement['rl_message']['rl_properties'] = methodArguments[1]//JSON.parse(arguments[1]);
            rudderElement.setProperty(methodArguments[1])//methodArguments[0]
        }
        
    }
    console.log(JSON.stringify(rudderElement));
  }

  load(writeKey) {
    console.log("inside load " + this.prop1);
    getJSONTrimmed(
      CONFIG_URL + "/source-config?write_key=" + writeKey,
      (status, response) => {
        console.log("from callback " + this.prop1);
        console.log(response);
        this.ready = true;
      }
    );
    /* setTimeout(() => {
      this.ready = true;
    }, 5000); */
  }
}

let instance = new test();

if (window) {
  console.log("is present? " + !!window.analytics);

  let methodCalls = window.analytics;
  console.log(methodCalls);
  methodCalls.forEach(element => {
    let argsLength = element.length;
    console.log("====", argsLength, element)
    let methodName = element[0]
    element.shift()
    if(argsLength > 0){
        console.log("slice====", ...element)
      instance[methodName](...element);
    } else {
      instance[methodName]();
    }
  });
}



let page = instance.page.bind(instance);
let track = instance.track.bind(instance);
let load = instance.load.bind(instance);

export { page, track, load };