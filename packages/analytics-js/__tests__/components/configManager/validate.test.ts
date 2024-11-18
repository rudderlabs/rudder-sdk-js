import {
  getTopDomainUrl,
  getDataServiceUrl,
  isWebpageTopLevelDomain,
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
});
