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
    events.forEach(event => {
      if (event.eventName !== '') {
        eventNames.push(event.eventName);
      }
    });
    return eventNames.includes(eventName.trim());
  }

  return false;
}

/**
 * Returns weather to send conversion event or not
 * @param {*} eventName - event name
 * @param {*} trackConversions - decides weather to send conversion event or not
 * @param {*} enableConversionEventsFiltering - decides weather to apply filtering on event or not
 * @param {*} eventsToTrackConversions - allowed list of events to send google ads
 * @param {*} dynamicRemarketing - Depreciating : old config flag to check weather to send event as conversion or dynamic remarketing
 * @returns
 */
function shouldSendConversionEvent(
  eventName,
  trackConversions,
  enableConversionEventsFiltering,
  eventsToTrackConversions,
  dynamicRemarketing,
) {
  if (isDefinedAndNotNull(trackConversions)) {
    return shouldSendEvent(
      eventName,
      trackConversions,
      enableConversionEventsFiltering,
      eventsToTrackConversions,
    );
  }
  return !dynamicRemarketing;
}

/**
 * Returns weather to send dynamic remarketing event or not
 * @param {*} eventName
 * @param {*} trackDynamicRemarketing - decides weather to send dynamic remarketing event or not
 * @param {*} enableDynamicRemarketingEventsFiltering - decides weather to apply filtering on event or not
 * @param {*} eventsToTrackDynamicRemarketing - allowed list of events to send google ads
 * @param {*} dynamicRemarketing - Depreciating : old config flag to check weather to send event as conversion or dynamic remarketing
 * @returns
 */
function shouldSendDynamicRemarketingEvent(
  eventName,
  trackDynamicRemarketing,
  enableDynamicRemarketingEventsFiltering,
  eventsToTrackDynamicRemarketing,
  dynamicRemarketing,
) {
  if (isDefinedAndNotNull(trackDynamicRemarketing)) {
    return shouldSendEvent(
      eventName,
      trackDynamicRemarketing,
      enableDynamicRemarketingEventsFiltering,
      eventsToTrackDynamicRemarketing,
    );
  }
  return dynamicRemarketing;
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
      eventTypeConversions.forEach(eventTypeConversion => {
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

function newCustomerAcquisitionReporting(properties) {
  const updatedProperties = { ...properties }; // create a copy of properties object
  if (updatedProperties && updatedProperties.newCustomer) {
    updatedProperties.new_customer = updatedProperties.newCustomer;
    delete updatedProperties.newCustomer;
  }
  return updatedProperties;
}

export {
  shouldSendConversionEvent,
  shouldSendDynamicRemarketingEvent,
  getConversionData,
  newCustomerAcquisitionReporting,
};
