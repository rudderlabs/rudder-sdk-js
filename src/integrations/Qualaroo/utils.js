/* eslint-disable no-underscore-dangle */
import { getHashFromArray } from '../../utils/commonUtils';

const integrationContext = {
  name: 'Qualaroo',
  version: '1.0.0',
};

// supported callback events
const standardEventsList = ['show', 'close', 'submit', 'noTargetMatch'];

const swapKeyValuePairs = (standardEventsMap) => {
  const swappedEventsMap = {};
  Object.keys(standardEventsMap).forEach((key) => {
    swappedEventsMap[standardEventsMap[key]] = key;
  });
  return swappedEventsMap;
};

/**
 * This function is used to trigger a callback
 * @param {*} standardEventsMap mapping of events done by the user
 * @param {*} eventName standard event name
 * @param {*} updateEventNames boolean variable to change eventName
 * @param {*} analytics rudderanalytics object
 */
const triggerCallback = (standardEventsMap, eventName, updateEventNames, analytics) => {
  const updatedEvent =
    standardEventsMap[eventName] && updateEventNames ? standardEventsMap[eventName] : eventName;
  window._kiq.push([
    'eventHandler',
    eventName,
    function () {
      analytics.track(
        `${updatedEvent}`,
        {},
        {
          context: { integration: integrationContext },
        },
      );
    },
  ]);
};

/**
 * This function has event listeners for the occurring events and to make a call for the event after collecting the data.
 * @param {*} updateEventNames boolean variable to change eventName
 * @param {*} userDefinedEventsList list of requested events by the user
 * @param {*} userDefinedEventsMapping mapping of events in the webapp by the user
 * @param {*} analytics rudderanalytics object
 */
const recordQualarooEvents = (
  updateEventNames,
  userDefinedEventsList,
  userDefinedEventsMapping,
  analytics,
) => {
  let standardEventsMap = getHashFromArray(userDefinedEventsMapping);
  standardEventsMap = swapKeyValuePairs(standardEventsMap);
  standardEventsList.forEach((event) => {
    if (userDefinedEventsList.includes(event)) {
      triggerCallback(standardEventsMap, event, updateEventNames, analytics);
    }
  });
};

/**
 * This function is used to replace all dashes(-) from user traits with underscore(_).
 * ref :- https://help.qualaroo.com/hc/en-us/articles/201541187-Setting-Additional-User-Properties#:~:text=Notes
 * @param {*} traits {"name":"John Doe","phone-number":"+9199999999"}
 * @returns {"name":"John Doe","phone_number":"+9199999999"}
 */
const transformUserTraits = (traits) => {
  const transformedTraits = {};
  Object.keys(traits).forEach((traitName) => {
    const transformedTrait = traitName.replace(/-/g, '_');
    transformedTraits[transformedTrait] = traits[traitName];
  });
  return transformedTraits;
};

export { recordQualarooEvents, transformUserTraits };
