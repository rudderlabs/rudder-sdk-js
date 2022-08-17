import each from "@ndhoule/each";

const integrationContext = {
  name: "snapengage",
  version: "1.0.0",
};

function recordingLiveChatEventsWithMapping(
  updateEventNames,
  standardEventsMap
) {
  each((val, key) => {
    window.SnapEngage.setCallback("StartChat", function () {
      let eventName = "Live Chat Conversation Started";
      if (updateEventNames && val === "startChat") {
        eventName = key;
      }
      window.rudderanalytics.track(
        `${eventName}`,
        {},
        { context: { integration: integrationContext } }
      );
    });

    window.SnapEngage.setCallback("ChatMessageReceived", function (agent) {
      let eventName = "Live Chat Message Received";
      if (updateEventNames && val === "chatMessageReceived") {
        eventName = key;
      }
      window.rudderanalytics.track(
        `${eventName}`,
        { agentUsername: agent },
        { context: { integration: integrationContext } }
      );
    });

    window.SnapEngage.setCallback("ChatMessageSent", function () {
      let eventName = "Live Chat Message Sent";
      if (updateEventNames && val === "chatMessageSent") {
        eventName = key;
      }
      window.rudderanalytics.track(
        `${eventName}`,
        {},
        { context: { integration: integrationContext } }
      );
    });

    window.SnapEngage.setCallback("Close", function () {
      let eventName = "Live Chat Conversation Ended";
      if (updateEventNames && val === "close") {
        eventName = key;
      }
      window.rudderanalytics.track(
        `${eventName}`,
        {},
        { context: { integration: integrationContext } }
      );
    });

    window.SnapEngage.setCallback("InlineButtonClicked", function () {
      let eventName = "Inline Button Clicked";
      if (updateEventNames && val === "inlineButtonClicked") {
        eventName = key;
      }
      window.rudderanalytics.track(
        `${eventName}`,
        {},
        { context: { integration: integrationContext } }
      );
    });
  }, standardEventsMap);
}

function recordingLiveChatEvents() {
  window.SnapEngage.setCallback("StartChat", function () {
    window.rudderanalytics.track(
      "Live Chat Conversation Started",
      {},
      { context: { integration: integrationContext } }
    );
  });

  window.SnapEngage.setCallback("ChatMessageReceived", function (agent) {
    window.rudderanalytics.track(
      "Live Chat Message Received",
      { agentUsername: agent },
      { context: { integration: integrationContext } }
    );
  });

  window.SnapEngage.setCallback("ChatMessageSent", function () {
    window.rudderanalytics.track(
      "Live Chat Message Sent",
      {},
      { context: { integration: integrationContext } }
    );
  });

  window.SnapEngage.setCallback("Close", function () {
    window.rudderanalytics.track(
      "Live Chat Conversation Ended",
      {},
      { context: { integration: integrationContext } }
    );
  });

  window.SnapEngage.setCallback("InlineButtonClicked", function () {
    window.rudderanalytics.track(
      "Inline Button Clicked",
      {},
      { context: { integration: integrationContext } }
    );
  });
}

export {
  integrationContext,
  recordingLiveChatEventsWithMapping,
  recordingLiveChatEvents,
};
