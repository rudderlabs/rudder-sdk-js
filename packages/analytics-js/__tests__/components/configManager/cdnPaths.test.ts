import {
  getIntegrationsCDNPath,
  getPluginsCDNPath,
} from '../../../src/components/configManager/util/cdnPaths';

const getSDKUrlMock = jest.fn();

jest.mock('../../../src/components/configManager/util/commonUtil.ts', () => {
  const originalModule = jest.requireActual(
    '../../../src/components/configManager/util/commonUtil.ts',
  );

  return {
    __esModule: true,
    ...originalModule,
    getSDKUrl: (...args: any[]) => getSDKUrlMock(...args),
  };
});

describe('CDN path utilities', () => {
  describe('getIntegrationsCDNPath', () => {
    const dummyCustomURL = 'https://www.dummy.url/integrations/';
    const dummyScriptURL = 'https://www.dummy.url/fromScript/v3/modern/rsa.min.js';
    const dummyVersion = '3.x.x';

    beforeEach(() => {
      getSDKUrlMock.mockImplementation(() => dummyScriptURL);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return custom URL if it is valid', () => {
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, false, dummyCustomURL);
      expect(integrationsCDNPath).toBe('https://www.dummy.url/integrations');
    });

    it('should throw error if invalid custom URL is provided', () => {
      const integrationsCDNPath = () => getIntegrationsCDNPath(dummyVersion, false, '/');
      expect(integrationsCDNPath).toThrow(
        'Failed to load the SDK as the base URL "/" for integrations is not valid.',
      );
    });

    it('should return script src path if script src exists and integrations version is not locked', () => {
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, false);
      expect(integrationsCDNPath).toBe(
        'https://www.dummy.url/fromScript/v3/modern/js-integrations',
      );
    });

    it('should return script src path with versioned folder if script src exists and integrations version is locked', () => {
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, true);
      expect(integrationsCDNPath).toBe(
        'https://www.dummy.url/fromScript/3.x.x/modern/js-integrations',
      );
    });

    it('should return default path if no script src exists and integrations version is not locked', () => {
      getSDKUrlMock.mockImplementation(() => undefined);

      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, false);
      expect(integrationsCDNPath).toBe('https://cdn.rudderlabs.com/v3/modern/js-integrations');
    });

    it('should return default path with versioned folder if no script src exists and integrations version is locked', () => {
      getSDKUrlMock.mockImplementation(() => undefined);

      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, true);
      expect(integrationsCDNPath).toBe(
        `https://cdn.rudderlabs.com/${dummyVersion}/modern/js-integrations`,
      );
    });

    it('should return that is not version locked when the script source is not as per the convention', () => {
      getSDKUrlMock.mockImplementation(
        () => 'https://www.dummy.url/fromScript/v3/custom/rsa.min.js',
      );

      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, true);
      expect(integrationsCDNPath).toBe(
        `https://www.dummy.url/fromScript/v3/custom/js-integrations`,
      );
    });
  });

  describe('getPluginsCDNPath', () => {
    const dummyCustomURL = 'https://www.dummy.url/plugins/';
    const dummyScriptURL = 'https://www.dummy.url/fromScript/v3/modern/rsa.min.js';
    const dummyVersion = '3.x.x';

    beforeEach(() => {
      getSDKUrlMock.mockImplementation(() => dummyScriptURL);
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should return plugins CDN URL if a valid custom URL is provided', () => {
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, false, dummyCustomURL);
      expect(pluginsCDNPath).toBe('https://www.dummy.url/plugins');
    });

    it('should throw error if invalid custom URL is provided', () => {
      const pluginsCDNPath = () => getPluginsCDNPath(dummyVersion, false, 'htp:/some.broken.url');
      expect(pluginsCDNPath).toThrow(
        'Failed to load the SDK as the base URL "htp:/some.broken.url" for plugins is not valid.',
      );
    });

    it('should return script src path if script src exists and plugins version is not locked', () => {
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, false);
      expect(pluginsCDNPath).toBe('https://www.dummy.url/fromScript/v3/modern/plugins');
    });

    it('should return script src path with versioned folder if script src exists and plugins version is locked', () => {
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, true);
      expect(pluginsCDNPath).toBe('https://www.dummy.url/fromScript/3.x.x/modern/plugins');
    });

    it('should return default path if no script src exists and plugins version is not locked', () => {
      getSDKUrlMock.mockImplementation(() => undefined);

      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, false);
      expect(pluginsCDNPath).toBe('https://cdn.rudderlabs.com/v3/modern/plugins');
    });

    it('should return default path if no script src exists but plugins version is locked', () => {
      getSDKUrlMock.mockImplementation(() => undefined);

      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, true);
      expect(pluginsCDNPath).toBe('https://cdn.rudderlabs.com/3.x.x/modern/plugins');
    });

    it('should return that is not version locked when the script source is not as per the convention', () => {
      getSDKUrlMock.mockImplementation(
        () => 'https://www.dummy.url/fromScript/v3/custom/rsa.min.js',
      );

      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, true);
      expect(pluginsCDNPath).toBe(`https://www.dummy.url/fromScript/v3/custom/plugins`);
    });
  });
});
