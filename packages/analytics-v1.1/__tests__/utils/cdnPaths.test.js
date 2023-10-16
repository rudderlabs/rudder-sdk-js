import { getIntegrationsCDNPath } from '../../src/utils/cdnPaths';
import { CDN_INT_DIR, DEST_SDK_BASE_URL, SDK_CDN_BASE_URL } from '../../src/utils/constants';
import { getSDKUrlInfo } from '../../src/utils/utils';

jest.mock('../../src/utils/utils', () => {
  const originalModule = jest.requireActual('../../src/utils/utils');

  return {
    __esModule: true,
    ...originalModule,
    getSDKUrlInfo: jest.fn(),
  };
});

describe('CDN Paths: getIntegrationsCDNPath', () => {
  const dummyCustomURL = 'https://www.dummy.url/integrations';
  const dummyScriptURL = 'https://www.dummy.url/fromScript/v1.1/rudder-analytics.js';
  const dummyVersion = '2.x.x';

  beforeEach(() => {
    getSDKUrlInfo.mockImplementation(() => ({ sdkURL: dummyScriptURL }));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return custom url if valid url is provided', () => {
    const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, false, dummyCustomURL);
    expect(integrationsCDNPath).toBe(dummyCustomURL);
  });

  it('should throw error if invalid custom url is provided', () => {
    const integrationsCDNPath = () => getIntegrationsCDNPath(dummyVersion, false, '/');
    expect(integrationsCDNPath).toThrow(
      'Failed to load Rudder SDK: CDN base URL for integrations is not valid',
    );
  });

  it('should return script src path if script src exists and integrations version is not locked', () => {
    const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, false);
    expect(integrationsCDNPath).toBe('https://www.dummy.url/fromScript/v1.1/js-integrations');
  });

  it('should return script src path with versioned folder if script src exists and integrations version is locked', () => {
    const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, true);
    expect(integrationsCDNPath).toBe('https://www.dummy.url/fromScript/2.x.x/js-integrations');
  });

  it('should return default path if no script src exists and integrations version is not locked', () => {
    getSDKUrlInfo.mockImplementation(() => ({ sdkURL: undefined }));

    const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, false);
    expect(integrationsCDNPath).toBe(DEST_SDK_BASE_URL);
  });

  it('should return default path with versioned folder if no script src exists and integrations version is locked', () => {
    getSDKUrlInfo.mockImplementation(() => ({ sdkURL: undefined }));

    const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, true);
    expect(integrationsCDNPath).toBe(`${SDK_CDN_BASE_URL}/${dummyVersion}/${CDN_INT_DIR}`);
  });
});
