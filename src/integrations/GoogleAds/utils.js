function shouldSendEvent(eventName, trackEvents, enableFiltering, events) {
  /**
   * if trackEvents are not enabled then do not send events (return false)
   * if trackEvents are enabled but event filtering is not enabled then send all events
   * if trackEvents are enabled and event filtering is also enabled then check if event is configured to event list or not
   * if non of above is true then do not send event at all (return false)
   */

  if (!trackEvents) {
    return false;
  }

  if (trackEvents && !enableFiltering) {
    return true;
  }

  if (trackEvents && enableFiltering) {
    const eventNames = [];
    events.forEach((event) => {
      if (event.eventName !== '') {
        eventNames.push(event.eventName);
      }
    });
    return eventNames.includes(eventName.trim());
  }

  return false;
}

export default shouldSendEvent;
