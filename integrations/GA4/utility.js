import {
    eventNamesConfigArray,
    itemParametersConfigArray,
  } from "./ECommerceEventConfig";
  
  import { pageEventParametersConfigArray } from "./PageEventConfig";
  
  function isReservedName(name) {
    const reservedEventNames = [
      "ad_activeview",
      "ad_click",
      "ad_exposure",
      "ad_impression",
      "ad_query",
      "adunit_exposure",
      "app_clear_data",
      "app_install",
      "app_update",
      "app_remove",
      "error",
      "first_open",
      "first_visit",
      "in_app_purchase",
      "notification_dismiss",
      "notification_foreground",
      "notification_open",
      "notification_receive",
      "os_update",
      "screen_view",
      "session_start",
      "user_engagement",
    ];
  
    return reservedEventNames.includes(name);
  }
  
  function getDestinationEventName(events) {
    return eventNamesConfigArray.find((p) =>
      p.src.includes(events.toLowerCase())
    );
  }
  
  function getDestinationEventProperties(props, destParameter) {
    const destinationProperties = {};
    const item = {};
    Object.keys(props).forEach((key) => {
      destParameter.forEach((param) => {
        if (key === param.src) {
          if (Array.isArray(param.dest)) {
            param.dest.forEach((d) => {
              const result = d.split(".");
              // Here we only support mapping single level object mapping.
              // To Do Future Scope :: implement using recursion to handle multi level prop mapping
              if (result.length > 1) {
                const levelOne = result[0];
                const levelTwo = result[1];
                item[levelTwo] = props[key];
                if (!destinationProperties[levelOne]) {
                  destinationProperties[levelOne] = [];
                  destinationProperties[levelOne].push(item);
                }
              } else {
                destinationProperties[result] = props[key];
              }
            });
          } else {
            destinationProperties[param.dest] = props[key];
          }
        }
      });
    });
    return destinationProperties;
  }
  
  function getDestinationItemProperties(products, item) {
    const items = [];
    let obj = {};
    products.forEach((p) => {
      obj = {
        ...getDestinationEventProperties(p, itemParametersConfigArray),
        ...(item && item[0]),
      };
      items.push(obj);
    });
    return items;
  }
  
  function getPageViewProperty(props) {
    return getDestinationEventProperties(props, pageEventParametersConfigArray);
  }
  
  export {
    isReservedName,
    getDestinationEventName,
    getDestinationEventProperties,
    getDestinationItemProperties,
    getPageViewProperty,
  };
  