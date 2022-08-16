import each from "@ndhoule/each";

const integrationContext = {
  name: "snapengage",
  version: "1.0.0",
};

const recordingLiveChatEvents = (updateEventNames, standardEventsMap) => {
  each((val, key) => {
    val.forEach((standardEvent) => {
      window.SnapEngage.setCallback("StartChat", function () {
        let eventName = "Live Chat Conversation Started";
        if (updateEventNames && standardEvent === "startChat") {
          eventName = key;
        }
        rudderanalytics.track(
          `${eventName}`,
          {},
          { context: { integration: integrationContext } }
        );
      });

      window.SnapEngage.setCallback("ChatMessageReceived", function (agent) {
        let eventName = "Live Chat Message Received";
        if (updateEventNames && standardEvent === "chatMessageReceived") {
          eventName = key;
        }
        rudderanalytics.track(
          `${eventName}`,
          { agentUsername: agent },
          { context: { integration: integrationContext } }
        );
      });

      window.SnapEngage.setCallback("ChatMessageSent", function () {
        let eventName = "Live Chat Message Sent";
        if (updateEventNames && standardEvent === "chatMessageSent") {
          eventName = key;
        }
        rudderanalytics.track(
          `${eventName}`,
          {},
          { context: { integration: integrationContext } }
        );
      });

      window.SnapEngage.setCallback("Close", function () {
        let eventName = "Live Chat Conversation Ended";
        if (updateEventNames && standardEvent === "close") {
          eventName = key;
        }
        rudderanalytics.track(
          `${eventName}`,
          {},
          { context: { integration: integrationContext } }
        );
      });

      window.SnapEngage.setCallback("InlineButtonClicked", function () {
        let eventName = "Inline Button Clicked";
        if (updateEventNames && standardEvent === "inlineButtonClicked") {
          eventName = key;
        }
        rudderanalytics.track(
          `${eventName}`,
          {},
          { context: { integration: integrationContext } }
        );
      });
    });
  }, standardEventsMap);
};

export { recordingLiveChatEvents };
