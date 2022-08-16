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
 * This function is used to make a track Call to rudderstack.
 * @param {*} standardEventsMap - mapping of events done by the user
 * @param {*} eventName - standard event name
 * @param {*} data
 */
const makeACall = (standardEventsMap, eventName, data) => {
  const eventNames = Object.keys(standardEventsMap);
  let updatedEvent = standardEventsListMapping[eventName];
  eventNames.forEach((event) => {
    if (standardEventsMap[event].includes(eventName)) {
      updatedEvent = event;
    }
  });
  const properties = {};
  if (data) {
    if (data.cta) {
      const { cta } = data;
      properties.cta_name = cta.name;
      properties.cta_type = cta.cta_type;
      properties.cta_id = cta.id;
    }
    if (data.variant) {
      properties.cta_variant = data.variant.variation;
    }
    if (data.step) {
      properties.cta_step = data.step.position;
    }
  }
  if (isDefinedAndNotNullAndNotEmpty(properties)) {
    window.rudderanalytics.track(updatedEvent, properties);
  } else {
    window.rudderanalytics.track(updatedEvent);
  }
};

const trigger = () => {
  const standardEventsMap = getHashFromArray(this.eventsMappping);
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
    window.addEventListener(events, function (event, data) {
      if (this.eventsList === event) {
        makeACall(standardEventsMap, event, data);
      }
    });
  });
};

export { makeACall, trigger };
