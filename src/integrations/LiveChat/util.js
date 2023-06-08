import { getHashFromArray } from '../../utils/commonUtils';

const integrationContext = {
  name: 'LiveChat',
  version: '1.0.0',
};

/**
 * This function is used to trigger a callback.
 * @param {*} standardEventsMap mapping of events done by the user
 * @param {*} eventName standard event name
 * @param {*} updateEventNames boolean variable to change eventName.
 * @param {*} analytics rudderanalytics object
 */
const makeACall = (standardEventsMap, eventName, updateEventNames, analytics) => {
  // Updating the event name with any mapping from the webapp if available else
  // storing default event name in the updatedEvent
  const updatedEvent =
    standardEventsMap[eventName] && updateEventNames ? standardEventsMap[eventName] : eventName;

  analytics.track(`${updatedEvent}`, {}, { context: { integration: integrationContext } });
};

const swapKeyValuePairs = (standardEventsMap) => {
  const swappedEventsMap = {};
  Object.keys(standardEventsMap).forEach((key) => {
    swappedEventsMap[standardEventsMap[key]] = key;
  });
  return swappedEventsMap;
};

/**
 * This function has event listeners for the occurring events and to make a call for the event after
 * collecting the data.
 * @param {*} updateEventNames variable to Update event name .
 * @param {*} userDefinedEventsList List of requested events by the user.
 * @param {*} userDefinedEventsMapping Mapping of events in the webapp by the user
 * @param {*} analytics rudderanalytics object
 */
function recordingLiveChatEvents(
  updateEventNames,
  userDefinedEventsList,
  userDefinedEventsMapping,
  analytics,
) {
  let standardEventsMap = getHashFromArray(userDefinedEventsMapping);
  standardEventsMap = swapKeyValuePairs(standardEventsMap);
  (function (api) {
    [
      'ready',
      'new_event',
      'form_submitted',
      'greeting_hidden',
      'rating_submitted',
      'visibility_changed',
      'greeting_displayed',
      'availability_changed',
      'customer_status_changed',
      'rich_message_button_clicked',
    ].forEach(function (eventName) {
      if (userDefinedEventsList.includes(eventName)) {
        api.on(eventName, function (payload) {
          makeACall(standardEventsMap, eventName, updateEventNames, analytics);
        });
      }
    });
  })(window.LiveChatWidget);
}

export { integrationContext, recordingLiveChatEvents };
