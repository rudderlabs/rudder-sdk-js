import { getHashFromArray } from "../utils/commonUtils";

const integrationContext = {
  name: "LiveChat",
  version: "1.0.0",
};

// default mapping for the events
const standardEventsListMapping = {
  onReady: "ready",
  onAvailabilityChanged: "availability_changed",
  onVisibilityChanged: "visibility_changed",
  onCustomerStatusChanged: "customer_status_changed",
  onNewEvent: "new_event",
  onFormSubmitted: "form_submitted",
  onRatingSubmitted: "rating_submitted",
  onGreetingDisplayed: "greeting_displayed",
  onGreetingHidden: "greeting_hidden",
  onRichMessageButtonClicked: "rich_message_button_clicked",
};

const makeACall = (standardEventsMap, eventName) => {
  // Updating the event name with any mapping from the webapp if available else
  // storing default event name in the updatedEvent
  const updatedEvent = standardEventsMap[eventName]
    ? standardEventsMap[eventName]
    : standardEventsListMapping[eventName];

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
  const standardEventsList = [
    "onReady",
    "onAvailabilityChanged",
    "onVisibilityChanged",
    "onCustomerStatusChanged",
    "onNewEvent",
    "onFormSubmitted",
    "onRatingSubmitted",
    "onGreetingDisplayed",
    "onGreetingHidden",
    "onRichMessageButtonClicked",
  ];
  standardEventsList.forEach((events) => {
    if (userDefinedEventsList.includes(events)) {
      window.LiveChatWidget.on(standardEventsListMapping[events], events);
      makeACall(standardEventsMap, events);
    }
  });
}

export { integrationContext, recordingLiveChatEvents };
