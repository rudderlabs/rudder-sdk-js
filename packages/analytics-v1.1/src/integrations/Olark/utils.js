const integrationContext = {
  name: 'olark',
  version: '1.0.0',
};

function recordingLiveChatEvents(updateEventNames, standardEventsMap, analytics) {
  const eventNames = standardEventsMap;
  window.olark('api.chat.onBeginConversation', () => {
    let eventName = 'Live Chat Conversation Started';
    if (updateEventNames && eventNames?.startChat) {
      eventName = eventNames.startChat;
    }
    analytics.track(
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
    analytics.track(
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
    analytics.track(
      `${eventName}`,
      {},
      {
        context: { integration: integrationContext },
      },
    );
  });
}

export { integrationContext, recordingLiveChatEvents };
