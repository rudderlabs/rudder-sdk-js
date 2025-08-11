import { clone } from 'ramda';
import type { Destination } from '@rudderstack/analytics-js-common/types/Destination';
import {
  isEventDenyListed,
  shouldApplyTransformation,
  sendEventToDestination,
} from '../../src/nativeDestinationQueue/utilities';
import type { RudderContext, RudderEvent } from '@rudderstack/analytics-js-common/types/Event';
import { defaultErrorHandler } from '@rudderstack/analytics-js-common/__mocks__/ErrorHandler';

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
      integration: {
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

  describe('shouldApplyTransformation', () => {
    const destination: Destination = {
      id: 'dest1',
      displayName: 'Destination 1',
      userFriendlyId: 'dest1_friendly',
      enabled: true,
      shouldApplyDeviceModeTransformation: true,
      propagateEventsUntransformedOnError: false,
      config: {
        apiKey: 'key1',
        blacklistedEvents: [],
        whitelistedEvents: [],
        eventFilteringOption: 'disable' as const,
      },
    };

    it('should return false if cloned is undefined but shouldApplyDeviceModeTransformation is false', () => {
      const dest = { ...destination, shouldApplyDeviceModeTransformation: false };
      expect(shouldApplyTransformation(dest)).toBe(false);
    });

    it('should return true if shouldApplyDeviceModeTransformation is true and cloned is undefined', () => {
      expect(shouldApplyTransformation(destination)).toBe(true);
    });

    it('should return true if shouldApplyDeviceModeTransformation is true and not cloned', () => {
      const dest = { ...destination, cloned: false };
      expect(shouldApplyTransformation(dest)).toBe(true);
    });

    it('should return false when shouldApplyDeviceModeTransformation and cloned both are true', () => {
      const dest = { ...destination, cloned: true };
      expect(shouldApplyTransformation(dest)).toBe(false);
    });

    it('should return false if both shouldApplyDeviceModeTransformation and cloned are false', () => {
      const dest = { ...destination, shouldApplyDeviceModeTransformation: false, cloned: false };
      expect(shouldApplyTransformation(dest)).toBe(false);
    });
  });

  describe('sendEventToDestination', () => {
    const sampleTrackEvent = {
      type: 'track',
      event: 'sample event',
      channel: 'web',
      anonymousId: 'anonymousId',
      originalTimestamp: new Date().toISOString(),
      context: {} as RudderContext,
      integrations: {},
      messageId: 'messageId',
    } satisfies RudderEvent;

    it('should send the event to the destination', () => {
      const destination = {
        integration: {
          track: jest.fn(),
        },
        userFriendlyId: 'ID_sample-destination-id',
        displayName: 'Destination Display Name',
      } as unknown as Destination;

      sendEventToDestination(sampleTrackEvent, destination);

      expect(destination.integration?.track).toHaveBeenCalledTimes(1);
      expect(destination.integration?.track).toHaveBeenCalledWith({ message: sampleTrackEvent });
    });

    it('should skip sending the event if the event api is not supported by the integration', () => {
      const destination = {
        integration: {
          page: jest.fn(),
        },
        userFriendlyId: 'ID_sample-destination-id',
        displayName: 'Destination Display Name',
      } as unknown as Destination;

      expect(() => sendEventToDestination(sampleTrackEvent, destination)).not.toThrow();
    });

    it('should handle errors thrown by the integration', () => {
      const destination = {
        integration: {
          track: jest.fn(() => {
            throw new Error('Error');
          }),
        },
        userFriendlyId: 'ID_sample-destination-id',
        displayName: 'Destination Display Name',
      } as unknown as Destination;

      sendEventToDestination(sampleTrackEvent, destination, defaultErrorHandler);

      expect(defaultErrorHandler.onError).toHaveBeenCalledWith({
        error: new Error('Error'),
        context: 'NativeDestinationQueuePlugin',
        customMessage:
          'Failed to send "track" event "sample event" to integration for destination "ID_sample-destination-id".',
        groupingHash:
          'Failed to send "track" event "sample event" to integration for destination "Destination Display Name".',
          category: 'integrations',
      });
    });

    it('should handle errors without crashing when no error handler is provided', () => {
      const destination = {
        integration: {
          track: jest.fn(() => {
            throw new Error('Error');
          }),
        },
        userFriendlyId: 'ID_sample-destination-id',
        displayName: 'Destination Display Name',
      } as unknown as Destination;

      expect(() => sendEventToDestination(sampleTrackEvent, destination)).not.toThrow();
    });

    it('should handle errors when destination has no displayName property', () => {
      const destination = {
        integration: {
          track: jest.fn(() => {
            throw new Error('Test error');
          }),
        },
        userFriendlyId: 'ID_sample-destination-id',
        // No displayName property
      } as unknown as Destination;

      sendEventToDestination(sampleTrackEvent, destination, defaultErrorHandler);

      expect(defaultErrorHandler.onError).toHaveBeenCalledWith({
        error: new Error('Test error'),
        context: 'NativeDestinationQueuePlugin',
        customMessage:
          'Failed to send "track" event "sample event" to integration for destination "ID_sample-destination-id".',
        groupingHash:
          'Failed to send "track" event "sample event" to integration for destination "undefined".',
        category: 'integrations',
      });
    });

    it('should handle errors when destination has no userFriendlyId property', () => {
      const destination = {
        integration: {
          track: jest.fn(() => {
            throw new Error('Test error');
          }),
        },
        // No userFriendlyId property
        displayName: 'Destination Display Name',
      } as unknown as Destination;

      sendEventToDestination(sampleTrackEvent, destination, defaultErrorHandler);

      expect(defaultErrorHandler.onError).toHaveBeenCalledWith({
        error: new Error('Test error'),
        context: 'NativeDestinationQueuePlugin',
        customMessage:
          'Failed to send "track" event "sample event" to integration for destination "undefined".',
        groupingHash:
          'Failed to send "track" event "sample event" to integration for destination "Destination Display Name".',
        category: 'integrations',
      });
    });
  });
});
