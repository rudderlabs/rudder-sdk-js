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

function recordingLiveChatEvents(updateEventNames, standardEventsMap) {
  const eventNames = flip(standardEventsMap);

  window.SnapEngage.setCallback('StartChat', function () {
    let eventName = 'Live Chat Conversation Started';
    if (updateEventNames && eventNames?.startChat) {
      eventName = eventNames.startChat;
    }
    window.rudderanalytics.track(
      `${eventName}`,
      {},
      { context: { integration: integrationContext } },
    );
  });

  window.SnapEngage.setCallback('ChatMessageReceived', function (agent) {
    let eventName = 'Live Chat Message Received';
    if (updateEventNames && eventNames?.chatMessageReceived) {
      eventName = eventNames.chatMessageReceived;
    }
    window.rudderanalytics.track(
      `${eventName}`,
      { agentUsername: agent },
      { context: { integration: integrationContext } },
    );
  });

  window.SnapEngage.setCallback('ChatMessageSent', function () {
    let eventName = 'Live Chat Message Sent';
    if (updateEventNames && eventNames?.chatMessageSent) {
      eventName = eventNames.chatMessageSent;
    }
    window.rudderanalytics.track(
      `${eventName}`,
      {},
      { context: { integration: integrationContext } },
    );
  });

  window.SnapEngage.setCallback('Close', function () {
    let eventName = 'Live Chat Conversation Ended';
    if (updateEventNames && eventNames?.close) {
      eventName = eventNames.close;
    }
    window.rudderanalytics.track(
      `${eventName}`,
      {},
      { context: { integration: integrationContext } },
    );
  });

  window.SnapEngage.setCallback('InlineButtonClicked', function () {
    let eventName = 'Inline Button Clicked';
    if (updateEventNames && eventNames?.inlineButtonClicked) {
      eventName = eventNames.inlineButtonClicked;
    }
    window.rudderanalytics.track(
      `${eventName}`,
      {},
      { context: { integration: integrationContext } },
    );
  });
}

export { integrationContext, recordingLiveChatEvents };
