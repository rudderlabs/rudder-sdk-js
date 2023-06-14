import { isEventDenyListed } from '@rudderstack/analytics-js-plugins/nativeDestinationQueue/utilities';
import { clone } from 'ramda';

describe('nativeDestinationQueue Plugin - utilities', () => {
  describe('isEventDenyListed', () => {
    const mockDestination = {
      id: 'sample-destination-id',
      displayName: 'Destination Display Name',
      userFriendlyId: 'ID_sample-destination-id',
      areTransformationsConnected: false,
      config: {
        blacklistedEvents: [{ eventName: 'sample track event 2' }],
        whitelistedEvents: [{ eventName: 'sample track event 1' }],
        oneTrustCookieCategories: [{ oneTrustCookieCategory: '' }],
        eventFilteringOption: 'whitelistedEvents',
      },
      instance: {
        name: 'DEST_NAME', // this is same as the definition name
        destinationId: 'sample-destination-id',
        areTransformationsConnected: false,
        analytics: {},
        isLoaded: () => true,
      },
    };

    it('should return false if the event type is not track', () => {
      const outcome1 = isEventDenyListed('identify', undefined, mockDestination);
      const outcome2 = isEventDenyListed('page', undefined, mockDestination);
      const outcome3 = isEventDenyListed('group', undefined, mockDestination);
      const outcome4 = isEventDenyListed('alias', undefined, mockDestination);

      expect(outcome1).toBeFalsy();
      expect(outcome2).toBeFalsy();
      expect(outcome3).toBeFalsy();
      expect(outcome4).toBeFalsy();
    });

    it('should return false if deny list is selected and track event does not have event name property', () => {
      const mockDest = clone(mockDestination);
      mockDest.config.eventFilteringOption = 'blacklistedEvents';

      const outcome1 = isEventDenyListed('track', undefined, mockDest);
      expect(outcome1).toBeFalsy();
    });
    it('should return false if deny list is selected and track event name is not string', () => {
      const mockDest = clone(mockDestination);
      mockDest.config.eventFilteringOption = 'blacklistedEvents';

      const outcome1 = isEventDenyListed('track', true, mockDest);
      const outcome2 = isEventDenyListed('track', 12345, mockDest);
      expect(outcome1).toBeFalsy();
      expect(outcome2).toBeFalsy();
    });
    it('should return true if deny list is selected and track event name matches with denylist event name', () => {
      const mockDest = clone(mockDestination);
      mockDest.config.eventFilteringOption = 'blacklistedEvents';

      const outcome1 = isEventDenyListed('track', 'sample track event 2', mockDest);
      expect(outcome1).toBeTruthy();
    });
    it('should return false if deny list is selected and track event name does not matches with denylist event name', () => {
      const mockDest = clone(mockDestination);
      mockDest.config.eventFilteringOption = 'blacklistedEvents';

      const outcome1 = isEventDenyListed('track', 'sample track event 1234', mockDest);
      expect(outcome1).toBeFalsy();
    });
    it('should return true if allow list is selected and track event does not have event name property', () => {
      const outcome1 = isEventDenyListed('track', undefined, mockDestination);
      expect(outcome1).toBeTruthy();
    });
    it('should return true if allow list is selected and track event name is not string', () => {
      const outcome1 = isEventDenyListed('track', true, mockDestination);
      const outcome2 = isEventDenyListed('track', 12345, mockDestination);
      expect(outcome1).toBeTruthy();
      expect(outcome2).toBeTruthy();
    });
    it('should return false if allow list is selected and track event name matches with allowlist event name', () => {
      const outcome1 = isEventDenyListed('track', 'sample track event 1', mockDestination);
      expect(outcome1).toBeFalsy();
    });
    it('should return true if allow list is selected and track event name does not matches with allowlist event name', () => {
      const outcome1 = isEventDenyListed('track', 'sample track event 1234', mockDestination);
      expect(outcome1).toBeTruthy();
    });
  });
});
