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
  cfClosed: "CTA Closed",
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
  // storing all the supported standard event names
  const eventNames = Object.keys(standardEventsMap);
  // storing default event name in the updatedEvent
  let updatedEvent = standardEventsListMapping[eventName];
  // Updating the event name with any mapping from the webapp
  eventNames.forEach((event) => {
    if (standardEventsMap[event] === eventName) {
      updatedEvent = event;
    }
  });

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
  const standardEventsMap = getHashFromArray(userDefinedEventsMappping);
  const standardEventsList = [
    "cfReady",
    "cfView",
    "cfConversion",
    "cfCompletion",
    "cfSubmit",
    "cfAddToCart",
    "cfClosed",
  ];
  standardEventsList.forEach((events) => {
    window.addEventListener(events, function (event) {
      if (userDefinedEventsList.includes(event.type)) {
        makeACall(standardEventsMap, event.type, event.detail);
      }
    });
  });
};

export { makeACall, trigger };
