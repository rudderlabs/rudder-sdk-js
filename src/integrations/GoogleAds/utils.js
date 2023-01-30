import { isDefinedAndNotNull } from '../../utils/utils';

/**
 * if trackEvents are not enabled then do not send events (return false)
 * if trackEvents are enabled but event filtering is not enabled then send all events
 * if trackEvents are enabled and event filtering is also enabled then check if event is configured to event list or not
 * if non of above is true then do not send event at all (return false)
 * @param {*} eventName
 * @param {*} trackEvents
 * @param {*} enableFiltering
 * @param {*} events
 * @returns
 */
function shouldSendEvent(eventName, trackEvents, enableFiltering, events) {
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

/**
 * returns weather to send conversion event or not
 * @param {*} eventName
 * @param {*} trackConversions
 * @param {*} enableConversionEventsFiltering
 * @param {*} eventsToTrackConversions
 * @param {*} dynamicRemarketing
 * @returns
 */
function shouldSendConversionEvent(
  eventName,
  trackConversions,
  enableConversionEventsFiltering,
  eventsToTrackConversions,
  dynamicRemarketing,
) {
  if (isDefinedAndNotNull(dynamicRemarketing)) {
    return !dynamicRemarketing;
  }
  return shouldSendEvent(
    eventName,
    trackConversions,
    enableConversionEventsFiltering,
    eventsToTrackConversions,
  );
}

/**
 * returns weather to send dynamic remarketing event or not
 * @param {*} eventName
 * @param {*} trackDynamicRemarketing
 * @param {*} enableDynamicRemarketingEventsFiltering
 * @param {*} eventsToTrackDynamicRemarketing
 * @param {*} dynamicRemarketing
 * @returns
 */
function shouldSendDynamicRemarketingEvent(
  eventName,
  trackDynamicRemarketing,
  enableDynamicRemarketingEventsFiltering,
  eventsToTrackDynamicRemarketing,
  dynamicRemarketing,
) {
  if (isDefinedAndNotNull(dynamicRemarketing)) {
    return dynamicRemarketing;
  }
  return shouldSendEvent(
    eventName,
    trackDynamicRemarketing,
    enableDynamicRemarketingEventsFiltering,
    eventsToTrackDynamicRemarketing,
  );
}

/**
 * returns conversionData object (conversionLabel and eventName)
 * if eventName is not present but defaultPageConversion is configured then keeping default eventName as Viewed a Page
 * @param {*} eventTypeConversions
 * @param {*} eventName
 * @param {*} defaultPageConversion
 * @returns
 */
function getConversionData(eventTypeConversions, eventName, defaultPageConversion) {
  const conversionData = {};
  if (eventTypeConversions) {
    if (eventName) {
      eventTypeConversions.forEach((eventTypeConversion) => {
        if (eventTypeConversion.name.toLowerCase() === eventName.toLowerCase()) {
          // rudderElement["message"]["name"]
          conversionData.conversionLabel = eventTypeConversion.conversionLabel;
          conversionData.eventName = eventTypeConversion.name;
        }
      });
    } else if (defaultPageConversion) {
      conversionData.conversionLabel = defaultPageConversion;
      conversionData.eventName = 'Viewed a Page';
    }
  }
  return conversionData;
}

export { shouldSendConversionEvent, shouldSendDynamicRemarketingEvent, getConversionData };
