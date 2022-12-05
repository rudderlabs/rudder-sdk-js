const integrationContext = {
  name: 'olark',
  version: '1.0.0',
};

function recordingLiveChatEvents(updateEventNames, standardEventsMap) {
  const eventNames = standardEventsMap;
  window.olark('api.chat.onBeginConversation', function () {
    let eventName = 'Live Chat Conversation Started';
    if (updateEventNames && eventNames?.startChat) {
      eventName = eventNames.startChat;
    }
    window.rudderanalytics.track(
      'Live Chat Conversation Started',
      { eventName },
      {},
      {
        context: { integration: integrationContext },
        integrations: { Olark: false },
      },
    );
  });

  window.olark('api.chat.onMessageToOperator', function () {
    let eventName = 'Live Chat Message Sent';
    if (updateEventNames && eventNames?.chatMessageSent) {
      eventName = eventNames.chatMessageSent;
    }
    window.rudderanalytics.track(
      'Live Chat Message Sent',
      { eventName },
      {},
      {
        context: { integration: integrationContext },
        integrations: { Olark: false },
      },
    );
  });

  window.olark('api.chat.onMessageToVisitor', function () {
    let eventName = 'Live Chat Message Received';
    if (updateEventNames && eventNames?.chatMessageReceived) {
      eventName = eventNames.chatMessageReceived;
    }
    window.rudderanalytics.track(
      'Live Chat Message Received',
      { eventName },
      {},
      {
        context: { integration: integrationContext },
        integrations: { Olark: false },
      },
    );
  });
}

export { integrationContext, recordingLiveChatEvents };
