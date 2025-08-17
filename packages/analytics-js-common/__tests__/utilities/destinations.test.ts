import {
  getNonCloudDestinations,
  isNonCloudDestination,
  isHybridModeDestination,
  getDestinationUserFriendlyId,
} from '../../src/utilities/destinations';
import { destinations } from '../../__fixtures__/fixtures';
import type { Destination } from '../../src/types/Destination';

describe('Destination utilities', () => {
  describe('getNonCloudDestinations', () => {
    it('should get non-cloud destinations', () => {
      const actualOutcome = getNonCloudDestinations(destinations);
      expect(actualOutcome.length).toBe(3);
    });
  });

  describe('isNonCloudDestination', () => {
    it('should detect if destination is non-cloud', () => {
      const hybridDestination = isNonCloudDestination(destinations[0] as Destination);
      expect(hybridDestination).toBeTruthy();

      const nativeDest = isNonCloudDestination(destinations[1] as Destination);
      expect(nativeDest).toBeTruthy();

      const cloudDest = isNonCloudDestination(destinations[2] as Destination);
      expect(cloudDest).toBeFalsy();
    });
  });

  describe('isHybridModeDestination', () => {
    it('should detect if a destination is hybrid', () => {
      const hybridDestination = isHybridModeDestination(destinations[0] as Destination);
      expect(hybridDestination).toBeTruthy();

      const nativeDest = isHybridModeDestination(destinations[1] as Destination);
      expect(nativeDest).toBeFalsy();

      const cloudDest = isHybridModeDestination(destinations[2] as Destination);
      expect(cloudDest).toBeFalsy();

      const hybridDestination2 = isHybridModeDestination(destinations[3] as Destination);
      expect(hybridDestination2).toBeTruthy();
    });
  });

  describe('getDestinationUserFriendlyId', () => {
    it('should get the user friendly id for a destination', () => {
      const userFriendlyId = getDestinationUserFriendlyId(
        destinations[0]!.displayName,
        destinations[0]!.id,
      );
      expect(userFriendlyId).toBe('GA4-for-JS-SDK-Hybrid___dummyDestinationId');

      const userFriendlyId2 = getDestinationUserFriendlyId(
        destinations[1]!.displayName,
        destinations[1]!.id,
      );
      expect(userFriendlyId2).toBe('GA4-for-JS-SDK-Device___dummyDestinationId2');
    });
  });
});
