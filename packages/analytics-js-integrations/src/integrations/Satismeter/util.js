/* eslint-disable no-underscore-dangle */
import { getHashFromArray } from '../../utils/commonUtils';

const integrationContext = {
  name: 'Satismeter',
  version: '1.0.0',
};

// supported callback events
const standardEventsList = ['display', 'progress', 'complete', 'dismiss'];

/**
 * This function is used to trigger a callback
 * @param {*} standardEventsMap mapping of events done by the user
 * @param {*} eventName standard event name
 * @param {*} updateEventNames boolean variable to change eventName
 * @param {*} events list of events
 * @param {*} analytics rudderanalytics object
 */
const triggerCallback = (standardEventsMap, eventName, updateEventNames, events, analytics) => {
  const updatedEvent =
    standardEventsMap[eventName] && updateEventNames ? standardEventsMap[eventName] : eventName;
  const updatedEvents = events;
  updatedEvents[eventName] = event => {
    analytics.track(`${updatedEvent}`, event, {
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
 * @param {*} analytics rudderanalytics object
 */
const recordSatismeterEvents = (
  updateEventNames,
  userDefinedEventsList,
  userDefinedEventsMapping,
  analytics,
) => {
  const standardEventsMap = getHashFromArray(userDefinedEventsMapping);
  let events = {};
  standardEventsList.forEach(eventName => {
    if (userDefinedEventsList.includes(eventName)) {
      events = triggerCallback(standardEventsMap, eventName, updateEventNames, events, analytics);
    }
  });
  window.satismeter({ events });
};

export { recordSatismeterEvents };
