/* eslint-disable no-underscore-dangle */
import { getHashFromArray } from '../../utils/commonUtils';

const integrationContext = {
  name: "Satismeter",
  version: "1.0.0",
};

// supported callback events
const standardEventsList = ["display", "progress", "complete", "dismiss"];

/**
 * This function is used to trigger a callback
 * @param {*} standardEventsMap mapping of events done by the user
 * @param {*} eventName standard event name
 * @param {*} updateEventNames boolean variable to change eventName
 */
const triggerCallback = (
  standardEventsMap,
  eventName,
  updateEventNames,
  events
) => {
  const updatedEvent =
    standardEventsMap[eventName] && updateEventNames
      ? standardEventsMap[eventName]
      : eventName;
  const updatedEvents = events;
  updatedEvents[eventName] = (event) => {
    window.rudderanalytics.track(`${updatedEvent}`, event, {
      context: { integration: integrationContext },
    });
  };
  return updatedEvents;
};
/**
 * This function has event listeners for the occurring events and to make a call for the event after collecting the data.
 * @param {*} updateEventNames boolean variable to change eventName
 * @param {*} userDefinedEventsList list of requested events by the user
 * @param {*} userDefinedEventsMapping mapping of events in the webapp by the user
 */
const recordSatismeterEvents = (
  updateEventNames,
  userDefinedEventsList,
  userDefinedEventsMapping
) => {
  const standardEventsMap = getHashFromArray(userDefinedEventsMapping);
  let events = {};
  standardEventsList.forEach((eventName) => {
    if (userDefinedEventsList.includes(eventName)) {
      events = triggerCallback(
        standardEventsMap,
        eventName,
        updateEventNames,
        events
      );
    }
  });
  window.satismeter({ events });
};

export { recordSatismeterEvents };
