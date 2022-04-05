function getEventId(message){
    return message.traits.event_id || message.context.traits.event_id || message.properties.event_id || message.messageId;
};
export default getEventId;