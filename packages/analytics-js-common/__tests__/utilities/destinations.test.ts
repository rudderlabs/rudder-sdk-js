import {
  getNonCloudDestinations,
  isNonCloudDestination,
  isHybridModeDestination,
} from '../../src/utilities/destinations';
import { destinations } from '../../__fixtures__/fixtures';
import type { Destination } from '../../src/types/Destination';

describe('Config manager util - filterEnabledDestination', () => {
  it('should get non-cloud destinations', () => {
    const actualOutcome = getNonCloudDestinations(destinations);
    expect(actualOutcome.length).toBe(3);
  });

  it('should detect if destination is non-cloud', () => {
    const hybridDestination = isNonCloudDestination(destinations[0] as Destination);
    expect(hybridDestination).toBeTruthy();

    const nativeDest = isNonCloudDestination(destinations[1] as Destination);
    expect(nativeDest).toBeTruthy();

    const cloudDest = isNonCloudDestination(destinations[2] as Destination);
    expect(cloudDest).toBeFalsy();
  });

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
