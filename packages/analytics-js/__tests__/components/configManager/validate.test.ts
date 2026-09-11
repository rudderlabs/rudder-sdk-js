import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import {
  getDataServiceUrl,
  isWebpageDataServiceHost,
  isWebpageTopLevelDomain,
  validateStorageOptions,
} from '../../../src/components/configManager/util/validate';

describe('Config manager util - validate load arguments', () => {
  describe('getDataServiceUrl', () => {
    it('should return dataServiceUrl', () => {
      const dataServiceUrl = getDataServiceUrl('endpoint', false, 'test-host.com');
      expect(dataServiceUrl).toBe('https://test-host.com/endpoint');
    });

    it('should prepare the dataServiceUrl with endpoint without leading slash', () => {
      const dataServiceUrl = getDataServiceUrl('/endpoint', false, 'test-host.com');
      expect(dataServiceUrl).toBe('https://test-host.com/endpoint');
    });

    it('should return dataServiceUrl with exact domain', () => {
      const dataServiceUrl = getDataServiceUrl('endpoint', true, 'test-host.com');
      expect(dataServiceUrl).toBe('https://www.test-host.com/endpoint');
    });

    it('should derive the host from the provided top domain', () => {
      const dataServiceUrl = getDataServiceUrl('endpoint', false, 'example.co.uk');
      expect(dataServiceUrl).toBe('https://example.co.uk/endpoint');
    });

    it('should fall back to the exact origin if the top domain could not be determined', () => {
      const dataServiceUrl = getDataServiceUrl('endpoint', false, '');
      expect(dataServiceUrl).toBe('https://www.test-host.com/endpoint');
    });

    it('should use an absolute HTTPS endpoint as the data service URL as it is', () => {
      const dataServiceUrl = getDataServiceUrl(
        'https://shop.air-up.dev/rsaRequest',
        false,
        'air-up.dev',
      );
      expect(dataServiceUrl).toBe('https://shop.air-up.dev/rsaRequest');
    });

    it('should use an absolute HTTP endpoint as the data service URL as it is', () => {
      const dataServiceUrl = getDataServiceUrl(
        'http://shop.air-up.dev/rsaRequest',
        false,
        'air-up.dev',
      );
      expect(dataServiceUrl).toBe('http://shop.air-up.dev/rsaRequest');
    });

    it('should not append the default endpoint to an absolute endpoint without a path', () => {
      const dataServiceUrl = getDataServiceUrl('https://shop.air-up.dev', false, 'air-up.dev');
      expect(dataServiceUrl).toBe('https://shop.air-up.dev');
    });

    it('should ignore the exact domain flag for an absolute endpoint', () => {
      const dataServiceUrl = getDataServiceUrl(
        'https://shop.air-up.dev/rsaRequest',
        true,
        'air-up.dev',
      );
      expect(dataServiceUrl).toBe('https://shop.air-up.dev/rsaRequest');
    });
  });

  describe('isWebpageDataServiceHost', () => {
    it('should allow the exact webpage host', () => {
      expect(isWebpageDataServiceHost('www.test-host.com', 'test-host.com', false)).toBe(true);
    });

    it('should allow the webpage top domain', () => {
      expect(isWebpageDataServiceHost('test-host.com', 'test-host.com', false)).toBe(true);
    });

    it('should allow a sibling subdomain of the webpage top domain', () => {
      expect(isWebpageDataServiceHost('shop.test-host.com', 'test-host.com', false)).toBe(true);
    });

    it('should not allow a host outside the webpage top domain', () => {
      expect(isWebpageDataServiceHost('random-host.com', 'test-host.com', false)).toBe(false);
    });

    it('should not allow a host that merely ends with the webpage top domain', () => {
      expect(isWebpageDataServiceHost('nottest-host.com', 'test-host.com', false)).toBe(false);
    });

    it('should only allow the exact webpage host for host-only cookies', () => {
      expect(isWebpageDataServiceHost('shop.test-host.com', 'test-host.com', true)).toBe(false);
      expect(isWebpageDataServiceHost('www.test-host.com', 'test-host.com', true)).toBe(true);
    });

    it('should only allow the exact webpage host if the top domain could not be determined', () => {
      expect(isWebpageDataServiceHost('test-host.com', '', false)).toBe(false);
      expect(isWebpageDataServiceHost('www.test-host.com', '', false)).toBe(true);
    });
  });

  describe('isWebpageTopLevelDomain', () => {
    it('should return true for top level domain', () => {
      const isTopLevel = isWebpageTopLevelDomain('test-host.com');
      expect(isTopLevel).toBe(true);
    });

    it('should return false for subdomain', () => {
      const isTopLevel = isWebpageTopLevelDomain('sub.test-host.com');
      expect(isTopLevel).toBe(false);
    });
  });

  describe('validateStorageOptions', () => {
    const logger = { warn: jest.fn(), error: jest.fn() } as unknown as ILogger;

    beforeEach(() => {
      (logger.warn as jest.Mock).mockClear();
    });

    it('should not warn for supported storage options', () => {
      validateStorageOptions(
        { type: 'localStorage', entries: { anonymousId: { type: 'cookieStorage' } } },
        'ConfigManager',
        logger,
      );

      expect(logger.warn).not.toHaveBeenCalled();
    });

    it.each([undefined, null, 'a string', 42, true, [], () => {}])(
      'should not warn or throw for a non object storage options value: %p',
      storageOpts => {
        // @ts-expect-error testing invalid values
        expect(() => validateStorageOptions(storageOpts, 'ConsentAPI', logger)).not.toThrow();
        expect(logger.warn).not.toHaveBeenCalled();
      },
    );

    it('should warn for an unsupported storage type', () => {
      // @ts-expect-error testing invalid value
      validateStorageOptions({ type: 'random-type' }, 'ConfigManager', logger);

      expect(logger.warn).toHaveBeenCalledWith(
        'ConfigManager:: The storage type "random-type" is not supported. Please choose one of the following supported types: "localStorage,memoryStorage,cookieStorage,sessionStorage,none". The default storage type will be used instead.',
      );
    });

    it('should warn for each entry with an unsupported storage type', () => {
      validateStorageOptions(
        {
          entries: {
            // @ts-expect-error testing invalid value
            anonymousId: { type: 'localStoarge' },
            sessionInfo: { type: 'cookieStorage' },
            // @ts-expect-error testing invalid value
            userId: { type: 'random-type' },
          },
        },
        'ConsentAPI',
        logger,
      );

      expect(logger.warn).toHaveBeenCalledTimes(2);
      expect(logger.warn).toHaveBeenCalledWith(
        'ConsentAPI:: The storage type "localStoarge" configured for the entry "anonymousId" is not supported. Please choose one of the following supported types: "localStorage,memoryStorage,cookieStorage,sessionStorage,none". The default storage type will be used instead.',
      );
      expect(logger.warn).toHaveBeenCalledWith(
        'ConsentAPI:: The storage type "random-type" configured for the entry "userId" is not supported. Please choose one of the following supported types: "localStorage,memoryStorage,cookieStorage,sessionStorage,none". The default storage type will be used instead.',
      );
    });
  });
});
