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
 * This function is used to trigger a callback.
 * @param {*} standardEventsMap - mapping of events done by the user
 * @param {*} eventName - standard event name
 * @param {*} data
 */
const makeACall = (standardEventsMap, eventName, data) => {
  // stroring all the supported standard event names
  const eventNames = Object.keys(standardEventsMap);
  // stroing default event name in the updatedEvent
  let updatedEvent = standardEventsListMapping[eventName];
  // Updating the event name with any mapping from the webapp
  eventNames.forEach((event) => {
    if (standardEventsMap[event] === eventName) {
      updatedEvent = event;
    }
  });
  // Populating Properties
  const properties = {};
  if (data) {
    if (data.cta) {
      const { cta } = data;
      properties.cta_name = cta.name;
      properties.cta_type = cta.cta_type;
      properties.cta_id = cta.id;
    }
    if (data.variant) {
      properties.cta_variant = data.variant;
    }
    if (data.step) {
      properties.cta_step = data.step;
    }
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
 * @param {*} eventsMappping - Mapping of events in the webapp by the user
 * @param {*} eventsList - List of requested events by the user.
 */
const trigger = (eventsMappping, eventsList) => {
  const standardEventsMap = getHashFromArray(eventsMappping);
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
      if (eventsList.includes(event.type)) {
        makeACall(standardEventsMap, event.type, event.detail);
      }
    });
  });
};

export { makeACall, trigger };
