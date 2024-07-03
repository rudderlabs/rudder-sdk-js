import {
  validateLoadArgs,
  getTopDomainUrl,
  getDataServiceUrl,
  isTopLevelDomain,
} from '../../../src/components/configManager/util/validate';

describe('Config manager util - validate load arguments', () => {
  const sampleWriteKey = 'dummyWriteKey';
  const sampleDataPlaneUrl = 'https://www.dummy.url';
  const errorMsg =
    'The write key " " is invalid. It must be a non-empty string. Please check that the write key is correct and try again.';

  it('should not throw error for valid write key', () => {
    expect(() => {
      validateLoadArgs(sampleWriteKey);
    }).not.toThrow(errorMsg);
  });
  it('should not throw error for valid data plane url', () => {
    expect(() => {
      validateLoadArgs(sampleWriteKey, sampleDataPlaneUrl);
    }).not.toThrow('Unable to load the SDK due to invalid data plane URL: " "');
  });
  it('should throw error for invalid write key', () => {
    expect(() => {
      validateLoadArgs(' ');
    }).toThrow(errorMsg);
  });
  it('should throw error for invalid data plane url', () => {
    expect(() => {
      validateLoadArgs(sampleWriteKey, ' ');
    }).toThrow(
      'The data plane URL " " is invalid. It must be a valid URL string. Please check that the data plane URL is correct and try again.',
    );
  });
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

  describe('isTopLevelDomain', () => {
    it('should return true for top level domain', () => {
      const isTopLevel = isTopLevelDomain('test-host.com');
      expect(isTopLevel).toBe(true);
    });
    it('should return false for subdomain', () => {
      const isTopLevel = isTopLevelDomain('sub.test-host.com');
      expect(isTopLevel).toBe(false);
    });
  });
});
