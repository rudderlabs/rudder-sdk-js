import { shouldSendEvent, getConversionData } from '../../../src/integrations/GoogleAds/utils';
import {
  mockEvents,
  productAdded,
  orderCompleted,
  mockEventTypeConversions,
} from './__mocks__/data';

describe('GoogleAds utilities shouldSendEvent function tests', () => {
  // Old Config
  test('dynamicRemarketing flag disabled', () => {
    const eventToSend = shouldSendEvent(
      undefined,
      undefined,
      undefined,
      undefined,
      false,
      'conversion',
    );
    expect(eventToSend).toEqual(true);
  });

  test('dynamicRemarketing flag enabled', () => {
    const eventToSend = shouldSendEvent(
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      'dynamicRemarketing',
    );
    expect(eventToSend).toEqual(true);
  });

  // New Config
  test('event tracking is enabled and event filtering is disabled', () => {
    const eventToSend = shouldSendEvent(
      productAdded,
      true,
      false,
      mockEvents,
      undefined,
      'conversion',
    );
    expect(eventToSend).toEqual(true);
  });

  test('event tracking is disabled and event filtering is disabled', () => {
    const eventToSend = shouldSendEvent(
      'Product Viewed',
      false,
      false,
      mockEvents,
      undefined,
      'conversion',
    );
    expect(eventToSend).toEqual(false);
  });

  test('event tracking is enabled and event filtering is enabled but event is not added to events list', () => {
    const eventToSend = shouldSendEvent(
      'Cart Checkout',
      true,
      true,
      mockEvents,
      undefined,
      'dynamicRemarketing',
    );
    expect(eventToSend).toEqual(false);
  });

  test('event tracking is enabled and event filtering is enabled and event is added to events list', () => {
    const eventToSend = shouldSendEvent(
      orderCompleted,
      true,
      true,
      mockEvents,
      undefined,
      'dynamicRemarketing',
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
