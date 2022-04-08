function getEventId(message) {
  if (message.traits && message.traits.event_id) return message.traits.event_id;

  if (
    message.context &&
    message.context.traits &&
    message.context.traits.event_id
  )
    return message.context.traits.event_id;

  if (message.properties && message.properties.event_id)
    return message.properties.event_id;

  return message.messageId;
}
export default getEventId;
