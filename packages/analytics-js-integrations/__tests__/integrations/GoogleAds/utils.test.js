import {
  getConversionData,
  shouldSendConversionEvent,
  shouldSendDynamicRemarketingEvent,
  newCustomerAcquisitionReporting,
} from '../../../src/integrations/GoogleAds/utils';
import {
  mockEvents,
  productAdded,
  orderCompleted,
  mockEventTypeConversions,
} from './__fixtures__/data';

describe('GoogleAds utilities shouldSendEvent function tests', () => {
  // New Config
  test('event tracking is enabled and event filtering is disabled', () => {
    const eventToSend = shouldSendConversionEvent(productAdded, true, false, mockEvents);
    expect(eventToSend).toEqual(true);
  });

  test('event tracking is disabled and event filtering is disabled', () => {
    const eventToSend = shouldSendDynamicRemarketingEvent(
      'Product Viewed',
      false,
      false,
      mockEvents
    );
    expect(eventToSend).toEqual(false);
  });

  test('event tracking is enabled and event filtering is enabled but event is not added to events list', () => {
    const eventToSend = shouldSendConversionEvent(
      'Product Added',
      true,
      true,
      mockEvents
    );
    expect(eventToSend).toEqual(false);
  });

  test('event tracking is enabled and event filtering is enabled and event is added to events list', () => {
    const eventToSend = shouldSendDynamicRemarketingEvent(
      orderCompleted,
      true,
      true,
      mockEvents
    );
    expect(eventToSend).toEqual(true);
  });
});

describe('GoogleAds utilities getConversionData function tests', () => {
  test('Event name is present in mapping', () => {
    const conversionData = getConversionData(mockEventTypeConversions, 'Sign Up', '');
    expect(conversionData.eventName).toEqual('Sign Up');
    expect(conversionData.conversionLabel).toEqual('15klCKLCs4gYETIBi58p');
  });

  test('No event name is present', () => {
    const conversionData = getConversionData(mockEventTypeConversions, '', 'KhF2CKvCs4gYETIBi58p');
    expect(conversionData.eventName).toEqual('Viewed a Page');
    expect(conversionData.conversionLabel).toEqual('KhF2CKvCs4gYETIBi58p');
  });

  test('No matching event name is present and no defaultPageConversion is present', () => {
    const conversionData = getConversionData(mockEventTypeConversions, 'Cart Checkout', '');
    expect(conversionData).toEqual({});
  });
});

describe('GoogleAds utilities newCustomerAcquisitionReporting function tests', () => {
  test('newCustomerAcquisitionReporting function should set new_customer property when properties.newCustomer is present', () => {
    const mockProperties = {
      newCustomer: true,
    };
    const properties = newCustomerAcquisitionReporting(mockProperties);
    expect(properties.new_customer).toEqual(true);
  });
});
