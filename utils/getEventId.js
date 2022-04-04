function getEventId(message){
    return traits.event_id || context.traits.event_id || properties.event_id || messageId;
};
export default getEventId;