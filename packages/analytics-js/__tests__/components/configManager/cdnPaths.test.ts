import { defaultLogger } from '../../../src/services/Logger';
import { resetState, state } from '../../../src/state';
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
  const dummyScriptURL = 'https://www.dummy.url/fromScript/v3/modern/rsa.min.js';
  const dummyVersion = '3.x.x';

  beforeEach(() => {
    getSDKUrlMock.mockImplementation(() => dummyScriptURL);

    // @ts-expect-error needed for testing
    state.context.app.value.installType = 'cdn';
  });

  afterEach(() => {
    window.__LOCK_DEPS_VERSION__ = false;
    jest.resetAllMocks();

    resetState();
  });

  describe('getIntegrationsCDNPath', () => {
    const dummyCustomURL = 'https://www.dummy.url/integrations/';

    it('should return custom URL if it is valid', () => {
      window.__LOCK_DEPS_VERSION__ = false;
      const integrationsCDNPath = getIntegrationsCDNPath(
        dummyVersion,
        dummyCustomURL,
        defaultLogger,
      );
      expect(integrationsCDNPath).toBe('https://www.dummy.url/integrations');
    });

    it('should throw error if invalid custom URL is provided', () => {
      const errorSpy = jest.spyOn(defaultLogger, 'error');
      window.__LOCK_DEPS_VERSION__ = false;
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, '/', defaultLogger);
      expect(integrationsCDNPath).toBeNull();
      expect(errorSpy).toHaveBeenCalledWith(
        'ConfigManager:: The base URL "/" for integrations is not valid.',
      );

      errorSpy.mockRestore();
    });

    it('should return script src path if script src exists and integrations version is not locked', () => {
      window.__LOCK_DEPS_VERSION__ = false;
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(integrationsCDNPath).toBe(
        'https://www.dummy.url/fromScript/v3/modern/js-integrations',
      );
    });

    it('should return script src path with versioned folder if script src exists and integrations version is locked', () => {
      window.__LOCK_DEPS_VERSION__ = true;
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(integrationsCDNPath).toBe(
        'https://www.dummy.url/fromScript/3.x.x/modern/js-integrations',
      );
    });

    it('should return default path if no script src exists and integrations version is not locked', () => {
      getSDKUrlMock.mockImplementation(() => undefined);

      window.__LOCK_DEPS_VERSION__ = false;
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(integrationsCDNPath).toBe('https://cdn.rudderlabs.com/v3/modern/js-integrations');
    });

    it('should return default path with versioned folder if no script src exists and integrations version is locked', () => {
      getSDKUrlMock.mockImplementation(() => undefined);

      window.__LOCK_DEPS_VERSION__ = true;
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(integrationsCDNPath).toBe(
        `https://cdn.rudderlabs.com/${dummyVersion}/modern/js-integrations`,
      );
    });

    it('should return that is not version locked when the script source is not as per the convention', () => {
      getSDKUrlMock.mockImplementation(
        () => 'https://www.dummy.url/fromScript/v3/custom/rsa.min.js',
      );

      window.__LOCK_DEPS_VERSION__ = true;
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(integrationsCDNPath).toBe(
        `https://www.dummy.url/fromScript/v3/custom/js-integrations`,
      );
    });

    it('should return the url that is not version locked when the script source is slightly off from the convention', () => {
      // /v3/modern/js-integrations matches but it is in the middle of the path
      getSDKUrlMock.mockImplementation(
        () => 'https://www.dummy.url/fromScript/v3/modern/js-integrations/custom/rsa.min.js',
      );

      window.__LOCK_DEPS_VERSION__ = true;
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(integrationsCDNPath).toBe(
        `https://www.dummy.url/fromScript/v3/modern/js-integrations/custom/js-integrations`,
      );
    });

    it('should preserve custom URL even if it follows the version lock convention', () => {
      window.__LOCK_DEPS_VERSION__ = true;
      const integrationsCDNPath = getIntegrationsCDNPath(
        dummyVersion,
        'https://www.dummy.url/v3/modern/js-integrations///',
        defaultLogger,
      );
      expect(integrationsCDNPath).toBe('https://www.dummy.url/v3/modern/js-integrations');
    });

    it('should not lock the version on custom URL if it does not follow the convention', () => {
      window.__LOCK_DEPS_VERSION__ = true;
      const integrationsCDNPath = getIntegrationsCDNPath(
        dummyVersion,
        dummyCustomURL,
        defaultLogger,
      );
      expect(integrationsCDNPath).toBe('https://www.dummy.url/integrations');
    });

    it('should return the default component url in case of npm installation', () => {
      // @ts-expect-error needed for testing
      state.context.app.value.installType = 'npm';

      window.__LOCK_DEPS_VERSION__ = false;
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(integrationsCDNPath).toBe('https://cdn.rudderlabs.com/v3/modern/js-integrations');
    });

    it('should lock version on default component url in case of npm installation', () => {
      // @ts-expect-error needed for testing
      state.context.app.value.installType = 'npm';

      window.__LOCK_DEPS_VERSION__ = true;
      const integrationsCDNPath = getIntegrationsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(integrationsCDNPath).toBe('https://cdn.rudderlabs.com/3.x.x/modern/js-integrations');
    });
  });

  describe('getPluginsCDNPath', () => {
    const dummyCustomURL = 'https://www.dummy.url/plugins/';

    it('should return plugins CDN URL if a valid custom URL is provided', () => {
      window.__LOCK_DEPS_VERSION__ = false;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, dummyCustomURL, defaultLogger);
      expect(pluginsCDNPath).toBe('https://www.dummy.url/plugins');
    });

    it('should throw error if invalid custom URL is provided', () => {
      const errorSpy = jest.spyOn(defaultLogger, 'error');
      window.__LOCK_DEPS_VERSION__ = false;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, 'htp:/some.broken.url', defaultLogger);
      expect(pluginsCDNPath).toBeNull();
      expect(errorSpy).toHaveBeenCalledWith(
        'ConfigManager:: The base URL "htp:/some.broken.url" for plugins is not valid.',
      );

      errorSpy.mockRestore();
    });

    it('should return script src path if script src exists and plugins version is not locked', () => {
      window.__LOCK_DEPS_VERSION__ = false;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(pluginsCDNPath).toBe('https://www.dummy.url/fromScript/v3/modern/plugins');
    });

    it('should return script src path with versioned folder if script src exists and plugins version is locked', () => {
      window.__LOCK_DEPS_VERSION__ = true;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(pluginsCDNPath).toBe('https://www.dummy.url/fromScript/3.x.x/modern/plugins');
    });

    it('should return default path if no script src exists and plugins version is not locked', () => {
      getSDKUrlMock.mockImplementation(() => undefined);

      window.__LOCK_DEPS_VERSION__ = false;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(pluginsCDNPath).toBe('https://cdn.rudderlabs.com/v3/modern/plugins');
    });

    it('should return default path if no script src exists but plugins version is locked', () => {
      getSDKUrlMock.mockImplementation(() => undefined);

      window.__LOCK_DEPS_VERSION__ = true;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(pluginsCDNPath).toBe('https://cdn.rudderlabs.com/3.x.x/modern/plugins');
    });

    it('should return that is not version locked when the script source is not as per the convention', () => {
      getSDKUrlMock.mockImplementation(
        () => 'https://www.dummy.url/fromScript/v3/custom/rsa.min.js',
      );

      window.__LOCK_DEPS_VERSION__ = true;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(pluginsCDNPath).toBe(`https://www.dummy.url/fromScript/v3/custom/plugins`);
    });

    it('should return the url that is not version locked when the script source is slightly off from the convention', () => {
      // /v3/modern/plugins matches but it is in the middle of the path
      getSDKUrlMock.mockImplementation(
        () => 'https://www.dummy.url/fromScript/v3/modern/plugins/custom/rsa.min.js',
      );

      window.__LOCK_DEPS_VERSION__ = true;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(pluginsCDNPath).toBe(
        `https://www.dummy.url/fromScript/v3/modern/plugins/custom/plugins`,
      );
    });

    it('should preserve custom URL even if it follows the version lock convention', () => {
      window.__LOCK_DEPS_VERSION__ = true;
      const pluginsCDNPath = getPluginsCDNPath(
        dummyVersion,
        'https://www.dummy.url/v3/modern/plugins///',
        defaultLogger,
      );
      expect(pluginsCDNPath).toBe('https://www.dummy.url/v3/modern/plugins');
    });

    it('should not lock the version on custom URL if it does not follow the convention', () => {
      window.__LOCK_DEPS_VERSION__ = true;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, dummyCustomURL, defaultLogger);
      expect(pluginsCDNPath).toBe('https://www.dummy.url/plugins');
    });

    it('should return the default component url in case of npm installation', () => {
      // @ts-expect-error needed for testing
      state.context.app.value.installType = 'npm';

      window.__LOCK_DEPS_VERSION__ = false;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(pluginsCDNPath).toBe('https://cdn.rudderlabs.com/v3/modern/plugins');
    });

    it('should lock version on default component url in case of npm installation', () => {
      // @ts-expect-error needed for testing
      state.context.app.value.installType = 'npm';

      window.__LOCK_DEPS_VERSION__ = true;
      const pluginsCDNPath = getPluginsCDNPath(dummyVersion, undefined, defaultLogger);
      expect(pluginsCDNPath).toBe('https://cdn.rudderlabs.com/3.x.x/modern/plugins');
    });
  });
});
