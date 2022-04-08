import get from "get-value";

function getEventId(message) {
  return (
    get(message, "traits.event_id") ||
    get(message, "context.traits.event_id") ||
    get(message, "properties.event_id") ||
    message.messageId
  );
}
export default getEventId;
