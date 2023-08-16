const integrationContext = {
  name: 'snapengage',
  version: '1.0.0',
};

/**
 * Exchanges key with value
 * @param {*} data
 * @returns
 */
function flip(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => [value, key]));
}

function recordingLiveChatEvents(updateEventNames, standardEventsMap, analytics) {
  const eventNames = flip(standardEventsMap);

  window.SnapEngage.setCallback('StartChat', () => {
    let eventName = 'Live Chat Conversation Started';
    if (updateEventNames && eventNames?.startChat) {
      eventName = eventNames.startChat;
    }
    analytics.track(`${eventName}`, {}, { context: { integration: integrationContext } });
  });

  window.SnapEngage.setCallback('ChatMessageReceived', (agent) => {
    let eventName = 'Live Chat Message Received';
    if (updateEventNames && eventNames?.chatMessageReceived) {
      eventName = eventNames.chatMessageReceived;
    }
    analytics.track(
      `${eventName}`,
      { agentUsername: agent },
      { context: { integration: integrationContext } },
    );
  });

  window.SnapEngage.setCallback('ChatMessageSent', () => {
    let eventName = 'Live Chat Message Sent';
    if (updateEventNames && eventNames?.chatMessageSent) {
      eventName = eventNames.chatMessageSent;
    }
    analytics.track(`${eventName}`, {}, { context: { integration: integrationContext } });
  });

  window.SnapEngage.setCallback('Close', () => {
    let eventName = 'Live Chat Conversation Ended';
    if (updateEventNames && eventNames?.close) {
      eventName = eventNames.close;
    }
    analytics.track(`${eventName}`, {}, { context: { integration: integrationContext } });
  });

  window.SnapEngage.setCallback('InlineButtonClicked', () => {
    let eventName = 'Inline Button Clicked';
    if (updateEventNames && eventNames?.inlineButtonClicked) {
      eventName = eventNames.inlineButtonClicked;
    }
    analytics.track(`${eventName}`, {}, { context: { integration: integrationContext } });
  });
}

export { integrationContext, recordingLiveChatEvents };
