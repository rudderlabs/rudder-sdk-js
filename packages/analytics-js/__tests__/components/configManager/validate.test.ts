import type { ILogger } from '@rudderstack/analytics-js-common/types/Logger';
import {
  getTopDomainUrl,
  getDataServiceUrl,
  isWebpageTopLevelDomain,
  validateStorageOptions,
} from '../../../src/components/configManager/util/validate';

describe('Config manager util - validate load arguments', () => {
  describe('getTopDomainUrl', () => {
    const testCaseData = [
      ['https://sub.example.com', 'https://example.com'],
      ['https://www.example.com/some/page/iam/viewing.html', 'https://example.com'],
      ['https://example.com/some/page/iam/viewing.html', 'https://example.com'],
      ['http://localhost/some/page/iam/viewing.html', 'http://localhost'],
    ];
    it.each(testCaseData)('if url is "%s" it should return "%s"', (input, expectedOutput) => {
      const actualOutput = getTopDomainUrl(input);
      expect(actualOutput).toBe(expectedOutput);
    });
  });
  describe('getDataServiceUrl', () => {
    it('should return dataServiceUrl', () => {
      const dataServiceUrl = getDataServiceUrl('endpoint', false);
      expect(dataServiceUrl).toBe('https://test-host.com/endpoint');
    });
    it('should prepare the dataServiceUrl with endpoint without leading slash', () => {
      const dataServiceUrl = getDataServiceUrl('/endpoint', false);
      expect(dataServiceUrl).toBe('https://test-host.com/endpoint');
    });
    it('should return dataServiceUrl with exact domain', () => {
      const dataServiceUrl = getDataServiceUrl('endpoint', true);
      expect(dataServiceUrl).toBe('https://www.test-host.com/endpoint');
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
