function getEventId(message) {
  if (message.traits) return message.traits.event_id;
  if (message.context && message.context.traits)
    return message.context.traits.event_id;
  if (message.properties) return message.properties.event_id;
  return message.messageId;
}
export default getEventId;
