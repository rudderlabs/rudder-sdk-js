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
  window.rudderanalytics.track(updatedEvent, {
    name: data.cta.name,
    cta_type: data.cta.cta_type,
    id: data.cta.id,
  });
};

export default makeACall;
