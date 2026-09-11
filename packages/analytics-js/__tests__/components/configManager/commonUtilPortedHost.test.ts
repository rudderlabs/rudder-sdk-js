/**
 * @jest-environment-options {"url": "https://www.test-host.com:8443/some/page"}
 */
import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import { updateStorageStateFromLoadOptions } from '../../../src/components/configManager/util/commonUtil';
import { state, resetState } from '../../../src/state';

describe('Config Manager Common Utilities - webpage served on a custom port', () => {
  const mockLogger = {
    warn: jest.fn(),
    error: jest.fn(),
  } as unknown as ILogger;

  beforeEach(() => {
    resetState();
    state.lifecycle.writeKey.value = 'writeKey';
  });

  it('should keep the port of the current webpage in the derived data service URL', () => {
    state.loadOptions.value.useServerSideCookies = true;

    updateStorageStateFromLoadOptions(mockLogger);

    expect(state.serverCookies.isEnabledServerSideCookies.value).toBe(true);
    expect(state.serverCookies.dataServiceUrl.value).toBe('https://test-host.com:8443/rsaRequest');
  });
});
