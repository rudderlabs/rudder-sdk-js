const integrationContext = {
  name: 'olark',
  version: '1.0.0',
};

function recordingLiveChatEvents(updateEventNames, standardEventsMap) {
  const eventNames = standardEventsMap;
  window.olark('api.chat.onBeginConversation', () => {
    let eventName = 'Live Chat Conversation Started';
    if (updateEventNames && eventNames?.startChat) {
      eventName = eventNames.startChat;
    }
    window.rudderanalytics.track(
      `${eventName}`,
      {},
      {
        context: { integration: integrationContext },
      },
    );
  });

  window.olark('api.chat.onMessageToOperator', () => {
    let eventName = 'Live Chat Message Sent';
    if (updateEventNames && eventNames?.chatMessageSent) {
      eventName = eventNames.chatMessageSent;
    }
    window.rudderanalytics.track(
      `${eventName}`,
      {},
      {
        context: { integration: integrationContext },
      },
    );
  });

  window.olark('api.chat.onMessageToVisitor', () => {
    let eventName = 'Live Chat Message Received';
    if (updateEventNames && eventNames?.chatMessageReceived) {
      eventName = eventNames.chatMessageReceived;
    }
    window.rudderanalytics.track(
      `${eventName}`,
      {},
      {
        context: { integration: integrationContext },
      },
    );
  });
}

export { integrationContext, recordingLiveChatEvents };
