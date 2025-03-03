import { clone } from 'ramda';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import { isEventDenyListed } from '../../src/nativeDestinationQueue/utilities';

describe('nativeDestinationQueue Plugin - utilities', () => {
  describe('isEventDenyListed', () => {
    const destination = {
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
    } as unknown as Destination;

    it('should return false if the event type is not track', () => {
      const outcome1 = isEventDenyListed('identify', null, destination);
      const outcome2 = isEventDenyListed('page', null, destination);
      const outcome3 = isEventDenyListed('group', null, destination);
      const outcome4 = isEventDenyListed('alias', null, destination);

      expect(outcome1).toBeFalsy();
      expect(outcome2).toBeFalsy();
      expect(outcome3).toBeFalsy();
      expect(outcome4).toBeFalsy();
    });

    it('should return false if deny list is selected and track event does not have event name property', () => {
      const mockDest = clone(destination);
      mockDest.config.eventFilteringOption = 'blacklistedEvents';

      const outcome1 = isEventDenyListed('track', null, mockDest);
      expect(outcome1).toBeFalsy();
    });
    it('should return false if deny list is selected and track event name is not string', () => {
      const mockDest = clone(destination);
      mockDest.config.eventFilteringOption = 'blacklistedEvents';

      // @ts-expect-error eventName is not a string
      const outcome1 = isEventDenyListed('track', true, mockDest);
      // @ts-expect-error eventName is not a string
      const outcome2 = isEventDenyListed('track', 12345, mockDest);
      expect(outcome1).toBeFalsy();
      expect(outcome2).toBeFalsy();
    });
    it('should return true if deny list is selected and track event name matches with denylist event name', () => {
      const mockDest = clone(destination);
      mockDest.config.eventFilteringOption = 'blacklistedEvents';

      const outcome1 = isEventDenyListed('track', 'sample track event 2', mockDest);
      expect(outcome1).toBeTruthy();
    });
    it('should return false if deny list is selected and track event name does not matches with denylist event name', () => {
      const mockDest = clone(destination);
      mockDest.config.eventFilteringOption = 'blacklistedEvents';

      const outcome1 = isEventDenyListed('track', 'sample track event 1234', mockDest);
      expect(outcome1).toBeFalsy();
    });
    it('should return false if deny list is selected and track event name is in different case than with denylist event name', () => {
      const mockDest = clone(destination);
      mockDest.config.eventFilteringOption = 'blacklistedEvents';

      const outcome1 = isEventDenyListed('track', 'Sample track event 2', mockDest);
      expect(outcome1).toBeFalsy();
    });
    it('should return true if allow list is selected and track event does not have event name property', () => {
      const outcome1 = isEventDenyListed('track', null, destination);
      expect(outcome1).toBeTruthy();
    });
    it('should return true if allow list is selected and track event name is not string', () => {
      // @ts-expect-error eventName is not a string
      const outcome1 = isEventDenyListed('track', true, destination);
      // @ts-expect-error eventName is not a string
      const outcome2 = isEventDenyListed('track', 12345, destination);
      expect(outcome1).toBeTruthy();
      expect(outcome2).toBeTruthy();
    });
    it('should return false if allow list is selected and track event name matches with allowlist event name', () => {
      const outcome1 = isEventDenyListed('track', 'sample track event 1', destination);
      expect(outcome1).toBeFalsy();
    });
    it('should return true if allow list is selected and track event name does not matches with allowlist event name', () => {
      const outcome1 = isEventDenyListed('track', 'sample track event 1234', destination);
      expect(outcome1).toBeTruthy();
    });
    it('should return true if allow list is selected and track event name is in different case than with with allowlist event name', () => {
      const outcome1 = isEventDenyListed('track', 'Sample track event 1', destination);
      expect(outcome1).toBeTruthy();
    });
  });
});
