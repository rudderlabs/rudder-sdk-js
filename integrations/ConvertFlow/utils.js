import {
  getHashFromArray,
  isDefinedAndNotNullAndNotEmpty,
} from "../utils/commonUtils";

// default mapping for the events
const standardEventsListMapping = {
  cfReady: "CTA Ready",
  cfView: "CTA Viewed",
  cfConversion: "CTA Converted",
  cfCompletion: "CTA Completed",
  cfSubmit: "CTA Form Submitted",
  cfAddToCart: "Product Added to Cart",
  cfClose: "CTA Closed",
};

const swapKeyValuePairs = (standardEventsMap) => {
  const swappedEventsMap = {};
  Object.keys(standardEventsMap).forEach((key) => {
    swappedEventsMap[standardEventsMap[key]] = key;
  });
  return swappedEventsMap;
};

/**
 * This function is used to populate properties to be sent in track call using the event data
 * @param {*} data - data here, contains all the details about the event.
 * eg. For event CTA Viewed
 * data: {
 * cta_name: {cta.name}
 * cta_type: {cta.cta_type}
 * }
 */
const populatingProperties = (data) => {
  const rudderProperties = {};
  if (data.cta) {
    const { cta } = data;
    rudderProperties.cta_name = cta.name;
    rudderProperties.cta_type = cta.cta_type;
    rudderProperties.cta_id = cta.id;
  }
  if (data.variant) {
    rudderProperties.cta_variant = data.variant;
  }
  if (data.step) {
    rudderProperties.cta_step = data.step;
  }
  return rudderProperties;
};

/**
 * This function is used to trigger a callback.
 * @param {*} standardEventsMap - mapping of events done by the user
 * @param {*} eventName - standard event name
 * @param {*} data - data here, contains all the details about the event.
 * eg. For event CTA Viewed
 * data: {
 * cta_name: {cta.name}
 * cta_type: {cta.cta_type}
 * }
 */
const makeACall = (standardEventsMap, eventName, data) => {
  // Updating the event name with any mapping from the webapp if available else
  // storing default event name in the updatedEvent
  const updatedEvent = standardEventsMap[eventName]
    ? standardEventsMap[eventName]
    : standardEventsListMapping[eventName];

  // Populating Properties
  let properties = {};
  if (data) {
    properties = populatingProperties(data);
  }
  if (isDefinedAndNotNullAndNotEmpty(properties)) {
    window.rudderanalytics.track(updatedEvent, properties);
  } else {
    window.rudderanalytics.track(updatedEvent);
  }
};

/**
 * This function has event listners for the occuring events and to make a call for the event after
 * collecting the data.
 * @param {*} userDefinedEventsMappping - Mapping of events in the webapp by the user
 * @param {*} userDefinedEventsList - List of requested events by the user.
 */
const trigger = (userDefinedEventsMappping, userDefinedEventsList) => {
  let standardEventsMap = getHashFromArray(userDefinedEventsMappping);
  standardEventsMap = swapKeyValuePairs(standardEventsMap);
  const standardEventsList = [
    "cfReady",
    "cfView",
    "cfConversion",
    "cfCompletion",
    "cfSubmit",
    "cfAddToCart",
    "cfClose",
  ];
  standardEventsList.forEach((events) => {
    if (userDefinedEventsList.includes(events)) {
      window.addEventListener(events, function (event) {
        makeACall(standardEventsMap, event.type, event.detail);
      });
    }
  });
};

export { makeACall, trigger };
