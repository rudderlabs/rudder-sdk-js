import { getHashFromArray } from "../utils/commonUtils";

const integrationContext = {
  name: "LiveChat",
  version: "1.0.0",
};

const makeACall = (standardEventsMap, eventName, updateEventNames) => {
  // Updating the event name with any mapping from the webapp if available else
  // storing default event name in the updatedEvent
  const updatedEvent =
    standardEventsMap[eventName] && updateEventNames
      ? standardEventsMap[eventName]
      : eventName;

  window.rudderanalytics.track(
    `${updatedEvent}`,
    {},
    { context: { integration: integrationContext } }
  );
};

const swapKeyValuePairs = (standardEventsMap) => {
  const swappedEventsMap = {};
  Object.keys(standardEventsMap).forEach((key) => {
    swappedEventsMap[standardEventsMap[key]] = key;
  });
  return swappedEventsMap;
};

function recordingLiveChatEvents(
  updateEventNames,
  userDefinedEventsList,
  userDefinedEventsMapping
) {
  let standardEventsMap = getHashFromArray(userDefinedEventsMapping);
  standardEventsMap = swapKeyValuePairs(standardEventsMap);
  (function (api) {
    [
      "ready",
      "new_event",
      "form_submitted",
      "greeting_hidden",
      "rating_submitted",
      "visibility_changed",
      "greeting_displayed",
      "availability_changed",
      "customer_status_changed",
      "rich_message_button_clicked",
    ].forEach(function (eventName) {
      if (userDefinedEventsList.includes(eventName)) {
        api.on(eventName, function (payload) {
          makeACall(standardEventsMap, eventName, updateEventNames);
        });
      }
    });
  })(window.LiveChatWidget);
}

export { integrationContext, recordingLiveChatEvents };
