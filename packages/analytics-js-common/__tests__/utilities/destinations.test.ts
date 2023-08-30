import {
  getNonCloudDestinations,
  isNonCloudDestination,
  isHybridModeDestination,
} from '../../src/utilities/destinations';
import { dummySourceConfigResponse } from '../../__fixtures__/fixtures';

describe('Config manager util - filterEnabledDestination', () => {
  it('should get non-cloud destinations', () => {
    const actualOutcome = getNonCloudDestinations(dummySourceConfigResponse.source.destinations);
    expect(actualOutcome.length).toBe(3);
  });

  it('should detect if destination is non-cloud', () => {
    const hybridDestination = isNonCloudDestination(
      dummySourceConfigResponse.source.destinations[0],
    );
    expect(hybridDestination).toBeTruthy();

    const nativeDest = isNonCloudDestination(dummySourceConfigResponse.source.destinations[1]);
    expect(nativeDest).toBeTruthy();

    const cloudDest = isNonCloudDestination(dummySourceConfigResponse.source.destinations[2]);
    expect(cloudDest).toBeFalsy();
  });

  it('should detect if a destination is hybrid', () => {
    const hybridDestination = isHybridModeDestination(
      dummySourceConfigResponse.source.destinations[0],
    );
    expect(hybridDestination).toBeTruthy();

    const nativeDest = isHybridModeDestination(dummySourceConfigResponse.source.destinations[1]);
    expect(nativeDest).toBeFalsy();

    const cloudDest = isHybridModeDestination(dummySourceConfigResponse.source.destinations[2]);
    expect(cloudDest).toBeFalsy();

    const hybridDestination2 = isHybridModeDestination(
      dummySourceConfigResponse.source.destinations[3],
    );
    expect(hybridDestination2).toBeTruthy();
  });
});
