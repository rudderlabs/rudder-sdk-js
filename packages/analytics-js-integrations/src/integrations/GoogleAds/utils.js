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
  if (!eventName || eventName.trim() === '') {
    return false;
  }

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
    if (eventName && typeof eventName === 'string') {
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
  if (updatedProperties?.newCustomer) {
    updatedProperties.new_customer = updatedProperties.newCustomer;
    delete updatedProperties.newCustomer;
  }
  return updatedProperties;
}

// https://support.google.com/google-ads/answer/13258081#zippy=%2Cvalidate-your-implementation-using-chrome-developer-tools%2Cfind-enhanced-conversions-fields-on-your-conversion-page%2Cidentify-and-define-your-enhanced-conversions-fields
/**
 * Generates required payload from traits for identify call
 * @param {*} traits
 * @returns payload
 */
function generateUserDataPayload(traits) {
  const payload = {};
  if (traits) {
    payload.address = {};
    if (isDefinedAndNotNull(traits.email)) {
      payload.email = traits.email;
    }
    if (isDefinedAndNotNull(traits.phone)) {
      payload.phone_number = traits.phone;
    }
    if (isDefinedAndNotNull(traits.firstName)) {
      payload.address.first_name = traits.firstName;
    }
    if (isDefinedAndNotNull(traits.lastName)) {
      payload.address.last_name = traits.lastName;
    }
    if (isDefinedAndNotNull(traits.city)) {
      payload.address.city = traits.city;
    }
    if (isDefinedAndNotNull(traits.street)) {
      payload.address.street = traits.street;
    }
    if (isDefinedAndNotNull(traits.state)) {
      payload.address.region = traits.state;
    }
    if (isDefinedAndNotNull(traits.postalCode)) {
      payload.address.postal_code = traits.postalCode;
    }
    if (isDefinedAndNotNull(traits.country)) {
      payload.address.country = traits.country;
    }
    if (!traits.city && !traits.state && !traits.postalCode && !traits.country && !traits.street) {
      // if none of the address fields are present then remove address object from payload
      delete payload.address;
    }
  }
  return payload;
}

export {
  shouldSendConversionEvent,
  shouldSendDynamicRemarketingEvent,
  getConversionData,
  newCustomerAcquisitionReporting,
  generateUserDataPayload,
};
